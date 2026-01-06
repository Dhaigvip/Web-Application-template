import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,           // strings → numbers
      whitelist: true,           // strip unknown fields
      forbidNonWhitelisted: false
    })
  )

  const port = process.env.API_PORT || 4100
  await app.listen(port, '0.0.0.0')
}
bootstrap()
