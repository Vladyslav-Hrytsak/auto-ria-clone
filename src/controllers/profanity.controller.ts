import { NextFunction, Request, Response } from "express";

import { profanityService } from "../services/profanity.service";

class ProfanityController {
  public async addWord(req: Request, res: Response, next: NextFunction) {
    try {
      const { word } = req.body;

      const result = await profanityService.addWord(word);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const profanityController = new ProfanityController();
