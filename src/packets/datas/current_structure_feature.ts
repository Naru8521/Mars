import type { Packet } from "../../types";

export default function current_structure_feature(packet: Packet): Packet {
    const { params } = packet.data;

    // params.current_feature: 現在の構造の特徴

    return params;
}