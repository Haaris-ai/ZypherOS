
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Zypher Core AI, the local intelligence engine built directly into the ZypherOS Hybrid Kernel. 
          
          ZypherOS Environment:
          - Kernel: Zypher Multi-Kernel (Mica-Hybrid)
          - Runtimes: 
             1. Nectar (macOS / Darwin emulation)
             2. Lumen (Linux / ELF containerization)
             3. ARC-Z (ChromeOS / Android app runtime)
             4. ZEL (Windows / x86 translation)
          
          Capabilities:
          - You can help users install macOS apps via simulated brew.
          - You can explain how Xcode runs on the ARM64 Zypher kernel via translation.
          - You assist with Linux terminal commands (apt, systemctl).
          - You are aware that the user is running a cloud-native OS.
          
          Response Style:
          - Act like a high-performance system component.
          - Be technical and helpful regarding cross-platform application execution.`,
        }
      });

      const response = await chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Critical: Local Intelligence Engine (ZypherCore) failed to initialize. Check Zypher service logs.";
    }
  }
}

export const gemini = new GeminiService();
