import type { Packet } from "../../types";

export default function resource_packs_info(packet: Packet): Packet {
    const { params } = packet.data;

    // params.must_accept: 強制
    // params.has_addons: アドオンがあるか
    // params.has_scripts: スクリプトが有効
    // params.texture_packs: サーバーに参加する前にダウンロードする必要があるパックリスト
    // params.resource_pack_links: リソースパックのリンクリスト

    return params;
}