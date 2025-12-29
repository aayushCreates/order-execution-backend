import { randomUUID } from "crypto";

export class MockDexRouter {
    async getBestRoute() {
        const raydium = 100 * (0.98 + Math.random() * 0.04);
        const meteora = 100 * (0.97 + Math.random() * 0.05);

        return raydium > meteora
        ? { dex: "Raydium", price: raydium }
        : { dex: "Meteora", price: meteora };
    }

    async executeSwap(dex: string) {
        await new Promise((r) => setTimeout(r, 2500));
    
        return {
          txHash: randomUUID(),
          executedPrice: 100,
        };
      }
}
