---
title: "R によるデータベースクエリ操作について"
slug: "r-db-backend"
date: 2025-01-05T00:03:13+09:00
draft: false
# draft: true
weight: 15
# description: ""
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
TocOpen: true
# disableHLJS: false
# disableShare: false
# hideSummary: false
# searchHidden: false
# ShowReadingTime: false
# ShowWordCount: false
---

データサイエンスにおいて、データベースとのやり取りは欠かせない重要な技術です。本記事では、R におけるデータベース操作の一環として、`DuckDB` をバックエンドとし、`dplyr` と `dbplyr` を活用した方法を紹介します。

## データベースバックエンドとは？

データベースバックエンドとは、SQL データベースの処理を担うエンジンのことを指します。R では `DBI` パッケージを介して様々なデータベースと接続できますが、本記事では組み込みで高速な処理が可能な `DuckDB` を使用します。

## dplyr と dbplyr の役割

`dplyr` は R のデータフレームを操作するための強力なライブラリですが、`dbplyr` を併用することでデータベースに対して `dplyr` の文法で操作を行えます。これにより、データフレームと同様の直感的な記述で SQL クエリを生成・実行できます。

## DuckDB への接続とデータの準備

まずは `DuckDB` に接続し、サンプルデータを作成してみましょう。

```r
library(DBI)
library(dplyr)
library(dbplyr)
library(duckdb)

# DuckDB に接続
con <- dbConnect(duckdb::duckdb(), dbdir = "my_database.duckdb")

# データフレームを作成
data <- tibble(
  id = 1:5,
  name = c("Alice", "Bob", "Charlie", "David", "Eve"),
  score = c(80, 90, 85, 70, 95)
)

# テーブルとして登録
dbWriteTable(con, "students", data, overwrite = TRUE)
```

## 遅延評価とは？

`dplyr` を用いたデータベース操作では、通常のデータフレームのように扱えますが、実際にはすぐに SQL クエリが実行されるわけではありません。`dplyr` の関数は SQL クエリを構築するのみであり、データを取得するのは明示的に要求した場合のみです。これを **遅延評価 (lazy evaluation)** と呼びます。

## dplyr を用いたクエリ操作

次に、`dplyr` を使ってデータを操作してみましょう。

```r
# データベースの students テーブルを dplyr で参照
db_students <- tbl(con, "students")

# フィルタリングと並び替え
result <- db_students %>%
  filter(score >= 85) %>%
  arrange(desc(score))
```

この段階では SQL クエリは実行されておらず、`result` は SQL クエリを保持したオブジェクトです。`show_query()` を使うと、生成された SQL クエリを確認できます。

```r
show_query(result)
```

出力:
```sql
SELECT *
FROM "students"
WHERE "score" >= 85
ORDER BY "score" DESC
```

対応している `dplyr` の関数については、以下の公式ドキュメントを参照してください。  
tidyr の一部の関数にも対応しています。

{{% comment %}}
- {{< href-target-blank url="https://dbplyr.tidyverse.org/reference/index.html#dplyr-verbs" text="dbplyr の dplyr 対応関数一覧" >}}
{{% /comment %}}

- {{< href-target-blank url="https://dbplyr.tidyverse.org/reference/index.html#dplyr-verbs">}}

## SQL クエリの実行タイミング

SQL クエリが実際に実行されるのは、以下のような **データ取得を要求する処理** を行ったときです。

```r
# データの取得
collected_data <- collect(result)
print(collected_data)
```

`collect()` を呼び出すことで、SQL クエリがデータベースで実行され、結果が R のデータフレームとして取得されます。

## まとめ

本記事では、`DuckDB` をバックエンドとして、`dplyr` と `dbplyr` を用いたデータベース操作について説明しました。

- `dplyr` の操作をそのままデータベースに適用できる。
- `show_query()` で SQL クエリを確認可能。
- 遅延評価により、`collect()` するまで SQL は実行されない。

この手法を活用すれば、大規模データの処理もシンプルに記述できるので、ぜひ試してみてください！


## 基本的な使い方は以下のような流れになります

```r
# 必要なパッケージをロード
pacman::p_load(
  DBI, dplyr, dbplyr, 
  RPostgres, # PostgreSQL の場合
  install = T # 存在しないパッケージをインストールする
)

# データベースへの接続 (PostgreSQL の場合)
dbConnect(
  RPostgres::Postgres(), 
  host = "your_host", 
  port = 5432, 
  dbname = "your_database_name", 
  user = "your_username", 
  password = "your_password"
) -> 
con

# データベースのテーブル参照を取得
db_table = tbl(con, "your_table_name")

# テーブル操作をSQLクエリとして保持
db_table %>% 
  filter(sales_ymd >= 20180101L ) %>%  
  group_by(product_cd) %>% 
  summarise(total_sales = sum(amount)) %>% 
  arrange(desc(total_sales)) -> 
  db_result

# SQLクエリの自動生成・確認
db_result %>% show_query(cte = T)

# SQLクエリの結果をR側に取り込む
df_result = db_result %>% collect()  

# データベース接続を解除
dbDisconnect(con)

# 以下、データフレームでの処理
df_result %>% head(10)
```

ハイライトした箇所のように、データベースのテーブルを dplyr の構文を用いてデータフレームライクで操作できます。
