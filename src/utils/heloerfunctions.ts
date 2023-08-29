import { ApiResponse, ApiResponseError } from "shared-data/types";
import * as bcrypt from "bcrypt";

export class ApiResponseClass<T extends object | null>
  implements ApiResponse<T>
{
  constructor(
    public status: boolean,
    public data: T | null = null,
    public error?: ApiResponseError,
  ) {}

  static successResponse<T extends object>(data: T): ApiResponse<T> {
    return new ApiResponseClass<T>(true, data);
  }

  static failureResponse(error: ApiResponseError): ApiResponse<null> {
    return new ApiResponseClass<null>(false, null, error);
  }
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}
