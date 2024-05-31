import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private jwtService: JwtService) { }

    async validateUser(authPayloadDto: AuthPayloadDto) {
        const { email, password } = authPayloadDto

        const userFound = await this.prisma.user.findUnique({ where: { email } })

        if (!userFound) return null

        const { password: userPassword, id: userId, firstname: userFirstname, lastname: userLastname, username: userUsername, email: userEmail, ...userOtherData } = userFound

        const isMatch = await bcrypt.compare(password, userPassword)
        if (!isMatch) return null
        const payload = { sub: userId, userFirstname, userLastname, userUsername, userEmail }
        return await this.jwtService.signAsync(payload)
    }
}
