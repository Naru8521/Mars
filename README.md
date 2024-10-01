# Mars

## 機能一覧
・プロキシ  
・自動マージ  
・ビヘイビア/リソースパックmanifestの自動更新  
・バックアップ  
・[MARS_SCRIPT](https://github.com/Naru8521/Mars_Script)の取得  
・~~パケット操作~~

## 使い方
[コチラ](https://github.com/Naru8521/Mars/releases)から、使用デバイス用の実行ファイルを任意のフォルダに配置してください。

配置した実行ファイルをダブルクリックで起動します。

そうすると、サーバー用のフォルダとserver.ymlファイルが生成されます。

```yaml
# プロキシサーバー
proxy:
  # プロキシのIP
  host: 127.0.0.1

  # プロキシのポート
  port: 19132

# マインクラフトサーバー
server:
  # サーバー名
  name: "Bedrock Server"

  # サーバーフォルダ
  path: bedrock_server

  # サーバーバージョン
  version: 1.21.30.03

  # 自動マージ
  auto_merge: false

  # packsの自動更新
  packs_auto_update: true

  # バックアップ
  backup:
    # サーバーが停止した時、自動でバックアップ
    server_stop_auto: true

    # バックアップの後、自動で再起動する (エラーの場合を除く)
    server_auto_restart: true

    # サーバーのバックアップ自動削除 (最大数に達したとき)
    auto_delete: true

    # サーバーバックアップ最大数
    max_data: 20
```
プロキシのホストを、任意の値で設定する必要があります。

設定が完了次第、サーバーを起動して、サーバーでプレイすることができます。

## コマンド
### reload
サーバーのリロードを行います。

### stop
サーバーを停止します。

### restart
サーバーを再起動します。

### backup
サーバーのバックアップを行います。

### merge
サーバーをマージします。

### transfer
プレイヤーを特定のサーバーに転送します。

### kick
プレイヤーを理由と共にキックします。

### allowlist
ホワイトリストの追加や削除を行います。