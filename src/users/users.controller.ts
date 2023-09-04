import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UseGuards,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import { ApiResponse } from "shared-data/types";
import {
  MeSuccessObject,
  RequestLoginSuccessObject,
} from "shared-data/constants/requestsData";
import { MeUserResponse } from "./dto/user.dto";
import { plainToClass } from "class-transformer";
import { UserD } from "./decorators/user.decorator";
import { UserTokenPayload } from "src/types";
import { AuthGuard } from "../../src/guards/auth.guard";
import { ApiResponseClass, hashPassword } from "../utils/functions";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { ResetPasswordDto } from "./dto/reset-password-require-data.dto";
import { validate } from "class-validator";
import { CreateUserDto } from "./dto/create-user.dto";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post("register")
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<null>> {
    try {
      const hashedPassword = hashPassword(createUserDto.password);
      createUserDto.password = hashedPassword;
      this.usersService.create(createUserDto);
      return ApiResponseClass.successResponse(null);
    } catch (error) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Internal Server Error",
      });
    }
  }

  @Post("login")
  async login(
    @Body() data: LoginUserDto,
  ): Promise<ApiResponse<RequestLoginSuccessObject>> {
    const user = await this.usersService.findOneByEmail(data.email);

    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Invalid credentials",
      });
    }

    try {
      const jwt = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (!jwt) {
        return ApiResponseClass.failureResponse({
          codeMessage: "Invalid JWT",
        });
      }

      return ApiResponseClass.successResponse({
        jwt,
      });
    } catch (error) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Internal Server Error",
      });
    }
  }

  @ApiOkResponse({
    type: MeUserResponse,
  })
  @UseGuards(AuthGuard)
  @Get("me")
  async me(
    @Headers("authorization") authorization: string,
  ): Promise<ApiResponse<MeSuccessObject>> {
    const token = authorization?.split(" ")[1];

    if (!token) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Invalid token",
      });
    }

    try {
      const userData: UserTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (!userData || !userData["id"]) {
        return ApiResponseClass.failureResponse({
          codeMessage: "Invalid token",
        });
      }

      const { id } = userData;
      const foundUser = await this.usersService.findOne(id);

      if (!foundUser) {
        return ApiResponseClass.failureResponse({
          codeMessage: "User not found",
        });
      }

      const transformedUser = plainToClass(MeUserResponse, foundUser);

      return ApiResponseClass.successResponse(transformedUser);
    } catch (error) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Something went wrong",
      });
    }
  }

  //reset password
  @Post("request-reset-password")
  async requestResetPassword(
    @Body("email") email: string,
  ): Promise<ApiResponse<null>> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        return ApiResponseClass.failureResponse({
          codeMessage: "User not found",
        });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      } as unknown as SMTPTransport);

      const token = await this.usersService.createResetToken(email);

      const htmlContent = `
      <html>
        <body>
          <h1>Reset Password Code</h1>
          <p>Your reset password code is: <strong>${token}</strong></p>
        </body>
      </html>
    `;

      const mailOptions = {
        from: {
          address: process.env.MAIL_FROM_ADDRESS,
          name: process.env.MAIL_FROM_NAME,
        },
        to:
          process.env.NODE_ENV === "development" ? "ahmed_5g@yahoo.com" : email,
        subject: "Reset password code",
        html: htmlContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        return ApiResponseClass.successResponse(null);
      } catch (error: unknown) {
        return ApiResponseClass.failureResponse({
          codeMessage: "Can't send email",
        });
      }
    } catch (error) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Something went wrong",
      });
    }
  }

  @Post("reset-password")
  async resetPassword(
    @Body() data: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    try {
      //validate data
      const validationErrors = await validate(data);
      if (validationErrors.length > 0) {
        return ApiResponseClass.failureResponse({
          codeMessage: "Validation failed",
        });
      }

      const user = await this.usersService.resetPassword(data);

      if (user) {
        return ApiResponseClass.successResponse(null);
      } else {
        return ApiResponseClass.failureResponse({
          codeMessage: "User not found",
        });
      }
    } catch (error) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Something went wrong",
      });
    }
  }

  @Post("update-user-data")
  async updateUser(
    @UserD() user: UserTokenPayload,
  ): Promise<ApiResponse<null>> {
    if (!user) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Unauthorized",
      });
    }
    return ApiResponseClass.successResponse(null);
  }
}
