//https://youtu.be/KkKiSN_yzdI?t=25483
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserD = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.userTokenData;
});
