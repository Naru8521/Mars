import type { Packet } from "../../types";

export default function level_event(packet: Packet): Packet {
    const { params } = packet.data;

    // params.event: 発生したイベントの種類
    // params...: イベントのデータ

    return params;
}