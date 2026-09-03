"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const interview_service_1 = require("./interview.service");
const start_interview_dto_1 = require("./dto/start-interview.dto");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
let InterviewController = class InterviewController {
    interviewService;
    constructor(interviewService) {
        this.interviewService = interviewService;
    }
    startInterview(startDto) {
        return this.interviewService.startInterview(startDto);
    }
    submitAnswer(sessionId, submitDto) {
        return this.interviewService.submitAnswer(sessionId, submitDto);
    }
    getResult(sessionId) {
        return this.interviewService.getResult(sessionId);
    }
};
exports.InterviewController = InterviewController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new practice interview session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interview session created with randomized questions.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No questions found matching specified filters.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_interview_dto_1.StartInterviewDto]),
    __metadata("design:returntype", void 0)
], InterviewController.prototype, "startInterview", null);
__decorate([
    (0, common_1.Post)(':id/answer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit question answer & self-rating for interview session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Answer recorded and expected solution returned.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Interview session not found or expired.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], InterviewController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Get)(':id/result'),
    (0, swagger_1.ApiOperation)({ summary: 'Get interview session final result & score breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interview score breakdown and readiness grade.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Interview session not found or expired.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InterviewController.prototype, "getResult", null);
exports.InterviewController = InterviewController = __decorate([
    (0, swagger_1.ApiTags)('interview'),
    (0, common_1.Controller)('interview'),
    __metadata("design:paramtypes", [interview_service_1.InterviewService])
], InterviewController);
//# sourceMappingURL=interview.controller.js.map