const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  questionCount?: number;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  questionCount?: number;
}

export interface Answer {
  id: string;
  content: string;
  codeSnippet?: string;
  explanation?: string;
}

export interface Question {
  id: string;
  title: string;
  slug: string;
  content: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  categoryId: string;
  technologyId: string;
  category: Category;
  technology: Technology;
  answer?: Answer;
  createdAt: string;
  updatedAt: string;
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ProgressStats {
  totalQuestions: number;
  completedQuestions: number;
  inProgressQuestions: number;
  completionPercentage: number;
}

export interface UserProgressData {
  stats: ProgressStats;
  recentlyCompleted: Question[];
}

export interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  uniqueVisitorsToday: number;
  totalUsers: number;
  topPages: Array<{
    path: string;
    views: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

export interface QuestionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
  meta: QuestionsMeta;
}

export interface QuestionDetailResponse {
  success: boolean;
  data: Question;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface TechnologiesResponse {
  success: boolean;
  data: Technology[];
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface QueryQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  technology?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateQuestionPayload {
  title: string;
  slug?: string;
  content: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  categoryId: string;
  technologyId: string;
  answer?: {
    content: string;
    codeSnippet?: string;
    explanation?: string;
  };
}

export interface UpdateQuestionPayload extends Partial<CreateQuestionPayload> { }

export interface StartInterviewPayload {
  technology?: string;
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  questionCount?: number;
}

export interface StartInterviewResponse {
  success: boolean;
  data: {
    sessionId: string;
    totalQuestions: number;
    currentIndex: number;
    question: Question;
  };
}

export interface CvAnalysisResponse {
  success: boolean;
  data: {
    candidateName?: string;
    title?: string;
    detectedSkills: string[];
    experienceLevel: string;
    summary: string;
    matchedTechnologies: Array<{ id: string; name: string; slug: string }>;
    matchingQuestionCount: number;
    recommendedQuestionIds: string[];
  };
}

export interface AiEvaluationResult {

  rating: number;
  scorePercent: number;
  strengths: string[];
  improvements: string[];
  aiFeedback: string;
  suggestedAnswer: string;
}

export interface SubmitAnswerPayload {
  questionId: string;
  userAnswer: string;
  rating: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  data: {
    expectedAnswer: Answer;
    aiEvaluation?: AiEvaluationResult;
    isComplete: boolean;
    currentIndex: number;
    totalQuestions: number;
    nextQuestion?: Question | null;
  };
}

export interface QuestionSummary {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  technology: string;
  userAnswer: string;
  rating: number;
  expectedAnswer?: Answer;
  aiEvaluation?: AiEvaluationResult;
}

export interface InterviewResultResponse {
  success: boolean;
  data: {
    sessionId: string;
    totalQuestions: number;
    totalScore: number;
    maxScore: number;
    scorePercentage: number;
    readinessGrade: string;
    questionsSummary: QuestionSummary[];
  };
}


class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vinterview_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('vinterview_auth_token', token);
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        localStorage.removeItem('vinterview_auth_token');
        document.cookie = `auth_token=; path=/; max-age=0`;
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('vinterview_auth_token');
    }
    return this.token;
  }

  private getAuthHeaders(headers: HeadersInit = {}): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };
  }

  async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(headers),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, body: any = {}, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(headers),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(headers),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }

    return response.json();
  }

  // Categories CRUD
  async getCategories(): Promise<CategoriesResponse> {
    return this.get<CategoriesResponse>('/categories');
  }

  async createCategory(payload: { name: string; slug?: string; description?: string }): Promise<{ success: boolean; data: Category }> {
    return this.post<{ success: boolean; data: Category }>('/categories', payload);
  }

  async updateCategory(id: string, payload: { name?: string; slug?: string; description?: string }): Promise<{ success: boolean; data: Category }> {
    return this.patch<{ success: boolean; data: Category }>(`/categories/${id}`, payload);
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/categories/${id}`);
  }

  // Technologies CRUD
  async getTechnologies(): Promise<TechnologiesResponse> {
    return this.get<TechnologiesResponse>('/technologies');
  }

  async createTechnology(payload: { name: string; slug?: string; icon?: string }): Promise<{ success: boolean; data: Technology }> {
    return this.post<{ success: boolean; data: Technology }>('/technologies', payload);
  }

  async updateTechnology(id: string, payload: { name?: string; slug?: string; icon?: string }): Promise<{ success: boolean; data: Technology }> {
    return this.patch<{ success: boolean; data: Technology }>(`/technologies/${id}`, payload);
  }

  async deleteTechnology(id: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/technologies/${id}`);
  }

  // Users CRUD
  async getUsers(search?: string): Promise<UsersResponse> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.get<UsersResponse>(`/users${query}`);
  }

  async createUser(payload: { email: string; password: string; name?: string; role?: User['role'] }): Promise<{ success: boolean; data: User }> {
    return this.post<{ success: boolean; data: User }>('/users', payload);
  }

  async updateUser(id: string, payload: { email?: string; password?: string; name?: string; role?: User['role'] }): Promise<{ success: boolean; data: User }> {
    return this.patch<{ success: boolean; data: User }>(`/users/${id}`, payload);
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/users/${id}`);
  }

  // Interview Methods
  async startInterview(payload: StartInterviewPayload): Promise<StartInterviewResponse> {
    return this.post<StartInterviewResponse>('/interview/start', payload);
  }

  async submitInterviewAnswer(sessionId: string, payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> {
    return this.post<SubmitAnswerResponse>(`/interview/${sessionId}/answer`, payload);
  }

  async getInterviewResult(sessionId: string): Promise<InterviewResultResponse> {
    return this.get<InterviewResultResponse>(`/interview/${sessionId}/result`);
  }

  // Auth
  async register(payload: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/register', payload);
  }

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/login', payload);
  }

  async getMe(): Promise<{ success: boolean; data: User }> {
    return this.get<{ success: boolean; data: User }>('/auth/me');
  }

  // Progress
  async updateQuestionProgress(questionId: string, status: ProgressStatus): Promise<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(`/questions/${questionId}/progress`, { status });
  }

  async getUserProgressStats(): Promise<{ success: boolean; data: UserProgressData }> {
    return this.get<{ success: boolean; data: UserProgressData }>('/users/me/progress');
  }

  // Bookmarks
  async bookmarkQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(`/questions/${questionId}/bookmark`);
  }

  async unbookmarkQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/questions/${questionId}/bookmark`);
  }

  async getUserBookmarks(): Promise<{ success: boolean; data: Question[] }> {
    return this.get<{ success: boolean; data: Question[] }>('/users/me/bookmarks');
  }

  // Health
  async checkHealth(): Promise<HealthResponse> {
    return this.get<HealthResponse>('/health');
  }

  // Analytics
  async trackPageView(path: string, visitorId?: string): Promise<{ id: string }> {
    return this.post<{ id: string }>('/analytics/track', { path, visitorId });
  }

  async getAnalyticsStats(): Promise<AnalyticsStats> {
    return this.get<AnalyticsStats>('/analytics/stats');
  }

  // Questions
  async getQuestions(params: QueryQuestionsParams = {}): Promise<QuestionsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.technology) query.append('technology', params.technology);
    if (params.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);

    const queryString = query.toString();
    return this.get<QuestionsResponse>(queryString ? `/questions?${queryString}` : '/questions');
  }

  async getQuestionBySlug(slug: string): Promise<QuestionDetailResponse> {
    return this.get<QuestionDetailResponse>(`/questions/${slug}`);
  }

  async createQuestion(payload: CreateQuestionPayload): Promise<QuestionDetailResponse> {
    return this.post<QuestionDetailResponse>('/questions', payload);
  }

  async updateQuestion(id: string, payload: UpdateQuestionPayload): Promise<QuestionDetailResponse> {
    return this.patch<QuestionDetailResponse>(`/questions/${id}`, payload);
  }

  async analyzeResume(file: File): Promise<CvAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getToken();
    const response = await fetch(`${this.baseUrl}/resume/analyze`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Phân tích CV thất bại với trạng thái ${response.status}`);
    }

    return response.json();
  }

  async deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {

    return this.delete<{ success: boolean; message: string }>(`/questions/${id}`);
  }
}

export const api = new ApiClient(API_BASE_URL);

