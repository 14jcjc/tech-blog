---
# draft: true
build: 
  list: never
  publishResources: false
  render: never
date: '2025-02-27T20:10:27+09:00'
---

{{% comment %}}
これは「実行環境の構築について」のテンプレート:  
/100knocks/template/tmp-setup.md
{{% /comment %}}

## 実行環境の構築について

本設問のコードを実行するには、以下のいずれかの方法で環境を準備してください。  

- **継続的に使える環境を構築したい場合**  
  他の演習問題でも利用できる環境を用意できます。手順は以下をご覧ください。  

  {{% ref2 path="base/start#setup" %}}

- **本設問のみ一時的な環境を準備する場合**  
  以下のコードを実行して、**DuckDBを一時的に作成**し、データをインポートします。

```r
# pacman を使用してパッケージを管理
if (!require("pacman")) {
  install.packages("pacman")
  library("pacman")
}

# 必要なパッケージのロード
# 存在しない場合はインストールした後にロードする
pacman::p_load(
  magrittr, tibble, dplyr, # データ操作 (tidyverse)
  DBI, dbplyr, duckdb,     # データベース操作
  vroom,                   # CSVファイルの読み込み
  install = TRUE,          # 存在しないパッケージをインストールする
  update = FALSE           # 古いパッケージを更新しない
)

# CSVファイルをデータフレームとして読み込む
data_url = "https://raw.githubusercontent.com/The-Japan-DataScientist-Society/100knocks-preprocess/master/docker/work/data/"

df_receipt = 
  paste0(data_url, "receipt.csv") %>% 
  vroom::vroom(col_types = "iiciiccnn")

# インメモリモードで一時的な DuckDB 環境を作成する
con = duckdb::duckdb(dbdir = "") %>% duckdb::dbConnect()

# データフレームを DuckDB にテーブルとして書き込む
con %>% DBI::dbWriteTable("receipt", df_receipt, overwrite = TRUE)

# DuckDB のテーブルを dplyr で参照する
db_receipt = con %>% dplyr::tbl("receipt")

# my_select() の定義
# SQLクエリを実行し, データフレーム(tibble)を返す
my_select = function(
    statement, con, convert_tibble = TRUE, params = NULL, ...
  ) {
  d = DBI::dbGetQuery(conn = con, statement = statement, params = params, ...)
  if (convert_tibble) d %<>% tibble::as_tibble()
  return(d)
}
```
