---
title: "【レビュー】『データサイエンス100本ノック 構造化データ加工編ガイドブック』"
slug: "book-review"
date: 2025-01-04T21:01:10+09:00
draft: false
weight: 10
# description: ""
# summary: ""
categories: ["レビュー", "100本ノック+α (基本情報)"]
tags: ["R", "SQL"]
# tags_weight: 1

# toc: true # Show / hide table of contents of the page.
# disableShare: false

# ShowToc: true
# ShowToc: false
# TocOpen: true
# TocOpen: false

# style: 
#   background: #ffff00
#   color: #0000ff

# background: #ffff00
# color: #0000ff
---

## はじめに

{{< param k100.dss.name >}}が公開している実践的な学習教材として定評のある「{{< k100/ds100kdp-link >}}」。
その解説本として出版されたのが『{{< product-name "ds100kdp" >}}』です。  
本書は、実際のデータ加工を手を動かしながら学べる構成となっており、データ処理の基礎から実務に役立つスキルまでを体系的に習得できます。  

当ブログでは、この本を基に記事を執筆する予定です。
その前に、本書のレビューをまとめましたので、購入を検討している方の参考になれば幸いです。

## 本の内容

本書は、100問のノック形式の問題を通じて、データの結合、集計、フィルタリングなど、データ加工に必要なスキルを学べる構成になっています。  
演習用のデータセットや Docker を用いた演習環境が GitHubリポジトリで公開されていて、実際のデータ分析環境で手を動かしながら学習できます。
SQL、Python、R の3言語に対応しており、それぞれの解法を比較しながら学べる点も特徴的です。

100問の演習問題は以下の22カテゴリに分類されていて、基本的なデータ操作から、より実務に直結する処理まで幅広く網羅されています。

| No. | 大区分              | 設問数 |
|----:|-----------------|------:|
|  1  | 列に対する操作      |   3  |
|  2  | 行に対する操作      |   6  |
|  3  | あいまい検索        |   7  |
|  4  | ソート            |   4  |
|  5  | 集計            |  13  |
|  6  | 副問合せ          |   2  |
|  7  | 結合            |   7  |
|  8  | 縦横変換          |   2  |
|  9  | データ変換        |  14  |
| 10  | 数値変換         |   4  |
| 11  | 四則演算         |   7  |
| 12  | 日付型の計算      |   5  |
| 13  | サンプリング      |   2  |
| 14  | 外れ値・異常値    |   2  |
| 15  | 欠損値          |   5  |
| 16  | 除算エラー対応    |   1  |
| 17  | 座標データ       |   2  |
| 18  | 名寄せ          |   2  |
| 19  | データ分割       |   2  |
| 20  | 不均衡データ      |   1  |
| 21  | 正規化・非正規化  |   2  |
| 22  | ファイル入出力    |   7  |

取り扱うデータはスーパーの架空の購買データや顧客データで、次の ER 図が示すように 6個のテーブルが用意されています。

{{% comment %}}
PhotoSwipe v5 場合
<div class="pswp-gallery" id="gallery-base">
  <a href="ER.png" 
    data-pswp-width="1692" 
    data-pswp-height="928" 
    target="_blank">
    <img src="ER.png" alt="ER図" />
  </a>
</div>
{{% /comment %}}

{{% comment %}}
{{< figure src="ER.png" alt="ER図" title="" caption="" width="100%" link="" 
  rel="noopener" target="_blank" >}}
{{< figure 
   src="ER.png" alt="ER図" align="center" width="93%" link="ER.png"
>}}
{{% /comment %}}

<div class="gallery-image gallery-base">
  <a href="ER.png" data-width="1692" data-height="928">
    <img src="ER.png" alt="ER図" style="display: block; margin: auto;">
  </a>
</div>

<span style="font-size: 0.9em;">
−{{< href-target-blank url="https://github.com/The-Japan-DataScientist-Society/100knocks-preprocess/blob/master/docker/doc/100knocks_ER.pdf" text="データサイエンス100本ノック（構造化データ加工編）" >}}より引用
</span>

このデータセットを題材とした演習問題を解くことで、実際のビジネスデータを想定したデータ加工スキルを身につけられます。

## 実際に取り組んでみた感想

本書の魅力は、単なる知識の習得ではなく、実際にコードを書きながら学べる点にあります。
SQL、Python、R の解法を比較できるため、異なる言語での実装方法を学ぶのにも役立ちました。

私の場合、R を使う機会は多いですが、SQL はそれほどではないです。そのため、R で書いたコードを SQL ではどう書くのかを考えながら問題を解くことで SQL のスキルも大きく向上しました。

また、各問題には実務を想定したケースが多く含まれていて、新たなテクニックや考え方を具体的に学べた点も非常に有益でした。

## まとめ

『{{< product-name "ds100kdp" >}}』は、データサイエンスの基礎として欠かせない「構造化データの加工スキル」を体系的に学べる良書です。

**特におすすめのポイント**
- SQL・Python・R でデータ加工を学べる
- 実務に即した演習問題が豊富
- 初級から中級へと段階的に学べる構成で、無理なくスキルアップできる

データ加工のスキルを高めたい方、異なるプログラミング言語でのデータ処理を比較しながら学びたい方におすすめの一冊です。

興味を持った方は、以下のリンクからチェックできます。

- {{< product-link id="ds100kdp" platform="amazon" >}}
