import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix (/api)
  app.setGlobalPrefix('api');

  // Enable CORS for Next.js frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation pipe for automatic DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unexpected properties from DTOs
      forbidNonWhitelisted: true, // Throw error if extra properties are passed
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Protect Swagger API Docs (/api/docs) with HTTP Basic Authentication (Admin Only)
  const swaggerUser = process.env.SWAGGER_USER || 'admin';
  const swaggerPass = process.env.SWAGGER_PASS || 'vinterview_admin';

  app.use(['/api/docs', '/api/docs-json'], (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const auth = Buffer.from(authHeader.split(' ')[1] || '', 'base64').toString().split(':');
      const user = auth[0];
      const pass = auth[1];
      if (user === swaggerUser && pass === swaggerPass) {
        return next();
      }
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="Vinterview Admin Swagger Docs"');
    return res.status(401).send('Authentication required to access Swagger API Documentation.');
  });

  // Configure Swagger / OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vinterview API')
    .setDescription('AI Developer Interview Platform REST API documentation')
    .setVersion('1.0')
    .addTag('questions', 'Question management, filtering, and search endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4001;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running on http://localhost:${port}/api`);
  console.log(`🔒 Swagger API Docs (Admin Only) protected at http://localhost:${port}/api/docs`);
}
bootstrap();
