import type { Packet } from "../../types";

export default function camera_presets(packet: Packet): Packet {
    const { params } = packet.data;

    // params.presets: カメラプリセット

    return params;
}