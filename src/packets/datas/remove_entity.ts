import type { Packet } from "../../types";

export default function remove_entity(packet: Packet): Packet {
    const { params } = packet.data;

    // params.entity_id_self: エンティティのID

    return params;
}