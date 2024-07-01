import { Injectable } from '@nestjs/common';
import { AuthPayloadDto, RegisterDTO } from './dto/auth.dto';

import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { checkIfUserIsRegistered, makeHttpRequest } from 'src/lib/utils';




@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async validateUser(authPayloadDto: AuthPayloadDto) {
        const { email, password } = authPayloadDto

        const userFound = await checkIfUserIsRegistered(email)

        if (!userFound) return null

        const userData = userFound.Data[0]
        const { password: userPassword, id: userId, firstname: userFirstname, lastname: userLastname, username: userUsername, email: userEmail, ...userOtherData } = userData

        const isMatch = await bcrypt.compare(password, userPassword)

        if (!isMatch) return null

        const payload = { sub: userId, userFirstname, userLastname, userUsername, userEmail }

        const jwt = await this.jwtService.signAsync(payload)

        return jwt
    }

    async createUser(userData: RegisterDTO) {
        try {
            const isUserRegistered = await checkIfUserIsRegistered(userData.email)
            if (isUserRegistered) throw new Error('User already exists.')

            const { password, confirmPassword, ...otherUserData } = userData

            if (password !== confirmPassword) throw new Error("Passwords don't match")

            const hashedPassword = await bcrypt.hash(password, 12)


            const user = await makeHttpRequest(process.env.USERS_DOMAIN, 'POST', { ...otherUserData, password: hashedPassword })

            return { Status: "ok", Data: user }
        } catch (error) {
            console.error(error)
            return { Status: "error", Data: { message: error.message } }
        }
    }

    async validateCookie(jwtCookie: string) {
        console.log('jwtCookie', jwtCookie)
        try {
            const data = await this.jwtService.verifyAsync(jwtCookie)
            return data
        } catch (error) {
            console.error(error)
            return error
        }

    }
}
