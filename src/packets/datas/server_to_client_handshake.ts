import type { Packet } from "../../types";

export default function server_to_client_handshake(packet: Packet): Packet {
    const { params } = packet.data;

    // params.token: トークン

    return params;
}