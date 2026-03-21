import { IProfanity } from "../interfaces/profanity.interface";
import { Profanity } from "../models/profanity.model";

class ProfanityRepository {
  public async getAll(): Promise<string[]> {
    const words = await Profanity.find();
    return words.map((w) => w.word);
  }

  public async createMany(words: string[]): Promise<void> {
    const docs = words.map((word) => ({ word }));

    await Profanity.insertMany(docs, { ordered: false });
  }

  public async create(word: string): Promise<IProfanity> {
    return await Profanity.create({ word });
  }
}

export const profanityRepository = new ProfanityRepository();
