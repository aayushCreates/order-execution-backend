import { randomUUID } from "crypto";

export class MockDexRouter {
    async getBestRoute() {
        console.log("[MockDex] Calculating best route...");
        const raydium = 100 * (0.98 + Math.random() * 0.04);
        const meteora = 100 * (0.97 + Math.random() * 0.05);

        console.log(`[MockDex] Raydium Price: ${raydium.toFixed(4)}, Meteora Price: ${meteora.toFixed(4)}`);

        const result = raydium > meteora
        ? { dex: "Raydium", price: raydium }
        : { dex: "Meteora", price: meteora };

        console.log(`[MockDex] Selected ${result.dex} at price ${result.price.toFixed(4)}`);
        return result;
    }

    async executeSwap(dex: string) {
        console.log(`[MockDex] Initiating swap on ${dex}...`);
        await new Promise((r) => setTimeout(r, 2500));
        
        const result = {
          txHash: randomUUID(),
          executedPrice: 100,
        };
        console.log(`[MockDex] Swap completed on ${dex}. TxHash: ${result.txHash}`);
        return result;
      }
}
