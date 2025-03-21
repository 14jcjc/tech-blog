---
{{ $id := lower .File.ContentBaseName -}}
title: "{{ .Site.Params.k100.site.rsql }}{{ .Site.Params.k100.site.titleF }} ({{ .Site.Params.k100.site.edition.s }}) {{ upper .File.ContentBaseName }}"
date: "{{ .Date }}"
slug: "{{ $id }}"
# draft: true
description: ""
# summary: ""
# weight: 10
categories: 
  - "データサイエンス100本ノック＋α"
tags: 
params:
  question: 
    edition: standard
    id: "{{ upper $id }}"
# disableShare: false
# UseHugoToc: true
# ShowToc: false
# TocOpen: false
# tableOfContents:
#   ordered: false
#   startLevel: 2
#   endLevel: 5
---

{{% include "/ds-drills/data-tf/free/template/tmp-head.md" %}}

## 設問概要

{{< k100/question >}}

## 実行環境の構築について

本設問のコードを実行するには、以下のいずれかの方法で環境を準備してください。  

- **継続的に使える環境を構築したい場合**  
  他の演習問題でも利用できる環境を用意できます。手順は以下をご覧ください。  

  {{% ref2 path="base/start#setup" %}}

- **本設問のみ一時的な環境を準備する場合**  
  以下のコードを実行して、**DuckDBを一時的に作成**し、データをインポートします。

```r

```

## 利用するデータの概要

本設問では、以下のデータを利用します。

- 

ここでは、データフレームから主要なカラムを抜き出してデータの一部を確認します。

```r

```

```text

```

---

解答例を以下に示します。

## R (データフレーム操作)

### 解答例と実行結果

```r

```

```text

```

### 解説

## R (データベース操作)

### 解答例と実行結果

```r

```

```text

```

### 解説

- **`db_result %>% collect()`**  
  データベース操作の結果を R のデータフレーム (tibble) として取得します。

## SQL

### 自動生成された SQL クエリ

データベース操作による結果 (`db_result`) に基づき、自動生成された SQLクエリを `show_query()` で確認できます。

```r

```

```sql

```

### 解答例

このクエリをより簡潔な形に書き直すと、次のようになります。

```sql

```

### 解説

### 実行結果の確認

この SQLクエリの実行結果は、次のようにして確認できます。

```r

```

```text

```

{{% include "/ds-drills/data-tf/free/template/tmp-foot.md" %}}
