'use client';

import { useState } from 'react';
import { api, Question, StartInterviewPayload, InterviewResultResponse } from '@/lib/api';
import { InterviewSetup } from '@/components/interview/InterviewSetup';
import { InterviewQuestionView } from '@/components/interview/InterviewQuestionView';
import { InterviewResultView } from '@/components/interview/InterviewResultView';

export default function InterviewPage() {
  const [step, setStep] = useState<'setup' | 'active' | 'result'>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [result, setResult] = useState<InterviewResultResponse['data'] | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async (payload: StartInterviewPayload) => {
    try {
      setIsStarting(true);
      const res = await api.startInterview(payload);
      setSessionId(res.data.sessionId);
      setTotalQuestions(res.data.totalQuestions);
      setCurrentIndex(res.data.currentIndex);
      setCurrentQuestion(res.data.question);
      setStep('active');
    } catch (err: any) {
      alert(err.message || 'Failed to start practice interview session.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (userAnswer: string, rating: number) => {
    if (!sessionId || !currentQuestion) {
      throw new Error('No active interview session.');
    }

    const res = await api.submitInterviewAnswer(sessionId, {
      questionId: currentQuestion.id,
      userAnswer,
      rating,
    });

    let nextQuestionData: Question | null = null;
    if (res.data.isComplete) {
      const resultRes = await api.getInterviewResult(sessionId);
      setResult(resultRes.data);
    } else if (res.data.nextQuestion) {
      nextQuestionData = res.data.nextQuestion;
    }

    return {
      expectedAnswer: res.data.expectedAnswer,
      aiEvaluation: res.data.aiEvaluation,
      isComplete: res.data.isComplete,
      nextQuestion: nextQuestionData,
      nextIndex: res.data.currentIndex,
    };
  };


  const handleRetry = () => {
    setStep('setup');
    setSessionId(null);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setTotalQuestions(0);
    setResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {step === 'setup' && (
        <InterviewSetup onStart={handleStartInterview} isStarting={isStarting} />
      )}

      {step === 'active' && currentQuestion && (
        <InterviewQuestionView
          question={currentQuestion}
          totalQuestions={totalQuestions}
          currentIndex={currentIndex}
          onSubmit={handleSubmitAnswer}
          onNextQuestion={(nextQuestion, nextIndex) => {
            if (nextQuestion && typeof nextIndex === 'number') {
              setCurrentQuestion(nextQuestion);
              setCurrentIndex(nextIndex);
            } else {
              setStep('result');
            }
          }}

        />
      )}


      {step === 'result' && result && (
        <InterviewResultView result={result} onRetry={handleRetry} />
      )}
    </div>
  );
}
