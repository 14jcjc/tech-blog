---
title: "[R+SQL] データサイエンス100本ノック＋α - 概要・導入"
slug: "start"
date: 2025-01-07T22:34:13+09:00
draft: false
weight: 15
description: "データサイエンス100本ノック＋α の概要とコード実行環境の構築について"
# summary: ""
categories: ["100本ノック+α (基本情報)"]
tags: ["R", "SQL"]
# disableShare: false
---

**参考記事:**

- [【レビュー】『データサイエンス100本ノック 構造化データ加工編ガイドブック』]({{< ref "book-review" >}})
- [R でデータベース操作 – dplyr/dbplyr を使った SQLクエリ生成]({{< ref "r-sql-auto-query" >}})

## はじめに

当ブログでは、「データサイエンス100本ノック＋α」と題し、100本ノックの演習問題をベースに、R によるデータベース操作を加えた解説を行います。

- **シリーズ構成**
  - **標準編**: 100本ノックの中から約30本をピックアップし、R と SQL の両方で解説
  - **発展編**: オリジナル問題を作成し、より実践的なデータ処理を紹介 (予定)
<!-- <p> -->

- **解説方針**  
  各問題について、以下のコードを掲載します。
  - **Rコード** : データフレーム操作
  - **Rコード** : データベース操作
  - **SQLクエリ** : 上記の操作と等価なコード

サンプルコードは可能な限りエレガントで効率的な記述を心がけたいと思います。

## 環境構築

このシリーズでは、Docker や Jupyter Notebook などの環境を必要とせず、**RStudio などの R 実行環境** があれば十分です。
私は VSCode を愛用していますが、RStudio でも問題なく動作します。

### 1. GitHub リポジトリをクローン

以下のコマンドでリポジトリをクローンします。

```sh
cd /your_directory_path
git clone https://github.com/xxx/100knocks-dp.git
```

`100knocks-dp` が作成され、ディレクトリ構成は以下のようになります。

```text {name="100knocks-dp"}
work
  ├── DB
  │   └── _ReadMe.txt
  ├── data
  │   └── _ReadMe.txt
  ├── data_setup.R
  ├── env_setup.R
  ├── functions.R
  └── init.R
```

### 2. init.R を実行する

RStudio などで `init.R` を開いて実行します。  
実行後、以下のようなディレクトリ構成になります。

```text {name="100knocks-dp"}
work
  ├── DB
  │   ├── 100knocks.duckdb
  │   └── _ReadMe.txt
  ├── data
  │   ├── 100knocks_ER.png
  │   ├── _ReadMe.txt
  │   ├── category.csv
  │   ├── customer.csv
  │   ├── geocode.csv
  │   ├── product.csv
  │   ├── receipt.csv
  │   └── store.csv
  ├── data_setup.R
  ├── env_setup.R
  ├── functions.R
  └── init.R
```

ダウンロードした 6個の CSVファイル (`data/*.csv`)[^1] を読み込み、テーブルとしてデータベースファイル (`DB/100knocks.duckdb`) に保存しています。

[^1]: データは「{{< param k100.dss.title >}}」のリポジトリより、以下のディレクトリからダウンロードしています。  
{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/tree/master/docker/work/data" >}}

もしエラーが発生した場合は、作業ディレクトリの設定が原因となっている可能性が高いです。

```r {name="init.R"}
work_dir_path = init_path |> dirname()
```

`init.R` の上記の箇所を、例えば以下のように変更して再実行してみてください。

```r
work_dir_path = "."
```

## 利用可能なリソース

環境構築後、以下のリソースを利用できます。

### 1. データベースファイル

`work/DB/100knocks.duckdb`

### 2. 主な R パッケージ

- `dplyr`
- `tidyr`
- `magrittr`
- `tibble`
- `stringr`
- `lubridate`
- `DBI`
- `dbplyr`
- `dbx`
- `duckdb`

### 3. R オブジェクト

#### データベースの接続

- `con`

#### データフレーム

- `df_customer`
- `df_receipt`
- `df_product`
- `df_store`
- `df_category`
- `df_geocode`

#### データベースのテーブル参照

- `db_customer`
- `db_receipt`
- `db_product`
- `db_store`
- `db_category`
- `db_geocode`

#### 便利な関数

- `my_show_query()`
- `my_select()`
- `my_sql_render()`

## ER図 (データの構造・関係性)

本シリーズで扱う6つのテーブルの関係を示すER図は、`work/data/100knocks_ER.png` にあります。

<div class="gallery-image gallery-base">
  <a href="ER.png" data-width="1692" data-height="928">
    <img src="ER.png" alt="ER図" style="display: block; margin: auto;">
  </a>
</div>
{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/blob/master/docker/doc/100knocks_ER.pdf" text="データサイエンス100本ノック（構造化データ加工編）" >}}より引用

{{% comment %}}
{{< figure src="ER.png" alt="ER図" title="" caption="" width="100%" link="" 
  rel="noopener" target="_blank" >}}
{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/blob/master/docker/doc/100knocks_ER.pdf" text="データサイエンス100本ノック（構造化データ加工編）" >}}より引用
{{% /comment %}}

## DuckDB について

本シリーズでは、軽量かつ高速なデータベースエンジン **DuckDB** を使用します。
DuckDB は、データサイエンスのニーズに合わせて設計された高性能データベースで、分析向けの機能が充実しています。
特に、ローカル環境でのデータ分析や R との統合に適しています。

本シリーズで DuckDB を使用するのは、ファイルベースで手軽に扱える上、
PostgreSQL との互換性が高く、学習した内容を他のデータベースに簡単に適用でき、教育に最適だからです。

今回のような小規模なデータセットでしたら、インメモリモード (完全に RAM 上で動作) で使い、クエリ処理をさらに高速化することもできます。

## 謝辞

当ブログは、{{< param k100.dss.name >}}様が作成された素晴らしい教育コンテンツを、さらに発展させる目的で作成しました。

**データおよび ER図の権利は{{< param k100.dss.name >}}様に帰属します。**

より多くの方がデータサイエンスのスキルを高める一助となれば幸いです。
