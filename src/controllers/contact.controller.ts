import { NextFunction, Response } from "express";

import { contactService } from "../services/contact.service";
import { AuthRequest } from "../types/authRequest.interface";

class ContactController {
  public async contactSeller(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { listingId } = req.params;
      const dto: { message: string; phone: string } = req.body;

      const result = await contactService.contactSeller(
        req.user,
        listingId,
        dto,
      );

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const contactController = new ContactController();
