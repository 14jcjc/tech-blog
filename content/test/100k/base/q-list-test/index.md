---
title: "[R+SQL] データサイエンス100本ノック＋α - 演習問題一覧 (test)"
slug: "q-list-test"
date: 2021-05-03T00:10:20+09:00
draft: true
weight: 12
# description: "{{< k100/q-list >}} RとSQLの演習問題一覧です。"

categories: ["DS-100本ノック"]
tags: 
  - R
  - SQL
params: 
  ShowPostNavLinks: false
cover:
  # image: "images/papermod-cover.png" #< /static
  # image: "images/100knocks/cover-100k-standard.png" #< /static
  # relative: false
  hiddenInList: false
  hiddenInSingle: false # hide on single page
  # hidden: true
ShowToc: false
TocOpen: false
---

<font color="#F0B007">★</font>は難易度です。
{{< k100/site/edition "s" >}}は概要を掲載してます。

<div class="list-toggle">
  <div class="row">
    <label>
      <input type="radio" name="edition-toggle" value="all" checked>
      <span>全編</span>
    </label>
    <label>
      <input type="radio" name="edition-toggle" value="standard">
      <span>{{< k100/site/edition "s" >}}</span>
    </label>
    <label>
      <input type="radio" name="edition-toggle" value="advanced">
      <span>{{< k100/site/edition "a" >}}</span>
    </label>
  </div>

  <div class="row">
    <label>
      <input type="radio" name="order-toggle" value="id" checked>
      <span>番号順</span>
    </label>
    <label>
      <input type="radio" name="order-toggle" value="difficulty-desc">
      <span>難易度降順</span>
    </label>
    <label>
      <input type="radio" name="order-toggle" value="difficulty-asc">
      <span>難易度昇順</span>
    </label>
  </div>
</div>

<!-- 全9パターンのリスト（最初はデフォルト以外を非表示にしておく） -->
<div id="list-id-all" class="question-list" style="display:block;">
  <div class="edition-title">全編（番号順）</div>

  1. {{< k100/site/edition "a" >}}
  
  {{< k100/q-list ed="advanced" root="../.." sortkey="id" order="asc" >}}

  2. {{< k100/site/edition "s" >}}
  
  {{< k100/q-list ed="standard" root="../.." sortkey="id" order="asc" >}}

  {{% comment %}}
  {{< k100/q-list ed="standard,advanced" root="../.." sortkey="id" order="asc" >}}
  {{% /comment %}}
</div>

<div id="list-difficulty-desc-all" class="question-list" style="display:none;">
  <div class="edition-title">全編（難易度降順）</div>
  {{< k100/q-list ed="standard,advanced" root="../.." sortkey="difficulty" order="desc" >}}
</div>

<div id="list-difficulty-asc-all" class="question-list" style="display:none;">
  <div class="edition-title">全編（難易度昇順）</div>
  {{< k100/q-list ed="standard,advanced" root="../.." sortkey="difficulty" order="asc" >}}
</div>

<div id="list-id-standard" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "s" >}}（番号順）</div>
  {{< k100/q-list ed="standard" root="../.." sortkey="id" order="asc" >}}
</div>

<div id="list-difficulty-desc-standard" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "s" >}}（難易度降順）</div>
  {{< k100/q-list ed="standard" root="../.." sortkey="difficulty" order="desc" >}}
</div>

<div id="list-difficulty-asc-standard" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "s" >}}（難易度昇順）</div>
  {{< k100/q-list ed="standard" root="../.." sortkey="difficulty" order="asc" >}}
</div>

<div id="list-id-advanced" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "a" >}}（番号順）</div>
  {{< k100/q-list ed="advanced" root="../.." sortkey="id" order="asc" >}}
</div>

<div id="list-difficulty-desc-advanced" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "a" >}}（難易度降順）</div>
  {{< k100/q-list ed="advanced" root="../.." sortkey="difficulty" order="desc" >}}
</div>

<div id="list-difficulty-asc-advanced" class="question-list" style="display:none;">
  <div class="edition-title">{{< k100/site/edition "a" >}}（難易度昇順）</div>
  {{< k100/q-list ed="advanced" root="../.." sortkey="difficulty" order="asc" >}}
</div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
  const questionLists = document.querySelectorAll('.question-list');

  const updateList = () => {
    const selectedOrder = document.querySelector('input[name="order-toggle"]:checked')?.value;
    const selectedEdition = document.querySelector('input[name="edition-toggle"]:checked')?.value;

    if (!selectedOrder || !selectedEdition) return; // チェックされていない場合は処理を中断

    // すべてのリストを非表示に
    questionLists.forEach(list => list.style.display = 'none');

    // 選択されたリストを表示（存在する場合のみ）
    const targetList = document.getElementById(`list-${selectedOrder}-${selectedEdition}`);
    if (targetList) {
      targetList.style.display = 'block';
    }

    // 選択状態を localStorage に保存
    localStorage.setItem('order', selectedOrder);
    localStorage.setItem('edition', selectedEdition);
  };

  // ページ読み込み時に localStorage から読み取る
  let savedOrder = localStorage.getItem('order');
  let savedEdition = localStorage.getItem('edition');

  // localStorage に値がない場合、デフォルトを設定
  let defaultOrder = document.querySelector('input[name="order-toggle"]:checked')?.value;
  let defaultEdition = document.querySelector('input[name="edition-toggle"]:checked')?.value;

  // localStorage の値を設定
  if (!savedOrder && defaultOrder) {
    savedOrder = defaultOrder;
    localStorage.setItem('order', savedOrder);
  } else if (!savedOrder) {
    localStorage.removeItem('order'); // 不要な値を削除
  }

  if (!savedEdition && defaultEdition) {
    savedEdition = defaultEdition;
    localStorage.setItem('edition', savedEdition);
  } else if (!savedEdition) {
    localStorage.removeItem('edition'); // 不要な値を削除
  }

  // ローカルストレージの値を適用（存在する場合のみ）
  const orderRadio = document.querySelector(`input[name="order-toggle"][value="${savedOrder}"]`);
  const editionRadio = document.querySelector(`input[name="edition-toggle"][value="${savedEdition}"]`);

  // ローカルストレージの値が正しければラジオボタンにチェックを入れる
  if (orderRadio) {
    orderRadio.checked = true;
  }

  if (editionRadio) {
    editionRadio.checked = true;
  }

  // イベントリスナーを設定
  document.querySelectorAll('input[name="order-toggle"], input[name="edition-toggle"]').forEach(radio => {
    radio.addEventListener('change', updateList);
  });

  // 初回のリスト表示を確実に行う
  updateList();
});
</script>
