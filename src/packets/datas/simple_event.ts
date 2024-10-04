import type { Packet } from "../../types";

export default function simple_event(packet: Packet): Packet {
    const { params } = packet.data;

    // params.event_type: イベントタイプ
    
    return params;
}