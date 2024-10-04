import type { Packet } from "../../types";

export default function client_to_server_handshake(packet: Packet): Packet {
    const { params } = packet.data;

    return params;
}