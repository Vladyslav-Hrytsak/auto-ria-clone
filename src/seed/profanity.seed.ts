import dotenv from "dotenv";
import mongoose from "mongoose";

import { profanityRepository } from "../repositories/profanity.repository";

dotenv.config();

const words = [
  "shit",
  "fuck",
  "bitch",
  "asshole",
  "damn",
  "cunt",
  "dick",
  "piss",
  "bastard",
  "motherfucker",
  "faggot",
  "slut",
  "whore",
  "bollocks",
  "wanker",
  "prick",

  "хуй",
  "пизда",
  "їбати",
  "блядь",
  "сука",
  "курва",
  "гімно",
  "падло",
  "залупа",
  "манда",
  "мудак",
  "виродок",
  "дупа",
  "сволота",
  "гніда",
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URL!);

  await profanityRepository.createMany(words);

  console.log("Profanity words seeded");

  process.exit(0);
}

seed();
