---
title: "[R+SQL] データサイエンス100本ノック＋α - 概要・導入"
slug: "start"
date: 2025-01-07T22:33:14+09:00
draft: false
weight: 15
description: "データサイエンス100本ノック＋α の概要とコード実行環境の構築について"
# summary: ""
categories: ["100本ノック+α (基本情報)"]
tags: ["R", "SQL"]
# disableShare: false
# UseHugoToc: true
# ShowToc: true
# ShowToc: false
# TocOpen: true
# TocOpen: false
---

**参考記事:**

- {{% ref2 path="book-review" %}}
- {{% ref2 path="r-sql-auto-query" %}}

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
  - **SQLクエリ**

サンプルコードは可能な限りエレガントで効率的な記述を心がけたいと思います。

## 環境構築

このシリーズでは、Docker や Jupyter Notebook などの環境を必要とせず、**RStudio などの R 実行環境** があれば十分です。
私は VSCode を愛用していますが、RStudio でも問題なく動作します。

### 手順

#### 1. GitHub リポジトリをクローンする

以下のコマンドでリポジトリをクローンします。

Bash
bash, sh, ksh, zsh, shell
Bash Session
bash-session, console, shell-session

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

#### 2. init.R を実行する

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

### 利用可能なリソース

環境構築後、以下のリソースを利用できます。

#### 1. データベースファイル

`work/DB/100knocks.duckdb`

#### 2. 主な R パッケージ

- `dplyr`
- `tidyr`
- `magrittr`
- `tibble`
- `stringr`
- `lubridate`
- `DBI`
- `dbplyr`
- `duckdb`

#### 3. R オブジェクト

##### データベースの接続

- `con`

##### データフレーム

- `df_customer`
- `df_receipt`
- `df_product`
- `df_store`
- `df_category`
- `df_geocode`

##### データベースのテーブル参照

- `db_customer`
- `db_receipt`
- `db_product`
- `db_store`
- `db_category`
- `db_geocode`

##### 便利な関数

- `my_select()`
- `my_sql_render()`

#### ER図 (データの構造)

本シリーズで扱う 6 個のテーブルの関係を示す ER 図です。  
場所 : `work/data/100knocks_ER.png`

<div class="gallery-image gallery-base">
  <a href="ER.png" data-width="1692" data-height="928">
    <img src="ER.png" alt="ER図" style="display: block; margin: auto;">
  </a>
</div>
<span style="font-size: 0.9em;">
−{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/blob/master/docker/doc/100knocks_ER.pdf" text="データサイエンス100本ノック（構造化データ加工編）" >}}より引用
</span>

{{% comment %}}
{{< figure src="ER.png" alt="ER図" title="" caption="" width="100%" link="" 
  rel="noopener" target="_blank" >}}
{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/blob/master/docker/doc/100knocks_ER.pdf" text="データサイエンス100本ノック（構造化データ加工編）" >}}より引用
{{% /comment %}}

## 補足

R によるデータベース操作と SQL クエリの自動生成について、以下の記事で紹介しています。

- {{% ref2 path="r-sql-auto-query" %}}
- {{% ref2 path="r-sql-translation" %}}

データベース操作に関連するその他の補足事項を `my_select()`、`my_sql_render()` の使い方と共に以下にまとめました。

### DuckDB を使用するメリット{#duckdb}

本シリーズでは、軽量かつ高速なデータベースエンジン **DuckDB** を使用します。
DuckDB は、データサイエンスのニーズに合わせて設計された高性能データベースで、分析向けの機能が充実しています。
特に、ローカル環境でのデータ分析や R との統合に適しています。

本シリーズで DuckDB を使用するのは、ファイルベースで手軽に扱える上、
PostgreSQL との互換性が高く、学習した内容を他のデータベースに簡単に適用でき、教育に最適だからです。

今回のような小規模なデータセットでしたら、インメモリモード (完全に RAM 上で動作) で使い、クエリ処理をさらに高速化することもできます。

### SQL クエリを直接実行する

#### `dbGetQuery()`


`DBI::dbGetQuery()`

次のように、sql() と組み合わせて使うと便利です。


結果は、以下のようにデータフレーム (デフォルトで tibble) となります。

```text

```

#### `my_select()`

DBI::dbGetQuery() のラッパー

##### convert_tibble 引数

convert_tibble = F で data.frame クラスのデータフレームを返すこともできます。
(あまり使わないとは思いますが。)

##### バインドパラメータを使用したクエリ

次のように、バインドパラメータを使用したクエリ
 (params 引数)

### 他の DB での SQL クエリを生成する

#### `sql_render()`

対応しているデータベース一覧は以下の公式ページで確認できます。

{{< href-target-blank url="https://dbplyr.tidyverse.org/reference/index.html#built-in-database-backends" >}}

#### `my_sql_render()`

`sql_render()` のラッパーです。
`sql_render()` が出力するSQLクエリは、前述のようにテーブル名やカラム名の識別子がバッククォート (`) で囲まれます。

これはこれで推奨された安全な記法なのでよいのですが、通常は囲まないし読みずらいと思われるため、`my_sql_render()` はデフォルトでバッククォート (`) を消去します。

識別子をダブルクォートで囲む場合は次のようにします。

また、`cte` などの引数を指定しやすくしてます。例えば、以下の2つのコードは等価です。

```r
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

## 謝辞

当ブログは、{{< param k100.dss.name >}}様が作成された素晴らしい教育コンテンツを、さらに発展させる目的で作成しました。

**データおよび ER図の権利は{{< param k100.dss.name >}}様に帰属します。**

より多くの方がデータサイエンスのスキルを高める一助となれば幸いです。
