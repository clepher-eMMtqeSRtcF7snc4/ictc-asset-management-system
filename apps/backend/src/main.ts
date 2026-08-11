import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.setGlobalPrefix('api');
  const uploadPath = join(__dirname, '../../uploads');
  app.useStaticAssets(uploadPath, {
    prefix: '/uploads/',
  });
  const port = Number(process.env.PORT ?? '3001');
  await app.listen(port);
  console.log(`Backend listening on port ${port}`);
}
bootstrap();
