---
title: "R でデータベース操作 – dplyr/dbplyr を使った SQLクエリ生成"
slug: "r-db-query"
date: 2025-01-05T00:03:13+09:00
draft: false
# draft: true
weight: 15
# description: ""
# summary: ""
categories: ["100本ノック+α (基本情報)"]
tags: ["R", "SQL"]
# disableShare: false
# ShowReadingTime: false
# ShowWordCount: false
---

データサイエンスにおいて、データベースとのやり取りは欠かせない重要な技術です。
この記事では、R におけるデータベース操作の一環として、`dplyr` と `dbplyr` を活用した方法を簡単に紹介します。

## データベースバックエンドとは？

データベースバックエンドとは、データを保存・管理し、SQLクエリを通じて情報を取得・更新できる仕組みです。
例えば、PostgreSQL や MySQL のような RDBMS もバックエンドの一種です。
R では `DBI` パッケージを介して様々なデータベースと接続できますが、この記事では軽量で扱いやすい DuckDB を使用します。

## dplyr と dbplyr の役割

`dplyr` は R のデータフレームを操作するための強力なライブラリですが、`dplyr` バックエンドである `dbplyr` を併用することでデータベースに対して `dplyr` の構文で操作を行えます。
これにより、データフレームと同様の直感的な記述で SQLクエリを生成して実行できます。

## データベースへの接続とデータの準備

まずは DuckDB に接続し、サンプルデータを作成します。

```r
# 必要なパッケージをロード
library(DBI)
library(dplyr)
library(dbplyr)
library(duckdb)

# DuckDB に接続 (一時データベース)
con = DBI::dbConnect(duckdb::duckdb())

# サンプルのデータフレームを作成
data = tribble(
  ~store_code, ~sales, ~profit,
   "S001", 15000, 3000,
   "S002", 18000, 3500,
   "S003", 12000, 2500,
   "S004", 20000, 4000,
   "S005", 16000, 3200
)

# テーブルとしてデータベースに登録
# (テーブルがある場合は上書き)
DBI::dbWriteTable(
  con, "store_sales", data, overwrite = TRUE
)
```

## 遅延評価とは？

`dplyr` を用いたデータベース操作では、通常のデータフレームのように扱えますが、実際にはすぐに SQLクエリが実行されるわけではありません。
例えば、`filter(sales >= 15000)` を実行しても、SQL の実行はまだ行われていません。この状態では、データを取得せずにクエリの構造を保持しているのみで、データを取得するのは明示的に要求した場合のみです。
これを **遅延評価 (lazy evaluation)** と呼びます。

## dplyr を用いたクエリ操作

次に、`dplyr` を用いてデータを操作します。

```r
# データベースの store_sales テーブルを dplyr で参照
db_store_sales = tbl(con, "store_sales")

# フィルタリングと並び替え
# (テーブル操作をSQLクエリとして保持)
db_result = 
  db_store_sales %>%
  filter(sales >= 15000) %>%
  arrange(desc(profit))
```

この段階では SQLクエリは実行されておらず、`db_result` は SQLクエリを保持したオブジェクトとなります。
`show_query()` を使うと、生成された SQLクエリを確認できます。

```r
# SQLクエリの生成・確認
show_query(db_result)
```

出力:
```sql
SELECT store_sales.*
FROM store_sales
WHERE (sales >= 15000.0)
ORDER BY profit DESC
```

データベース操作に対応している `dplyr` の関数については、以下の公式ドキュメントを参照してください。  
`tidyr` の一部の関数にも対応しています。

- {{< href-target-blank url="https://dbplyr.tidyverse.org/reference/index.html#dplyr-verbs">}}

## SQLクエリの実行タイミング

SQLクエリが実際に実行されるのは **データ取得を要求する処理** を行ったときです。
例えば、`collect()` を呼び出すと、SQLクエリがデータベースで実行され、全ての結果がデータフレームとして返されます。

> [!WARNING]
> `collect()` の実行結果は R のメモリにロードされるため、大規模なデータセットを扱う場合はデータサイズに注意しましょう。

```r
# SQLクエリの結果を R 側に取り込む
df_result = collect(db_result)
df_result %>% head(3) # 出力
```

出力:
```
# A tibble: 3 × 3
  store_code sales profit
  <chr>      <dbl>  <dbl>
1 S004       20000   4000
2 S002       18000   3500
3 S005       16000   3200
```

この後、`df_result` を用いて純粋な R コードで作業を継続できます。

## まとめ

この記事では、DuckDB をバックエンドとして、`dplyr` と `dbplyr` を用いたデータベース操作について解説しました。

- `dplyr` の操作をそのままデータベースに適用できる。
- `show_query()` で SQLクエリを確認できる。
- 遅延評価により、データ取得を要求するまで SQLクエリは実行されない。

この手法を活用すれば、大規模データの処理もシンプルに記述できるので便利ですね！

ここまでに載せた処理をまとめると、以下のようなコードになります。

```r {linenos=false, anchorLineNos=false, lineNoStart=1, hl_lines=["30-33"]}
# 必要なパッケージをロード
library(DBI)
library(dplyr)
library(dbplyr)
library(duckdb)

# DuckDB に接続 (一時データベース)
con = DBI::dbConnect(duckdb::duckdb())

# サンプルのデータフレームを作成
data = tribble(
  ~store_code, ~sales, ~profit,
   "S001", 15000, 3000,
   "S002", 18000, 3500,
   "S003", 12000, 2500,
   "S004", 20000, 4000,
   "S005", 16000, 3200
)

# テーブルとしてデータベースに登録
DBI::dbWriteTable(
  con, "store_sales", data, overwrite = TRUE
)

# データベースの store_sales テーブルを dplyr で参照
db_store_sales = tbl(con, "store_sales")

# フィルタリングと並び替え
# (テーブル操作をSQLクエリとして保持)
db_result = 
  db_store_sales %>%
  filter(sales >= 15000) %>%
  arrange(desc(profit))

# SQLクエリの生成・確認
show_query(db_result)
# => 
# <SQL>
# SELECT store_sales.*
# FROM store_sales
# WHERE (sales >= 15000.0)
# ORDER BY profit DESC

# SQLクエリの結果を R 側に取り込む
df_result = collect(db_result)

# 以下、データフレームでの処理
df_result %>% head(3)
# => 
# A tibble: 3 × 3
#   store_code sales profit
#   <chr>      <dbl>  <dbl>
# 1 S004       20000   4000
# 2 S002       18000   3500
# 3 S005       16000   3200
```

ハイライトした箇所のように、データベースのテーブルをデータフレームライクに操作できます。

次の記事では、`dplyr` の構文では書けない場合の対処法など、データベース操作で役立つテクニックや補足事項を掲載します。
