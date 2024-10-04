import type { Packet } from "../../types";

export default function item_component(packet: Packet): Packet {
    const { params } = packet.data;

    // params.entries: アイテムのコンポネント

    return params;
}