import type { Packet } from "../../types";

export default function take_item_entity(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.target: 拾われたアイテムのID

    return params;
}