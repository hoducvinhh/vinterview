"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const questions_module_1 = require("./questions/questions.module");
const categories_module_1 = require("./categories/categories.module");
const technologies_module_1 = require("./technologies/technologies.module");
const bookmarks_module_1 = require("./bookmarks/bookmarks.module");
const progress_module_1 = require("./progress/progress.module");
const interview_module_1 = require("./interview/interview.module");
const analytics_module_1 = require("./analytics/analytics.module");
const users_module_1 = require("./users/users.module");
const resume_module_1 = require("./resume/resume.module");
const payment_module_1 = require("./payment/payment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            questions_module_1.QuestionsModule,
            categories_module_1.CategoriesModule,
            technologies_module_1.TechnologiesModule,
            bookmarks_module_1.BookmarksModule,
            progress_module_1.ProgressModule,
            interview_module_1.InterviewModule,
            analytics_module_1.AnalyticsModule,
            users_module_1.UsersModule,
            resume_module_1.ResumeModule,
            payment_module_1.PaymentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map