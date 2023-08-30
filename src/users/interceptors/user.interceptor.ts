//https://youtu.be/KkKiSN_yzdI?t=25670
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jsonwebtoken from "jsonwebtoken";
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    try {
      const jwt = request?.headers?.authorization?.split(" ")[1];
      if (jwt) {
        const userTokenData = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
        request.userTokenData = userTokenData;
      }
    } catch (error) {}

    return handler.handle();
  }
}
