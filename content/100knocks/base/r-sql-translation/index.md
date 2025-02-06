---
title: "R でデータベース操作 – dplyr コードはどのように SQLクエリに変換されるか"
slug: "r-sql-translation"
date: 2025-01-06T01:22:07+09:00
draft: false
# draft: true
weight: 40
# description: ""
# summary: ""
categories: ["100本ノック+α (基本情報)"]
tags: ["R", "SQL", "SQL自動生成"]
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

前回の記事では、dplyr を使ったテーブル操作がどのように SQL クエリへ自動変換されるかを解説しました。
しかし、変換の仕組みを正しく理解していないと、意図しない SQL が生成されることがあります。

この記事では、dplyr の主要な操作が SQL にどのように変換されるのかを解説し、データベースを効率的に操作する方法を紹介します。

まず、デモ用のデータセットを作成し、それを DuckDB に登録しておきます。

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

はじめに補足ですが、dbplyr の SQL 変換は必ずしも最適な SQL を生成するわけではありません。
冗長的な構造の SQLクエリに変換されるケースもあります。

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

この SQL は論理的には正しいですが、`NOT((sales IS NULL))` の部分は `sales IS NOT NULL` と書く方が簡潔で可読性が高くなります。
この点を踏まえた上でご覧いただければと思います。

dbplyr による SQL 変換は以下の 2つの側面に分かれるため、それぞれの観点から解説を行います。

- dplyr 操作全体の SQL 変換
- dplyr 操作内の個々の式の SQL 変換

上述の R コードの場合、`filter(, !is.na(sales))` が「dplyr 操作全体」、`!is.na(sales)` が「dplyr 操作内の式」に対応します。

まず、dbplyr は純粋なテーブルに対して次の `SELECT` 文を生成します。

```r
db_sales %>% show_query()
```

```sql
SELECT *
FROM store_sales
```

すべての dplyr 操作は、このような全ての列を選択する `SELECT` 文を元にして SQL を生成します。

以降では、下記の3点を添付して解説します。

- dplyr によるテーブル操作の R コード
- 自動生成される SQLクエリ
- テーブル操作の結果となるテーブルの内容

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
  rename(store_code = store) %>% 
  show_query()
```

```sql
SELECT store AS store_code, "month", sales, profit
FROM store_sales
```

```text
  store_code month sales profit
  <chr>      <int> <dbl>  <dbl>
1 S001           4   150     30
2 S001           5   170     34
3 S001           6   140     27
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

`filter()` は `WHERE` 句を生成します。

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

`head()` は `LIMIT` 句を生成します。

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

#### `inner_join()`、`left_join()`、`right_join()`

`inner_join()` は `INNER JOIN` 句を生成します。

```r
db_sales %>% 
  inner_join(db_master, by = "store") %>% 
  show_query()
```

```sql
SELECT store_sales.*, "name", pref
FROM store_sales
INNER JOIN store_master
  ON (store_sales.store = store_master.store)
```

```text
  store month sales profit name   pref 
  <chr> <int> <dbl>  <dbl> <chr>  <chr>
1 S001      4   150     30 storeA Tokyo
2 S001      5   170     34 storeA Tokyo
3 S001      6   140     27 storeA Tokyo
4 S001      7   160     32 storeA Tokyo
5 S002      4    NA     28 storeB Osaka
...
```

`left_join()`、`right_join()` についても同様です。



## dplyr 操作内の式の SQL変換

dplyr 操作内の個々の式がどのように SQL変換されるかについて、主な演算子・関数を例に解説します。

- dplyr が認識できる式
- dplyr が認識できない式

### dplyr が認識できる式


### dplyr が認識できない式

dbplyr が変換方法を知らない関数はそのまま残されます。
これにより、dplyr でカバーされていないデータベース関数は直接使用できます。

#### Prefix functions (接頭辞関数)

dplyr が認識しない関数はそのまま残されます。

#### Infix functions (中置関数)

dbplyr は関数名が引数の後に来る中置関数も変換します。これにより、次の `LIKE` のような式を使用できます。

#### 特殊な形式 (SQL の構文をそのまま埋め込む)

SQL の式は、R よりも構文の種類が豊富になる傾向があるため、R コードから直接変換できない式もあります。
次のように sql() によるリテラル SQL を用いると、変換を介さずに 直接 SQL の式を埋め込むことができます。

```r
db_sales %>% 
  mutate(
    f_sales = sql("CAST(sales AS FLOAT)"), 
  ) %>% 
  show_query()
```

```sql
SELECT store_sales.*, CAST(sales AS FLOAT) AS f_sales
FROM store_sales
```

これにより、必要な SQL をほぼ自由に生成できるようになります。
