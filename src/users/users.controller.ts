import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  BadRequestException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body('email') email: User['email'],
    @Body('password') password: User['password'],
  ) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });

    return { jwt };
  }

  @Get('me')
  async user(@Headers('authorization') authorization: string) {
    const jwt = authorization?.split(' ')[1];
    const data = await this.jwtService.verifyAsync(jwt);

    if (!data) throw new UnauthorizedException();

    const user = await this.usersService.findOne(data['id']);
    if (!user) throw new UnauthorizedException();

    delete user.password;
    return user;
  }

  //reset password
  @Post('request-reset-password')
  async resetPassword(@Body('email') email: User['email']) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
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
          process.env.NODE_ENV === 'development' ? 'ahmed_5g@yahoo.com' : email,
        subject: 'Reset password code ',
        html: htmlContent,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      transporter.sendMail(mailOptions, (error: { message: any }) => {
        if (error) {
          console.log('Error occurred:', error.message);
        } else {
          console.log('Email sent successfully!');
        }
      });
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
