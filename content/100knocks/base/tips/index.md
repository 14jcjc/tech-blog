---
title: "[R+SQL] データサイエンス100本ノック＋α - Tips"
slug: "tips"
date: 2025-01-07T00:04:13+09:00
draft: false
# draft: true
weight: 20
description: "データサイエンス100本ノック＋α の概要とコード実行環境の構築について。"
# summary: ""
categories: ["DS-100本ノック+α"]
tags: ["R", "SQL"]
cover:
  # image: "images/papermod-cover.png" #< /static
  # image: "images/100knocks/cover-100k-standard.png" #< /static
  relative: false
  hiddenInList: false
  hiddenInSingle: false # hide on single page
  # hidden: true
# ShowToc: false
# TocOpen: false
# disableHLJS: false
# disableShare: false
# hideSummary: false
# searchHidden: false
# ShowReadingTime: false
# ShowWordCount: false
---

参考記事: 
- データサイエンス100本ノック～構造化データ加工編ガイドブック レビュー
- データサイエンス100本ノック＋α - 概要・導入

演習問題に入る前に予備知識として、データベース・バックエンド処理に関する便利なノウハウについて紹介します。
演習問題で活用できる必要最小限のものに限定してますが、実務でも十分活用できる内容です。

ここで紹介するサンプルコードは、<< 環境構築後 >> でしたら全て実行することができます。

## R によるデータベース・バックエンド処理

詳しくは << R によるデータベース・バックエンド処理と遅延評価の仕組み>> で述べましたが、
データベース・バックエンドによる処理は、R から SQLデータベースに接続してデータを操作する方法です。
R で記述した処理がデータベース上で操作されるため、R で処理できるメモリサイズを超える大規模なデータセットでも効率よく扱うことができます。

今回は、データベース (DuckDB) をローカルファイルとして作成しているため、バックエンドによる処理の恩恵にはあまり授かれないかもしれませんが、R からデータベースに接続してデータ操作をするエクササイズにはなります。

以下は、`db_receipt` (receiptテーブルの参照オブジェクト) を用いたサンプルですが、このようにデータベースのテーブルを `dplyr` の構文を用いてデータフレームライクで操作できます。

```
db_receipt %>% 
  filter(sales_ymd >= 20180101L ) %>%  
  group_by(product_cd) %>% 
  summarise(total_sales = sum(amount)) %>% 
  arrange(desc(total_sales))
```

出力は以下のようになります。

```
# Source:     SQL [?? x 2]
# Database:   DuckDB v1.1.3-dev165 [root@Darwin 24.1.0:R 4.4.2/.../DB/100knocks.duckdb]
# Ordered by: desc(total_sales)
   product_cd total_sales
   <chr>            <dbl>
 1 P071401001     1233100
 2 P071401002      429000
 3 P071401003      371800
 4 P060303001      346320
 5 P071401012      305800
 6 P071401014      277200
 7 P071401024      271200
 8 P071401022      268800
 9 P071401013      264000
10 P071401004      256300
11 P071401025      247200
12 P071401007      241200
13 P071401017      239800
14 P071401019      237600
15 P071401020      237600
# ℹ more rows
# ℹ Use `print(n = ...)` to see more rows
```

## Tips

データベースクエリ操作に関するTipsを紹介します。

### Myメソッド

以下は、便宜上、自作した関数です。

#### my_show_query()

SQLクエリを生成する show_query() のラッパー。

```
db_receipt %>% 
  filter(sales_ymd >= 20180101L ) %>%  
  group_by(product_cd) %>% 
  summarise(total_sales = sum(amount)) %>% 
  arrange(desc(total_sales)) -> 
  db_result

db_result %>% my_show_query()
```

出力: 
```
<SQL>
WITH q01 AS (
  SELECT receipt.*
  FROM receipt
  WHERE (sales_ymd >= 20180101)
)
SELECT product_cd, SUM(amount) AS total_sales
FROM q01
GROUP BY product_cd
ORDER BY total_sales DESC
```

引数でSQLクエリの形式を変えることができる。

```
db_result %>% my_show_query(cte = F)
```

出力: 
```
<SQL>
SELECT product_cd, SUM(amount) AS total_sales
FROM (
  SELECT receipt.*
  FROM receipt
  WHERE (sales_ymd >= 20180101)
) q01
GROUP BY product_cd
ORDER BY total_sales DESC
```

なお、基の show_query() でも基本的な使い方は同じです。

```
db_result %>% show_query(cte = F)
```

#### my_select()

dbx::dbxSelect() のラッパー。
SQLクエリを実行する。

次のように、sql() と組み合わせて使うと便利です。

```r
q = sql("
WITH q01 AS (
  SELECT receipt.*
  FROM receipt
  WHERE (sales_ymd >= 20180101)
)
SELECT product_cd, SUM(amount) AS total_sales
FROM q01
GROUP BY product_cd
ORDER BY total_sales DESC
"
)
d = q %>% my_select(con) # con はデータベース接続オブジェクト
d
```

結果は、以下のようにデータフレーム (デフォルトで tibble) となります。

```
# A tibble: 7,061 × 2
  product_cd total_sales
  <chr>            <dbl>
1 P071401001     1233100
2 P071401002      429000
3 P071401003      371800
4 P060303001      346320
5 P071401012      305800
6 P071401014      277200
7 P071401024      271200
...
```

##### convert_tibble 引数

convert_tibble = F で data.frame クラスのデータフレームを返すこともできます。
(あまり使わないとは思いますが。)

```
q %>% 
  my_select(con, convert_tibble = F) %>% class()
#> [1] "data.frame"
```

##### プレースホルダー (params 引数)

次のように、プレースホルダー (?) を用いてのクエリも実行できます。

q = sql("
SELECT sales_ymd, store_cd, product_cd, amount
FROM receipt
WHERE (sales_ymd >= ?)
ORDER BY sales_ymd
"
)
q %>% my_select(con, params = list(20190123))

```
# A tibble: 31,390 × 4
  sales_ymd store_cd product_cd amount
      <int> <chr>    <chr>       <dbl>
1  20190123 S14028   P050302006    298
2  20190123 S13017   P040802001     80
3  20190123 S14049   P091501043    800
4  20190123 S14046   P050303016    228
5  20190123 S13018   P050101001     40
6  20190123 S14026   P050101003    138
...
```

このように、SQLクエリに値を後からバインドする方法は「バインドパラメータ (Bind Parameter)」または「プレースホルダー (Placeholder)」と呼ばれ、以下のようなメリットがあります。

- SQLインジェクション対策 (ユーザー入力を直接埋め込まず、安全に処理できる)
- パフォーマンス向上 (クエリの再利用による最適化)
- コードの可読性向上 (値を直接クエリ内に埋め込まず、整理されたコードになる)

#### my_sql_render()

sql_render() のラッパーです。
用途については後述<<リンク>>しますが、sql_render() が出力するSQLクエリは、次のようにテーブル名やカラム名の識別子が
バッククォート (`) で囲まれます。

```
db_result %>% sql_render(con = simulate_mysql())
```

出力: 
```
<SQL> SELECT `product_cd`, SUM(`amount`) AS `total_sales`
FROM (
  SELECT `receipt`.*
  FROM receipt
  WHERE (`sales_ymd` >= 20180101)
) AS `q01`
GROUP BY `product_cd`
ORDER BY `total_sales` DESC
```

これはこれで推奨された安全な記法なのでよいのですが、通常は囲まないし読みずらいと思われるため、my_sql_render() はデフォルトでバッククォート (`) を消去します。

```
db_result %>% my_sql_render(con = simulate_mysql())
```

出力: 
```
<SQL> WITH q01 AS (
  SELECT receipt.*
  FROM receipt
  WHERE (sales_ymd >= 20180101)
)
SELECT product_cd, SUM(amount) AS total_sales
FROM q01
GROUP BY product_cd
ORDER BY total_sales DESC
```

識別子をダブルクォートで囲む場合は次のようにします。

```
db_result %>% 
  my_sql_render(
    con = simulate_mysql(), pattern = "`", replacement = "\""
  )
```

```
<SQL> WITH "q01" AS (
  SELECT "receipt".*
  FROM receipt
  WHERE ("sales_ymd" >= 20180101)
)
SELECT "product_cd", SUM("amount") AS "total_sales"
FROM "q01"
GROUP BY "product_cd"
ORDER BY "total_sales" DESC
```

また、cte などの引数を指定しやすくしてます。例えば、以下の2つは等価です。

```
# sql_render
db_result %>% 
  sql_render(
    sql_options = 
      sql_options(cte = T, use_star = F, qualify_all_columns = F)
  )
# my_sql_render
db_result %>% 
  my_sql_render(cte = T, use_star = F, qualify_all_columns = F)
```

### sql()

sql() は他の項目でも登場してますが、ここでは、DBクエリ操作を dplyr の構文では書けない場合の回避策を紹介します。



tbl() を使うと、前半でSQLクエリをの結果をテーブル参照として取得し、それを用いてデータ操作を続けることができます。
これを説明するブログ記事を書いて。

### tbl()

tbl() を使うことで、SQLクエリの結果をテーブルとして参照し、R の dplyr で操作を継続できる。

```
q = sql("
SELECT sales_ymd, product_cd, amount
FROM receipt
WHERE (sales_ymd >= 20180101)
"
)
query = tbl(con, q)
query
```

```
# Source:   SQL [?? x 3]
# Database: DuckDB v1.1.3-dev165 [root@Darwin 24.1.0:R 4.4.2/.../DB/100knocks.duckdb]
  sales_ymd product_cd amount
      <int> <chr>       <dbl>
1  20181103 P070305012    158
2  20181118 P070701017     81
3  20190205 P050301001     25
4  20180821 P060102007     90
5  20190605 P050102002    138
6  20181205 P080101005     30
7  20190922 P070501004    128
...
```

```
query %>% 
  group_by(product_cd) %>% 
  summarise(total_sales = sum(amount)) %>% 
  arrange(desc(total_sales)) -> 
  db_result
db_result
```

```
# Source:     SQL [?? x 2]
# Database:   DuckDB v1.1.3-dev165 [root@Darwin 24.1.0:R 4.4.2/.../DB/100knocks.duckdb]
# Ordered by: desc(total_sales)
  product_cd total_sales
  <chr>            <dbl>
1 P071401001     1233100
2 P071401002      429000
3 P071401003      371800
4 P060303001      346320
5 P071401012      305800
6 P071401014      277200
...
```




### 他のDBでのSQLクエリを確認する方法

my_sql_render() または sql_render() を使用します。

MySQLでシミュレーション: 

```
db_result %>% my_sql_render(con = simulate_mysql())
```

出力: 
```
<SQL> WITH q01 AS (
  SELECT receipt.*
  FROM receipt
  WHERE (sales_ymd >= 20180101)
)
SELECT product_cd, SUM(amount) AS total_sales
FROM q01
GROUP BY product_cd
ORDER BY total_sales DESC
```

PostgreSQL、Snowflake などでは次のように記述します。

```
db_result %>% my_sql_render(con = simulate_postgres())
db_result %>% my_sql_render(con = simulate_snowflake())
db_result %>% my_sql_render(con = simulate_redshift())
db_result %>% my_sql_render(con = simulate_oracle())
db_result %>% my_sql_render(con = simulate_mssql())
```

対応しているデータベース一覧は以下のページで確認できます。
https://dbplyr.tidyverse.org/reference/index.html#built-in-database-backends
