import type { Packet } from "../../types";

export default function available_entity_identifiers(packet: Packet): Packet {
    const { params } = packet.data;

    // params.nbt: ゲーム内で使用可能なエンティティ

    return params;
}