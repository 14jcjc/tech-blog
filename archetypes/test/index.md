---
{{ $id := lower .File.ContentBaseName -}}
# [R & SQL] データサイエンス100本ノック＋α - R-030
title: "{{ .Site.Params.k100.site.rsql }}{{ .Site.Params.k100.site.titleF }} ({{ .Site.Params.k100.site.edition.s }}) {{ upper .File.ContentBaseName }}"
date: "{{ .Date }}"
slug: "{{ $id }}"
# draft: true
categories: 
  - "{{ .Site.Params.k100.site.category.editionS }}"
params:
  question: 
    edition: standard
    id: "{{ upper $id }}"
---

{{% include ".../*.md" %}}
{{< k100/question "s" >}}
{{% include ".../*.md" %}}
