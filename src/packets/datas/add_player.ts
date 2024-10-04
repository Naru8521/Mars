import type { Packet } from "../../types";

export default function add_player(packet: Packet): Packet {
    const { params } = packet.data;

    // params.uuid: プレイヤーのUUID
    // params.username: プレイヤー名
    // params.runtime_id: ランタイムID
    // params.platform_chat_id: 特定のプラットフォームに関連するチャットID
    // params.position: プレイヤーの座標
    // params.velocity: プレイヤー初期速度ベクトル
    // params.pitch | yaw | head_yaw: 向きや視線の角度
    // params.held_item: 現在持っているアイテム
    // params.gamemode: ゲームモード
    // params.metadata: プレイヤーに関連する追加のメタデータ
    // params.properties: プレイヤーに関する特定のプロパティ
    // params.unique_id: プレイヤーの一意なID(サーバー内)
    // params.permission_level: 権限レベル
    // params.command_permission: 使用できるコマンドの権限レベル
    // params.abilities: 特定の能力やスキル
    // params.links: 他のエンティティやプレイヤーとのリンク情報
    // params.device_id: 接続しているデバイスのID
    // params.device_os: 使用しているデバイスのオペレーティングシステム

    console.log(params.position);

    return params;
}