import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";

config();

export class MyJwtSigner {
  private static secretKey: string = process.env.JWT_SECRET;
  static jwtService: JwtService = new JwtService();

  static sign(
    payload: object,
    options: SignOptions = { expiresIn: "1y" },
  ): string {
    return jwt.sign(payload, MyJwtSigner.secretKey, options);
  }
}

export class MyJwtVerifier {
  private static secretKey: string = process.env.JWT_SECRET;

  static verify(token: string): any {
    return jwt.verify(token, MyJwtVerifier.secretKey);
  }
}
