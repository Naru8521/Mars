import type { Packet } from "../../types";

export default function sync_entity_property(packet: Packet): Packet {
    const { params } = packet.data;

    // params.nbt: エンティティのNBTデータ

    return params;
}