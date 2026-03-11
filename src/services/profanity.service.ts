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

  public checkText(text: string) {
    const normalizedText = text.toLowerCase();

    const foundWords = this.badWords.filter((word) =>
      normalizedText.includes(word),
    );

    return {
      hasProfanity: foundWords.length > 0,
      words: foundWords,
    };
  }
}

export const profanityService = new ProfanityService();
