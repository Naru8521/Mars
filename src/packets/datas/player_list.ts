import type { Packet } from "../../types";

export default function player_list(packet: Packet): Packet {
    const { params } = packet.data;

    // params.records: プレイヤーのレコード

    return params;
}