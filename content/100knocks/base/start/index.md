---
title: "[R+SQL] データサイエンス100本ノック＋α - 概要・導入"
slug: "start"
date: 2025-01-06T00:03:13+09:00
draft: false
# draft: true
weight: 15
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

前回の記事: 
データサイエンス100本ノック～構造化データ加工編ガイドブック レビュー

## 概要

当ブログでは「データサイエンス100本ノック＋α」と題し、書籍の演習問題を解説し、R と SQL のサンプルコードを紹介していきます。
「標準編」では書籍の30題ほどの演習問題をピックアップし、「発展編」ではオリジナル問題を紹介していく予定です。
基本的に、各演習問題では以下のサンプルコードを解説付きで紹介します。

- Rコード: データフレームでの処理
- Rコード: データベース・バックエンドでの処理 << --> データベース・バックエンドの章にリンクを貼る >>
- SQLクエリ: 上記処理と等価のもの

サンプルコードはなるべくエレガントな記述を心がけたいと思います。

## 環境構築

データサイエンス100本ノック＋α では、Docker や jupyter notebook などの環境を必要とせず、RStudio など R の実行環境さえあれば OK です。
なお、私は VSCode を愛用しています。

環境構築の手順は以下の通りです。

1. ...
2. ...
3. ...
4. ディレクトリ構成
5. 作業ディレクトリについて

## 利用できる項目

環境構築後、以下の項目を利用できるようになります。

### パッケージ
<< リスト or 表 >>

### 変数
<< リスト or 表 >>
con, df_receipt, db_receipt, ...

### 関数
<< リスト or 表 >>
my_show_query, my_sql_render, my_select

使い方については後述します。

### ER図 (データの構造・関係性)

work/data/100knocks_ER.png

これら6個のテーブルのER図: 

<< ここに画像を貼る >>
<< 出典を記載 >>

## DuckDB について


## 謝辞

データサイエンティスト協会様が作成された素晴らしい教育コンテンツを、より豊かにできればという思いで当ブログを作成しました。データサイエンティスト協会様に感謝申し上げます。
当ブログで使用するデータおよびER図の権利はデータサイエンティスト協会様にあります。
より多くの方のスキルアップのために活用いただければ幸いです。
