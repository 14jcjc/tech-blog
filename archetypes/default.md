---
<<<<<<< HEAD
# title: '{{ replace .File.ContentBaseName "-" " " | title }}'
title: "{{ .Site.Params.k100.site.rsql }}{{ .Site.Params.k100.site.title }}（{{ .Site.Params.k100.site.editionS }}）{{ upper .File.ContentBaseName }}"
date: '{{ .Date }}'
slug: '{{ lower .File.ContentBaseName }}'
# draft: true
categories: 
  - "{{ .Site.Params.k100.site.category.editionS }}"
---
=======
title: "{{ replace .Name "-" " " | title }}"
description: 
date: {{ .Date }}
image: 
math: 
license: 
hidden: false
comments: true
draft: true
---
>>>>>>> 4728414 (commit)
