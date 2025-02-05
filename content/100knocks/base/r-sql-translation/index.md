---
title: "R でデータベース操作 – dplyr コードはどのように SQLクエリに変換されるか"
slug: "r-sql-translation"
date: 2025-01-06T01:22:07+09:00
draft: false
# draft: true
weight: 20
# description: ""
# summary: ""
categories: ["100本ノック+α (基本情報)"]
tags: ["R", "SQL"]
# image: rdb.webp
# disableShare: false
# ShowReadingTime: false
# ShowWordCount: false
# ShowToc: true
# TocOpen: true
tableOfContents:
  ordered: false
  startLevel: 2
  endLevel: 4
---

**前回の記事:**

- {{< ref2 path="r-sql-auto-query" >}}

## はじめに

前回は SQLクエリの自動生成について解説しましたが、`dbplyr` の SQL 変換には以下の 2つの部分があります。

- dplyr 操作全体の変換
- dplyr 操作内の個々の式の変換

この記事では、これらについて 2つのセクションに分けて解説します。

まずデモため、次の 2つのテーブルを用意します。

```r
library(DBI)
library(dplyr)
library(dbplyr)
library(duckdb)
library(tibble)

df_sales = tribble(
  ~store, ~month, ~sales, ~profit, 
  "S001",  4L,     150,   30, 
  "S001",  5L,     170,   34, 
  "S001",  6L,     140,   27, 
  "S001",  7L,     160,   32, 
  "S002",  4L,     NA,    28, 
  "S002",  5L,     160,   31, 
  "S002",  6L,     130,   27, 
  "S002",  7L,     150,   28
)

df_master = tribble(
  ~store, ~name,    ~pref, 
  "S001", "storeA", "Tokyo", 
  "S002", "storeB", "Osaka", 
  "S003", "storeC", "Kanagawa", 
  "S004", "storeD", "Fukuoka"
)

# DuckDB に接続 (一時データベース)
con = DBI::dbConnect(duckdb::duckdb())

# テーブルとしてデータベースに登録
DBI::dbWriteTable(
  con, "store_sales", df_sales, overwrite = TRUE
)
DBI::dbWriteTable(
  con, "store_master", df_master, overwrite = TRUE
)

# テーブルを dplyr で参照
db_sales = tbl(con, "store_sales")
db_master = tbl(con, "store_master")
```

はじめに補足ですが、dbplyr の SQL 変換はいつでも完璧というわけではありません。
SQL コードは正しくても、簡潔ではない SQLクエリに変換されるケースもあります。
例えば、次の R コードは

```r
db_sales %>% filter(!is.na(sales))
```

以下の SQLクエリに変換されます。

```sql
SELECT store_sales.*
FROM store_sales
WHERE (NOT((sales IS NULL)))
```

このコードは正しいですが、`NOT((sales IS NULL))` の箇所は `sales IS NOT NULL` と書くべきですね。
この点を踏まえた上でご覧いただければと思います。

本題に入りますが、dbplyr は純粋なテーブルに対して次の `SELECT` 文を生成します。

```r
db_sales %>% show_query()
```

```sql
SELECT *
FROM store_sales
```

すべての dplyr 操作は、このような全ての列を選択する `SELECT` 文を元にして SQL を生成します。

以下の解説では、dplyr 操作で生成される SQLクエリ、および操作の結果となるテーブルの内容について掲載します。

## dplyr 操作全体の SQL変換

dplyr 操作全体がどのように SQL変換されるかについて、主要な操作を例に解説します。

### 単一テーブルの操作

#### `select()`、`rename()`、`relocate()`

`select()` は `SELECT` 句を修正します。

```r
db_sales %>% 
  select(store, sales) %>% 
  show_query()
```

```sql
SELECT store, sales
FROM store_sales
```

```text
  store sales
  <chr> <dbl>
1 S001    150
2 S001    170
3 S001    140
...
```

`rename()` についても同様です。

```r
db_sales %>% 
  rename(store_id = store) %>% 
  show_query()
```

```sql
SELECT store AS store_id, "month", sales, profit
FROM store_sales
```

```text
  store_id month sales profit
  <chr>    <int> <dbl>  <dbl>
1 S001         4   150     30
2 S001         5   170     34
3 S001         6   140     27
...
```

`relocate()` についても同様です。

```r
db_sales %>% 
  relocate(profit, sales, .after = store) %>% 
  show_query()
```

```sql
SELECT store, profit, sales, "month"
FROM store_sales
```

```text
  store profit sales month
  <chr>  <dbl> <dbl> <int>
1 S001      30   150     4
2 S001      34   170     5
3 S001      27   140     6
...
```

ここで、`"month"` がダブルクォートで括られてるのは、これが DuckDB の予約語だからです。

#### `mutate()`

`mutate()` は `SELECT` 句を修正します。

```r
db_sales %>% 
  mutate(
    margin = 100 * profit / sales, 
    .keep = "unused"
  ) %>% 
  show_query()
```

```sql
SELECT store, "month", (100.0 * profit) / sales AS margin
FROM store_sales
```

```text
  store month margin
  <chr> <int>  <dbl>
1 S001      4   20  
2 S001      5   20  
3 S001      6   19.3
...
```

#### `filter()`

`filter()` は `WHERE` 句を生成します
```r
db_sales %>% 
  filter(month == 4L, profit >= 30) %>% 
  show_query()
```

```sql
SELECT store_sales.*
FROM store_sales
WHERE ("month" = 4) AND (profit >= 30.0)
```

```text
  store month sales profit
  <chr> <int> <dbl>  <dbl>
1 S001      4   150     30
```

#### `arrange()`

`arrange()` は `ORDER BY` 句を生成します。

```r
db_sales %>% 
  arrange(month, desc(profit)) %>% 
  show_query()
```

```sql
SELECT store_sales.*
FROM store_sales
ORDER BY "month", profit DESC
```

```text
  store month sales profit
  <chr> <int> <dbl>  <dbl>
1 S001      4   150     30
2 S002      4    NA     28
3 S001      5   170     34
4 S002      5   160     31
...
```

#### `summarise()`

`summarise()` は集計関数と合わせて `SELECT` 句を修正します。

```r
db_sales %>% 
  summarise(avg_profit = mean(profit)) %>% 
  show_query()
```

```sql
SELECT AVG(profit) AS avg_profit
FROM store_sales
```

```text
  avg_profit
       <dbl>
1       29.6
```

#### `group_by()` \+ `summarise()`

また、`summarise()` は `group_by()` と合わせて `GROUP BY` 句を生成します。

```r
db_sales %>% 
  group_by(store) %>% 
  summarise(avg_profit = mean(profit)) %>% 
  show_query()
```

```sql
SELECT store, AVG(profit) AS avg_profit
FROM store_sales
GROUP BY store
```

```text
  store avg_profit
  <chr>      <dbl>
1 S002        28.5
2 S001        30.8
```

#### `group_by()` \+ `summarise()` \+ `filter()`


さらに、集計後の `filter()` と合わせて `HAVING` 句を生成します。

```r
db_sales %>% 
  group_by(store) %>% 
  summarise(avg_profit = mean(profit)) %>% 
  filter(avg_profit > 30) %>% 
  show_query()
```

```sql
SELECT store, AVG(profit) AS avg_profit
FROM store_sales
GROUP BY store
HAVING (AVG(profit) > 30.0)
```

```text
  store avg_profit
  <chr>      <dbl>
1 S001        30.8
```

#### `head()`

`head()` は `LIMIT` 句を生成します

```r
db_sales %>% 
  head(3) %>% 
  show_query()
```

```sql
SELECT store_sales.*
FROM store_sales
LIMIT 3
```

```text
  store month sales profit
  <chr> <int> <dbl>  <dbl>
1 S001      4   150     30
2 S001      5   170     34
3 S001      6   140     27
```

### 2つのテーブルの操作







#### `left_join()` は `LEFT JOIN` 句を生成します

```r
db_sales %>% 
  left_join(db_master, by = "store") %>% 
  show_query()
```

`inner_join()`、`right_join()` についても同様です。

## dplyr 操作内の式の SQL変換

dplyr 操作内の個々の式がどのように SQL変換されるかについて、以下に主な例を挙げます。
