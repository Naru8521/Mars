import unconnectPing from "./client/unconnectPing";
import openConnectionRequest1 from "./client/openConnectionRequest1";
import openConnectionRequest2 from "./client/openConnectionRequest2";
import ready from "./client/ready";
import ack from "./client/ack";
import nack from "./client/nack";

const option = { type: "CLIENT", logColor: "yellow" };

/**
 * クライアントからのパケットを解析
 * @param packet 
 */
export default function ClientPacket(packet: Buffer): Buffer {
    // if (packet[0] === 0x01 || packet[0] === 0x02) packet = unconnectPing(packet, option);
    // if (packet[0] === 0x05) packet = openConnectionRequest1(packet, option);
    // if (packet[0] === 0x07) packet = openConnectionRequest2(packet, option);
    // if (packet[0] === 0x84) packet = ready(packet, option);
    // if (packet[0] === 0xc0) packet = ack(packet, option);
    // if (packet[0] === 0xa0) packet = nack(packet, option);

    return packet;
}