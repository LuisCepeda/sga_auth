import { Body, Controller, HttpStatus, Post, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { Response } from 'express';
import messages from 'src/constants/messages';
import { AuthGuard } from './guards/auth.guard';
import { LocalGuard } from './guards/local.guard';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto, @Res() response: Response) {
    try {
      const user = await this.authService.validateUser(authPayload)
      if (!user) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          'Status': {
            message: messages.ERROR_BAD_CREDENTIALS,
            code: HttpStatus.UNAUTHORIZED
          },
          Data: ''
        })
      }
      return response.status(HttpStatus.OK).json({
        'Status': {
          message: messages.SUCCESSFULLY_LOGIN,
          code: HttpStatus.OK
        },
        Data: user
      })
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: messages.ERROR_BAD_CREDENTIALS,
        error: error.message
      })
    }
  }

  @UseGuards(AuthGuard)
  @Get('prueba')
  getPrueba() {
    return "hola"
  }
}
