import ack from "./server/ack";
import nack from "./server/nack";
import openConnectionReply1 from "./server/openConnectionReply1";
import openConnectionReply2 from "./server/openConnectionReply2";
import unconnectPong from "./server/unconnectPong";

const option = { type: "SERVER", logColor: "greenBright" };

/**
 * クライアントからのパケットを解析
 * @param packet 
 */
export default function ServerPacket(packet: Buffer): Buffer {
    // if (packet[0] === 0x1c) packet = unconnectPong(packet, option);
    // if (packet[0] === 0x06) packet = openConnectionReply1(packet, option);
    // if (packet[0] === 0x08) packet = openConnectionReply2(packet, option);
    // if (packet[0] === 0xc0) packet = ack(packet, option);
    // if (packet[0] === 0xa0) packet = nack(packet, option);

    return packet;
}