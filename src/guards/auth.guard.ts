//https://youtu.be/KkKiSN_yzdI?t=28853
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jsonwebtoken from "jsonwebtoken";
import { ApiResponseClass } from "../utils/functions";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwt = request?.headers?.authorization?.split(" ")[1];

    const failureResponse = ApiResponseClass.failureResponse({
      codeMessage: "unauthorized",
    });
    if (jwt) {
      try {
        const userTokenData = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
        if (userTokenData) {
          request.userTokenData = userTokenData;
          return true;
        }
      } catch (error) {
        throw new UnauthorizedException(failureResponse);
      }
    }

    throw new UnauthorizedException(failureResponse);
  }
}
