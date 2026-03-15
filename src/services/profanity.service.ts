class ProfanityService {
  private badWords: string[] = [
    // English
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

    // Ukrainian
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
}

export const profanityService = new ProfanityService();
