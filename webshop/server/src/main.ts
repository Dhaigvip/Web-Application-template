import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.API_PORT || 4100
  await app.listen(port, '0.0.0.0')
}
bootstrap()
