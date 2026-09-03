import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AiEvaluatorService, AiEvaluationResult } from './ai-evaluator.service';
import { randomUUID } from 'crypto';

interface SessionAnswer {
  questionId: string;
  userAnswer: string;
  rating: number;
  aiEvaluation?: AiEvaluationResult;
}

interface InterviewSessionState {
  id: string;
  userId?: string;
  questions: any[];
  currentIndex: number;
  answers: Record<string, SessionAnswer>;
  startTime: Date;
  endTime?: Date;
}

@Injectable()
export class InterviewService {
  private sessions = new Map<string, InterviewSessionState>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiEvaluator: AiEvaluatorService,
  ) {}

  async startInterview(dto: StartInterviewDto, userId?: string) {
    const where: any = {};

    if (dto.difficulty) {
      where.difficulty = dto.difficulty;
    }

    if (dto.category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.category);
      where.category = isUuid ? { id: dto.category } : { slug: dto.category };
    }

    if (dto.technology) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.technology);
      where.technology = isUuid ? { id: dto.technology } : { slug: dto.technology };
    }

    const candidateQuestions = await this.prisma.question.findMany({
      where,
      include: {
        category: true,
        technology: true,
        answer: true,
      },
    });

    if (candidateQuestions.length === 0) {
      throw new NotFoundException('No questions found matching your interview filters.');
    }

    // Shuffle candidate questions
    const shuffled = candidateQuestions.sort(() => 0.5 - Math.random());
    const count = Math.min(dto.questionCount || 5, shuffled.length);
    const selectedQuestions = shuffled.slice(0, count);

    const sessionId = randomUUID();
    const sessionState: InterviewSessionState = {
      id: sessionId,
      userId,
      questions: selectedQuestions,
      currentIndex: 0,
      answers: {},
      startTime: new Date(),
    };

    this.sessions.set(sessionId, sessionState);

    const currentQuestion = selectedQuestions[0];

    return {
      success: true,
      data: {
        sessionId,
        totalQuestions: selectedQuestions.length,
        currentIndex: 0,
        question: {
          id: currentQuestion.id,
          title: currentQuestion.title,
          slug: currentQuestion.slug,
          content: currentQuestion.content,
          difficulty: currentQuestion.difficulty,
          category: currentQuestion.category,
          technology: currentQuestion.technology,
        },
      },
    };
  }

  async submitAnswer(sessionId: string, dto: SubmitAnswerDto) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Interview session not found or expired.');
    }

    const currentQuestion = session.questions[session.currentIndex];
    if (!currentQuestion) {
      throw new BadRequestException('Interview session has already completed.');
    }

    // Evaluate answer via Gemini AI
    const aiEvaluation = await this.aiEvaluator.evaluateAnswer({
      questionTitle: currentQuestion.title,
      questionContent: currentQuestion.content,
      canonicalAnswer: currentQuestion.answer?.content,
      userAnswer: dto.userAnswer,
    });

    const finalRating = aiEvaluation.rating || dto.rating || 3;

    // Save answer, rating, and AI evaluation
    session.answers[dto.questionId] = {
      questionId: dto.questionId,
      userAnswer: dto.userAnswer,
      rating: finalRating,
      aiEvaluation,
    };

    session.currentIndex += 1;
    const isComplete = session.currentIndex >= session.questions.length;

    if (isComplete) {
      session.endTime = new Date();
    }

    const nextQuestion = !isComplete ? session.questions[session.currentIndex] : null;

    return {
      success: true,
      data: {
        expectedAnswer: currentQuestion.answer,
        aiEvaluation,
        isComplete,
        currentIndex: session.currentIndex,
        totalQuestions: session.questions.length,
        nextQuestion: nextQuestion
          ? {
              id: nextQuestion.id,
              title: nextQuestion.title,
              slug: nextQuestion.slug,
              content: nextQuestion.content,
              difficulty: nextQuestion.difficulty,
              category: nextQuestion.category,
              technology: nextQuestion.technology,
            }
          : null,
      },
    };
  }

  async getResult(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Interview session not found or expired.');
    }

    const totalQuestions = session.questions.length;
    let totalScore = 0;
    const maxScore = totalQuestions * 5;

    const questionsSummary = session.questions.map((q) => {
      const ans = session.answers[q.id] || { userAnswer: '', rating: 0 };
      totalScore += ans.rating;

      return {
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        category: q.category.name,
        technology: q.technology.name,
        userAnswer: ans.userAnswer,
        rating: ans.rating,
        expectedAnswer: q.answer,
        aiEvaluation: ans.aiEvaluation,
      };
    });

    const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    let readinessGrade = 'Needs Review';
    if (scorePercentage >= 80) readinessGrade = 'Senior Ready';
    else if (scorePercentage >= 60) readinessGrade = 'Mid-Level Ready';

    return {
      success: true,
      data: {
        sessionId: session.id,
        totalQuestions,
        totalScore,
        maxScore,
        scorePercentage,
        readinessGrade,
        questionsSummary,
      },
    };
  }
}

