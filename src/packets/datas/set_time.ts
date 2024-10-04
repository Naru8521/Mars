import type { Packet } from "../../types";

export default function set_time(packet: Packet): Packet {
    const { params } = packet.data;

    // サーバーによって送信され、クライアント側の現在の時刻を更新する
    // params.time: サーバー時間

    return params;
}