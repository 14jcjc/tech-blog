---
{{ $id := lower .File.ContentBaseName -}}
title: "{{ .Site.Params.k100.site.rsql }}{{ .Site.Params.k100.site.title }} ({{ .Site.Params.k100.site.edition.s }}) {{ upper .File.ContentBaseName }}"
date: "{{ .Date }}"
slug: "{{ $id }}"
# draft: true
categories: 
  - "100本ノック＋α (Lv1)"
tags: 
  - R
  - SQL
params:
  question: 
    edition: standard
    id: "{{ upper $id }}"
---

{{% include "/100knocks/standard/template/tmp-head.md" %}}

## 設問概要

{{< k100/question >}}

---

以下は解答例です。

## Rコード (データフレーム操作)

## Rコード (データベース操作)

## SQLクエリ

{{% include "/100knocks/standard/template/tmp-foot.md" %}}
