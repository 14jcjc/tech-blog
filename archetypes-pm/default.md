---
# title: '{{ replace .File.ContentBaseName "-" " " | title }}'
title: "{{ .Site.Params.site_rsql }}{{ .Site.Params.site_100knocks }}（{{ .Site.Params.site_suffix_s }}）{{ title .File.ContentBaseName }}"
date: '{{ .Date }}'
slug: '{{ lower .File.ContentBaseName }}'
# draft: true
categories: 
  - "{{ .Site.Params.site_category_s }}"
---
