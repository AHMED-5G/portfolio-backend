import { ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { ApiResponseClass } from "./functions";

export const customValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const error = errors[0];
    const constraints = error.constraints;
    const property = error.property;
    const errorMessage = `Validation failed, ${property}: ${Object.values(
      constraints,
    ).join(", ")}`;
    return new HttpException(
      ApiResponseClass.failureResponse({
        codeMessage: errorMessage,
      }),
      HttpStatus.BAD_REQUEST,
    );
  },
});
