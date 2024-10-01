import { BedrockServer } from "./core/bedrockServer";

(async () => {
    await new BedrockServer().start();
})();