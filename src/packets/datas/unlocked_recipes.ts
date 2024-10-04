import type { Packet } from "../../types";

export default function unlocked_recipes(packet: Packet): Packet {
    const { params } = packet.data;

    // params.unlock_type: 解除タイプ
    // params.recipes: 解除されたレシピ

    return params;
}