import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import { ApiResponse } from "shared-data/types";
import {
  MeSuccessObject,
  RequestLoginSuccessObject,
  ResetPasswordRequireData,
} from "shared-data/constants/requestsData";
import { MeUserResponse } from "./dto/user.dto";
import { plainToClass } from "class-transformer";
import { UserD } from "./decorators/user.decorator";
import { UserTokenPayload } from "src/types";
import { AuthGuard } from "../../src/guards/auth.guard";
import { ApiResponseClass, hashPassword } from "../utils/functions";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post("register")
  async create(
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
      const jwt = await this.jwtService.signAsync({ id: user.id });
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
  async user(
    @Headers("authorization") authorization: string,
    // @Res() res: Response,
  ): Promise<ApiResponse<MeSuccessObject>> {
    const jwt = authorization?.split(" ")[1];
    const data = await this.jwtService.verifyAsync(jwt);

    if (!data) {
      return ApiResponseClass.failureResponse({
        codeMessage: "Invalid token",
      });
    }

    const user: User = await this.usersService.findOne(data["id"]);
    if (!user) {
      return ApiResponseClass.failureResponse({
        codeMessage: "User not found",
      });
    }

    const transformedUser: MeUserResponse = plainToClass(MeUserResponse, user);

    return ApiResponseClass.successResponse(transformedUser);
  }

  //reset password
  @Post("request-reset-password")
  async requestResetPassword(
    @Body("email") email: string,
  ): Promise<ApiResponse<null>> {
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
    });

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
      to: process.env.NODE_ENV === "development" ? "ahmed_5g@yahoo.com" : email,
      subject: "Reset password code ",
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
  }

  @Post("reset-password")
  async resetPassword(
    @Body() data: ResetPasswordRequireData,
  ): Promise<ApiResponse<null>> {
    const user = await this.usersService.resetPassword(data);

    if (user) {
      return ApiResponseClass.successResponse(null);
    } else {
      return ApiResponseClass.failureResponse({ codeMessage: "Unknown error" });
    }
  }

  @Post("update-user-data")
  async updateUser(
    @UserD() user: UserTokenPayload,
  ): Promise<ApiResponse<null>> {
    if (!user) {
      return ApiResponseClass.failureResponse({
        codeMessage: "User not found",
      });
    }
    return ApiResponseClass.successResponse(null);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
