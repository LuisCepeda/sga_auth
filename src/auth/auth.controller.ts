// auth.controller.ts
import { Body, Controller, HttpStatus, Post, Get, Res, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto, RegisterDTO } from './dto/auth.dto';
import { Response, Request, response } from 'express';
import messages from 'src/constants/messages';
import { AuthGuard } from './guards/auth.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Body() authPayload: AuthPayloadDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const jwt = await this.authService.validateUser(authPayload);
      if (!jwt) {
        response.status(HttpStatus.UNAUTHORIZED).json({
          Status: {
            message: messages.ERROR_BAD_CREDENTIALS,
            code: HttpStatus.UNAUTHORIZED,
          },
          Data: '',
        });
        return;
      }

      response.cookie('jwt', jwt, { httpOnly: true });
      response.status(HttpStatus.OK).json({
        Status: {
          message: messages.SUCCESSFULLY_LOGIN,
          code: HttpStatus.OK,
        },
        Data: jwt,
      });
      return
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: messages.ERROR_BAD_CREDENTIALS,
        error: error.message,
      });
      return
    }
  }

  @Post('register')
  async register(
    @Body() userData: RegisterDTO,
    @Res() response: Response
  ) {
    try {
      const user = await this.authService.createUser(userData);
      if (user.Status === 'error') throw new Error(user.Data.message);

      response.status(HttpStatus.OK).json({
        Status: {
          message: messages.SUCCESSFULLY_REGISTER,
          code: HttpStatus.OK,
        },
        Data: user,
      });
      return
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        Message: messages.ERROR_BAD_CREDENTIALS,
        Error: error.message,
      });
      return
    }
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt')
    response.status(HttpStatus.OK).json({
      Status: {
        message: messages.SUCCESSFULLY_LOGOUT,
        code: HttpStatus.OK,
      },
      Data: [],
    });
    return
  }

  @Get('user')
  async user(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const cookie = request.cookies['jwt']
    try {

      const user = await this.authService.validateCookie(cookie)

      if (user.name === 'JsonWebTokenError') throw new Error(user.message)

      response.status(HttpStatus.OK).json({
        Status: {
          message: messages.SUCCESSFULLY_USER_VERIFIED,
          code: HttpStatus.OK,
        },
        Data: [user],
      });
      return
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        Status: {
          message: messages.ERROR_BAD_CREDENTIALS,
          code: HttpStatus.UNAUTHORIZED,
        },
        Data: [],
        Error: error.message
      });
      return
    }

  }


}
