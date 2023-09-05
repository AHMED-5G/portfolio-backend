import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { API_PATH } from "../shared-data/constants/apiUrls";
import { customValidationPipe } from "./utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger
  const config = new DocumentBuilder()
    .setTitle("Portfolio API")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "JWT",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(API_PATH, app, document);

  //validation pipe
  app.useGlobalPipes(customValidationPipe);

  await app.listen(3000);
}
bootstrap();
