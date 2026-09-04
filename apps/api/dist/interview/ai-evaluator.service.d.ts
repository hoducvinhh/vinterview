export interface AiEvaluationResult {
    rating: number;
    scorePercent: number;
    strengths: string[];
    improvements: string[];
    aiFeedback: string;
    suggestedAnswer: string;
}
export declare class AiEvaluatorService {
    private readonly logger;
    private getAiClient;
    evaluateAnswer(params: {
        questionTitle: string;
        questionContent: string;
        canonicalAnswer?: string;
        userAnswer: string;
    }): Promise<AiEvaluationResult>;
    private getFallbackEvaluation;
}
