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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const questions_service_1 = require("./questions.service");
const query_questions_dto_1 = require("./dto/query-questions.dto");
const create_question_dto_1 = require("./dto/create-question.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let QuestionsController = class QuestionsController {
    questionsService;
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    findAll(query) {
        return this.questionsService.findAll(query);
    }
    findBySlug(slug) {
        return this.questionsService.findBySlug(slug);
    }
    create(createQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }
    update(id, updateQuestionDto) {
        return this.questionsService.update(id, updateQuestionDto);
    }
    remove(id) {
        return this.questionsService.remove(id);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get paginated list of questions',
        description: 'Retrieves questions supporting full-text title search, filtering by category/technology/difficulty, and custom sorting.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Paginated list of questions retrieved successfully.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid query parameters supplied.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_questions_dto_1.QueryQuestionsDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get single question by slug',
        description: 'Retrieves complete question details including category, technology, and answer model using unique URL slug or UUID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Unique question URL slug or UUID ID', example: 'javascript-event-loop-asynchronous-operations' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Question retrieved successfully.',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Question with specified slug not found.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new interview question (Admin Only)',
        description: 'Creates a new question statement, automatically generates a slug if omitted, and links Category, Technology, and optional Answer.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Question created successfully.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation failed on request body DTO.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Referenced Category or Technology ID not found.' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Question with generated/provided slug already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing question (Admin Only)',
        description: 'Updates specific question attributes or nested answer by UUID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question UUID', example: 'c1a30677-18fa-4d26-b2d0-6b89fd434c6d' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Question updated successfully.',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Question, Category, or Technology with specified ID not found.' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'New slug collides with an existing question.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a question by ID (Admin Only)',
        description: 'Removes question and automatically cascades deletion of its canonical answer model.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question UUID', example: 'c1a30677-18fa-4d26-b2d0-6b89fd434c6d' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Question deleted successfully.',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Question with specified ID not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "remove", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map