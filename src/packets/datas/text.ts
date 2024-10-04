import type { Packet } from "../../types";

export default function test(packet: Packet): Packet {
    const { params } = packet.data;

    // params.type: メッセージの種類を
    // params.needs_translation: 翻訳が必要かどうか
    // params.source_name: 送信者の名前
    // params.message: メッセージ
    // params.parameters: メッセージに含まれる引数やパラメータ
    // params.xuid: XUID
    // params.platform_chat_id: プラットフォーム固有のチャットID
    // params.filtered_message: フィルタリングされたメッセージ

    return params;
}