import type { Packet } from "../../types";

export default function block_entity_data(packet: Packet): Packet {
    const { params } = packet.data;

    // params.position: ブロックエンティティが存在するワールド内の座標
    // params.nbt: ブロックエンティティの状態やデータを保存するNBT

    return params;
}