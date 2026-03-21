import { ApiError } from "../errors/api-error";
import { profanityRepository } from "../repositories/profanity.repository";

class ProfanityService {
  private badWords: string[] = [];

  private fallbackWords: string[] = ["shit", "fuck", "bitch", "хуй", "пизда"];

  public async init() {
    const words = await profanityRepository.getAll();

    if (!words.length) {
      console.warn("⚠️ Profanity DB empty, using fallback");
      this.badWords = this.fallbackWords;
    } else {
      this.badWords = words;
    }

    console.log("Profanity loaded:", this.badWords.length);
  }

  public async refresh() {
    this.badWords = await profanityRepository.getAll();
  }

  private normalize(text: string) {
    return text.toLowerCase().trim();
  }

  public checkTexts(texts: string[]) {
    const found = new Set<string>();

    for (const text of texts) {
      const normalized = this.normalize(text);

      for (const word of this.badWords) {
        if (normalized.includes(word)) {
          found.add(word);
        }
      }
    }

    return {
      hasProfanity: found.size > 0,
      words: Array.from(found),
    };
  }

  public async addWord(word: string) {
    const normalized = word.toLowerCase().trim();

    if (!normalized) {
      throw new ApiError("Word is required", 400);
    }

    await profanityRepository.create(normalized);

    await this.refresh();

    return {
      message: "Word added",
    };
  }
}

export const profanityService = new ProfanityService();
