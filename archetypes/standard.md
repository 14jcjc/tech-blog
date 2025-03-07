---
{{ $id := lower .File.ContentBaseName -}}
title: "{{ .Site.Params.k100.site.rsql }}{{ .Site.Params.k100.site.title }} ({{ .Site.Params.k100.site.edition.s }}) {{ upper .File.ContentBaseName }}"
date: "{{ .Date }}"
slug: "{{ $id }}"
# draft: true
description: ""
# summary: ""
# weight: 10
categories: 
  - "100本ノック＋α (Lv1)"
tags: 
  - R
  - SQL
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

{{% include "/100knocks/standard/template/tmp-head.md" %}}

## 設問概要

{{< k100/question >}}

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

{{% include "/100knocks/standard/template/tmp-foot.md" %}}
