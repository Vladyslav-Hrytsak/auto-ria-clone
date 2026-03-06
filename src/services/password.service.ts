import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export const passwordService = new PasswordService();
