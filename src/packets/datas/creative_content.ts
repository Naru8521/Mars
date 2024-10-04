import type { Packet } from "../../types";

export default function creative_content(packet: Packet): Packet {
    const { params } = packet.data;

    // params.items: クリエイティブモードで使用できるアイテムのリスト

    return params;
}