import type { Packet } from "../../types";

export default function emote_list(packet: Packet): Packet {
    const { params } = packet.data;

    // params.player_id: プレイヤーのID(サーバー)
    // params.emote_pieces: エモートリスト

    return packet;
}