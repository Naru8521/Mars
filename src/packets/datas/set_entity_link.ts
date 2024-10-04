import type { Packet } from "../../types";

export default function set_entity_link(packet: Packet): Packet {
    const { params } = packet.data;

    // params.link: エンティティとのリンク

    return params;
}