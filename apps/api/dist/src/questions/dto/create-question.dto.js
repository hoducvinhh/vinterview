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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionDto = exports.CreateAnswerDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateAnswerDto {
    content;
    codeSnippet;
    explanation;
}
exports.CreateAnswerDto = CreateAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed Markdown solution content for the question', example: 'The Event Loop executes tasks from the Call Stack...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnswerDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional code snippet demonstrating the answer', example: 'setTimeout(() => console.log("Done"), 0);' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnswerDto.prototype, "codeSnippet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional deep-dive architectural explanation', example: 'Microtasks have higher priority than Macrotasks in V8 engine.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnswerDto.prototype, "explanation", void 0);
class CreateQuestionDto {
    title;
    slug;
    content;
    difficulty;
    categoryId;
    technologyId;
    answer;
}
exports.CreateQuestionDto = CreateQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The question title statement', example: 'What is the Event Loop in JavaScript?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom URL slug (auto-generated from title if omitted)', example: 'what-is-event-loop-js' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed Markdown question body text', example: 'Explain how the Call Stack and Event Loop interact with Promises.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question difficulty level', enum: client_1.Difficulty, example: client_1.Difficulty.MEDIUM }),
    (0, class_validator_1.IsEnum)(client_1.Difficulty),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category UUID ID', example: '09d96675-16a1-4c65-83a9-b0bc4f3d41fb' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Technology UUID ID', example: 'aaa2835a-795d-41dd-ab34-5054b5ce7523' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "technologyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional initial answer model payload', type: CreateAnswerDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateAnswerDto),
    __metadata("design:type", CreateAnswerDto)
], CreateQuestionDto.prototype, "answer", void 0);
//# sourceMappingURL=create-question.dto.js.map