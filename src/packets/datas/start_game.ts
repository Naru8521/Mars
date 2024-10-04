import type { Packet } from "../../types";

export default function start_game(packet: Packet): Packet {
    const { params } = packet.data;

    // サーバーによって送信され、クライアント側の現在の時刻を更新する
    // params.entity_id: エンティティID
    // params.runtime_entity_id: ランタイムエンティティID
    // params.player_gamemode: プレイヤーゲームモード
    // params.player_position: プレイヤーのポジション
    // params.rotation: プレイヤーの視点の向き
    // params.seed: ワールドのシード
    // params.biome_type: プレイヤーがいるバイオームタイプ
    // params.biome_name: プレイヤーがいるバイオーム名
    // params.dimension: プレイヤーのディメンション
    // params.generator: ジェネレーター => 0.制限付き, 1.無限, 2.フラット, 3.ネザー, 4.エンド
    // params.world_gamemode: ワールドのゲームモード
    // params.hardcore: ハードコアモード
    // params.difficulty: 難易度 => 0.peacefull, 1.easy, 2.normal, 3.hard
    // params.spawn_position: ワールドスポーン
    // params.achievements_disabled: 実績
    // params.editor_world_type: エディタータイプ
    // params.created_in_editor: エディターによって作成されたワールド
    // params.exported_from_editor: エディターにエクスポート
    // params.day_cycle_stop_time: 日サイクル停止時のロックされた時間
    // params.edu_offer: EDUオファー => 0.None, 1.RestOfWorld, 2.中国
    // params.edu_features_enabled: 教育版
    // params.edu_product_uuid: 教育版UUID
    // params.rain_level: 雨量レベル
    // params.lightning_level: 雷レベル
    // params.has_confirmed_platform_locked_content: プラットフォームロックされたコンテンツを確認済み
    // params.is_multiplayer: ワールドがマルチプレイヤーゲームであるか
    // params.broadcast_to_lan: LANへのブロードキャスト
    // params.xbox_live_broadcast_mode: 参加したゲームをXBOXLive経由でブロードキャストするために使用されるモード
    // params.platform_broadcast_mode: 参加したゲームをプラットフォーム全体にブロードキャストするために使用されるモード
    // params.enable_commands: コマンドの有効化
    // params.is_texturepacks_required: テクスチャパックの必要性
    // params.gamerules: ゲームルール
    // params.experiments: 実験機能
    // params.experiments_previously_used: 実験機能の使用
    // params.bonus_chest: ボーナスチェスト
    // params.map_enabled: 初期マップ
    // params.permission_level: プレイヤーの権限レベル
    // params.server_chunk_tick_range: チャンクがチェックされるプレイヤーの周囲の半径
    // params.has_locked_behavior_pack: ワールドのビヘイビアパックをロック
    // params.has_locked_resource_pack: ワールドのリソースパックをロック
    // params.is_from_locked_world_template: サーバーの世界がロックされた世界テンプレートか
    // params.msa_gamertags_only: MSAゲーマータグのみを使用
    // params.is_from_world_template: 世界テンプレートか
    // params.is_world_template_option_locked: ワールドが、設定GUIで上記のプロパティを変更するすべての設定をロックするテンプレートであるかどうかを指定
    // params.only_spawn_v1_villagers: V1の村人のみをスポーンする
    // params.persona_disabled: ペルソナの無効
    // params.custom_skins_disabled: カスタムスキンの許可
    // params.emote_chat_muted: チャット、エモートのミュート
    // params.game_version: ゲームバージョン
    // params.limited_world_width: 制限されたワールド幅
    // params.limited_world_length: 制限されたワールド長さ
    // params.is_new_nether: 新しいネザー
    // params.edu_resource_uri: リソースパックのURI
    // params.experimental_gameplay_override: 実験機能のオーバーライド
    // params.chat_restriction_level: サーバーチャットレベル
    // params.disable_player_interactions: プレイヤーインタラクションを無効にする
    // params.server_identifier: サーバーID
    // params.world_identifier: ワールドID
    // params.scenario_identifier: シナリオID
    // params.level_id: レベルID
    // params.world_name: ワールド名
    // params.premium_world_template_id: 世界テンプレートID
    // params.is_trial: トライアル
    // params.movement_authority: ムーブメント巻き戻しサイズ
    // params.rewind_history_size: 巻き戻し履歴のサイズ
    // params.server_authoritative_block_breaking: サーバーの権威ブロック破壊
    // params.current_tick: 現在のティック
    // params.enchantment_seed: エンチャントシード
    // params.block_properties: サーバー上のカスタムブロックの文字列とタグの配列
    // params.itemstates: ゲーム内で利用可能なすべてのアイテムと、レガシーIDのリスト
    // params.multiplayer_correlation_id: マルチプレイヤーセッションのID
    // params.server_authoritative_inventory: 権限のあるインベントリサーバー
    // params.engine: サーバーバージョン
    // params.property_data: ゲーム内で利用可能なプロパティのデータ
    // params.block_pallette_checksum: ワールドデータの整合性を確認するためのハッシュ値
    // params.world_template_id: 世界テンプレートのID
    // params.client_side_generation: データやコンテンツを生成する
    // params.block_network_ids_are_hashes: 効率的なネットワーク通信とデータ管理のブロックID
    // params.server_controlled_sound: サーバーから音を操作

    return params;
}