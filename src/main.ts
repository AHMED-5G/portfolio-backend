import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
async function bootstrap() {
  // process.env.NODE_ENV = "production";
  const app = await NestFactory.create(AppModule);

  //swagger
  const config = new DocumentBuilder().setTitle("Portfolio API").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
