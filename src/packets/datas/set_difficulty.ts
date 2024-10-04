import type { Packet } from "../../types";

export default function set_difficulty(packet: Packet): Packet {
    const { params } = packet.data;

    // params.diffuculty: 難易度

    return params;
}