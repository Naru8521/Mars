import type { Packet } from "../../types";

export default function crafting_data(packet: Packet): Packet {
    const { params } = packet.data;

    // params.recipes: レシピ
    // params.potion_type_recipes: ポーションのレシピ
    // params.potion_container_recipes: ポーションのコンテナー
    // params.material_reducers: ゲーム内で材料を減少させるプロセス
    // params.clear_recipes: 現在保持されているクラフティングレシピをクリアし、新しいレシピセットを読み込む

    return params;
}