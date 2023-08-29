import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Headers,
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
import {
  ApiResponseClass,
  hashPassword,
} from "../../src/utils/heloerfunctions";
import { MeUserResponse } from "./dto/user.dto";
import { plainToClass } from "class-transformer";
import { UserD } from "./decorators/user.decorator";
import { UserTokenPayload } from "src/types";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post("register")
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    return this.usersService.create(createUserDto);
  }

  @Post("login")
  async login(
    @Body("email") email: User["email"],
    @Body("password") password: User["password"],
  ): Promise<ApiResponse<RequestLoginSuccessObject>> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
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
  async requestRestPassword(
    @Body("email") email: User["email"],
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

    // Create the HTML template
    const htmlContent = `
  <html>
    <body>
      <h1>Reset Password Code</h1>
      <p>Your reset password code is: <strong>${token}</strong></p>
    </body>
  </html>
`;

    if (token) {
      const mailOptions = {
        from: {
          address: process.env.MAIL_FROM_ADDRESS,
          name: process.env.MAIL_FROM_NAME,
        },
        to:
          process.env.NODE_ENV === "development" ? "ahmed_5g@yahoo.com" : email,
        subject: "Reset password code ",
        html: htmlContent,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      transporter.sendMail(mailOptions, (error: { message: any }) => {
        if (error) {
          console.log("Error occurred:", error.message);
          return ApiResponseClass.failureResponse({
            codeMessage: "cant send email",
          });
          // return new ApiException("cant send email", "0").asApiResponse();
        } else {
          console.log("Email sent successfully!");
          return {
            status: true,
          };
        }
      });
    }
    return ApiResponseClass.failureResponse({ codeMessage: "Unknown error" });
    // return new ApiException("Unknown error", "0").asApiResponse();
  }

  @Post("reset-password")
  async resetPassword(
    @Body() data: ResetPasswordRequireData,
  ): Promise<ApiResponse<null>> {
    const user = await this.usersService.resetPassword(data);

    const isPasswordMatch =
      user && user.password === hashPassword(data.newPassword);

    if (isPasswordMatch) {
      return ApiResponseClass.successResponse(null);
      // return new ApiResponseClass(true, 200, null).asApiResponse();
    }
    return ApiResponseClass.failureResponse({ codeMessage: "Unknown error" });
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
    console.log("users.controller.ts -> UsersController -> ", user.id);
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
