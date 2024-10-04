import type { Packet } from "../../types";

export default function update_subchunk_blocks(packet: Packet): Packet {
    const { params } = packet.data;

    // params.x | y | z: サブチャンク内の座標
    // params.blocks: サブチャンク内のブロックデータ
    // params: extra: ブロックの詳細な状態

    return params;
}