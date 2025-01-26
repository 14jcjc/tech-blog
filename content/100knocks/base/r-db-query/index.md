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

データ分析をしていると、データベースとのやり取りが欠かせなくなりますね。
R でも、`dplyr` と `dbplyr` を使えば、データベースを手軽に操作できます。
今回は、これらのパッケージを活用して SQLクエリを生成し、データを取得する方法を紹介します。

## データベースバックエンドとは？

データベースバックエンドとは、データを保存・管理し、SQLクエリを通じて情報を取得・更新できる仕組みです。
例えば、PostgreSQL や MySQL などが該当します。
R では `DBI` パッケージを介してさまざまなデータベースと接続できますが、今回は手軽に扱える DuckDB を使用します。

## dplyr と dbplyr の役割

`dplyr` は R のデータフレーム操作に便利なパッケージですが、`dplyr` バックエンドである `dbplyr` を組み合わせると、データベースに対して `dplyr` の構文を使ってクエリを作成できます。
これにより、データフレーム操作と同じ感覚で SQLクエリを作成し、データベースを操作できるのが大きなメリットです。

## データベースへの接続とデータの準備

まずは DuckDB に接続し、サンプルデータを作成します。

```r
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

# store_sales テーブルとしてデータベースに登録
DBI::dbWriteTable(
  con, "store_sales", data, overwrite = TRUE
)

# データベースの store_sales テーブルを dplyr で参照
db_store_sales = tbl(con, "store_sales")
```

## 遅延評価とは？

`dplyr` を用いたデータベース操作では、すぐにクエリが実行されるわけではありません。
例えば、以下のコードを実行してもデータ操作はまだ行われません。

```r
db_result = 
  db_store_sales %>% filter(sales >= 15000)
```

この状態では `db_result` に SQLクエリの構造が保持されているだけで、データ操作は行われていません。
**遅延評価 (lazy evaluation)** の仕組みにより、`collect()` などを呼び出して、データの取得を明示的に要求したときに初めてクエリが実行されます。

## dplyr を用いたクエリ操作

次に、`dplyr` を用いてデータを操作 (フィルタリングとソート) します。

```r
# テーブル操作をSQLクエリとして保持
db_result = 
  db_store_sales %>%
  filter(sales >= 15000) %>%
  arrange(desc(profit))
```

`show_query()` を使うと、実際の SQLクエリを確認できます。

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
`tidyr` の一部の関数も対応しています。

- {{< href-target-blank url="https://dbplyr.tidyverse.org/reference/index.html#dplyr-verbs">}}

## SQLクエリの実行タイミング

遅延評価により、SQLクエリが実際に実行されるのは **データ取得を要求する処理** を行ったときです。  
例えば、`collect()` を呼び出すと、SQLクエリがデータベースで実行され、全ての結果がデータフレームとして返されます。

> [!WARNING]
> `collect()` の実行結果は R のメモリにロードされるため、大規模なデータセットを扱う場合は要注意です。

```r
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

今回は、DuckDB をバックエンドとして、`dplyr` と `dbplyr` を用いたデータベース操作について解説しました。

- `dplyr` の操作をそのままデータベースに適用できる。
- `show_query()` で SQLクエリを確認できる。
- 遅延評価により、必要なときだけ SQLクエリが実行される。

この手法を活用すれば、大規模データの処理もスムーズになるので便利ですね！

ここまでに載せたコードをまとめると、以下のようになります。

```r {linenos=false, anchorLineNos=false, lineNoStart=1, hl_lines=["31-34"]}
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

# store_sales テーブルとしてデータベースに登録
# (テーブルがある場合は上書き)
DBI::dbWriteTable(
  con, "store_sales", data, overwrite = TRUE
)

# データベースの store_sales テーブルを dplyr で参照
db_store_sales = tbl(con, "store_sales")

# フィルタリングとソート
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

ハイライトした箇所のように、データベースのテーブルをデータフレームライクに操作できます！

次回は `dplyr` の構文だけでは対応できないケースなどについても紹介したいと思います。
