import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1')
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  const PORT = process.env.PORT || 3002

  await app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
bootstrap();
