import type { Packet } from "../../types";

export default function play_status(packet: Packet): Packet {
    const { params } = packet.data;

    // params.status: プレイステータス

    /*
    0 - Login success = ログイン成功
    1 - Failed client = クライアントが古い
    2 - Failed server = サーバーが古い
    3 - Player spawn = プレイヤーをスポーンするためにワールドデータの後に送信される
    4 - Failed invalid Tenant = 世界に接続できません。
    5 - Failed Vanilla Edu = サーバーはMinecraftを起動していません
    6 - Failed incompatible = サーバーは互換性のないMinecraftエディションを実行しています。
    7 - Failed server full = サーバーが満員
    */

    return params;
}