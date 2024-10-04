import type { Packet } from "../../types";

export default function update_block(packet: Packet): Packet {
    const { params } = packet.data;

    // params.position: 更新されるブロックのワールド内の座標
    // params.block_runtime_id: 更新されるブロックのランタイムID
    // params.flags: ブロックに関連するフラグ
    // params.layer: ブロックが存在するレイヤー

    return params;
}