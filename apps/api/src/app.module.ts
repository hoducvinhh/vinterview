import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ProgressModule } from './progress/progress.module';
import { InterviewModule } from './interview/interview.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';
import { ResumeModule } from './resume/resume.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    QuestionsModule,
    CategoriesModule,
    TechnologiesModule,
    BookmarksModule,
    ProgressModule,
    InterviewModule,
    AnalyticsModule,
    UsersModule,
    ResumeModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

