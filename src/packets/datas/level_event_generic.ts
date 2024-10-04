import type { Packet } from "../../types";

export default function level_event_generic(packet: Packet): Packet {
    const { params } = packet.data;

    // params.event_id: イベントのID
    // params.nbt: NBTのシリアル化

    return params;
}