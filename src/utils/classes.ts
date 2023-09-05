import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { ApiResponseClass } from "./functions";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

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

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      response
        .status(status)
        .json(
          ApiResponseClass.failureResponse({ codeMessage: message.toString() }),
        );
    } else {
      response.status(500).json(
        ApiResponseClass.failureResponse({
          codeMessage: "Internal server error",
        }),
      );
    }
  }
}
