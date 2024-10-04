import type { Packet } from "../../types";

export default function biome_definition_list(packet: Packet): Packet {
    const { params } = packet.data;

    // params.nbt: バイオームに関するNBTデータ

    return params;
}