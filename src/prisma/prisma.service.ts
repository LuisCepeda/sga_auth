import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private static instance: PrismaClient

    async onModuleInit() {
        console.log('Conexión creada')
        await this.$connect()
    }
}