import type { Packet } from "../../types";

export default function entity_event(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.event_id: エンティティイベントID

    return packet;
}