import type { Packet } from "../../types";

export default function trim_data(packet: Packet): Packet {
    const { params } = packet.data;

    // params.patterns: 装飾パターン
    // params.materials: 装飾マテリアル

    return params;
}