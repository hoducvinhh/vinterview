"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const allowedOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const swaggerUser = process.env.SWAGGER_USER || 'admin';
    const swaggerPass = process.env.SWAGGER_PASS || 'vinterview_admin';
    app.use(['/api/docs', '/api/docs-json'], (req, res, next) => {
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
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Vinterview API')
        .setDescription('AI Developer Interview Platform REST API documentation')
        .setVersion('1.0')
        .addTag('questions', 'Question management, filtering, and search endpoints')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 4001;
    await app.listen(port);
    console.log(`🚀 NestJS Backend running on http://localhost:${port}/api`);
    console.log(`🔒 Swagger API Docs (Admin Only) protected at http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map