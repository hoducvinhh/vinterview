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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const update_progress_dto_1 = require("./dto/update-progress.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    updateProgress(questionId, dto, userId) {
        return this.progressService.updateProgress(userId, questionId, dto.status);
    }
    getUserProgress(userId) {
        return this.progressService.getUserProgress(userId);
    }
    async getUserProgressMap(userId) {
        const map = await this.progressService.getUserProgressMap(userId);
        return { success: true, data: map };
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)('questions/:id/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update learning progress status for a question' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress updated successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Question not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_progress_dto_1.UpdateProgressDto, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Get)('users/me/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user learning progress statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User learning stats and recently completed questions.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('users/me/progress/map'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user question progress dictionary map' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dictionary mapping questionId -> ProgressStatus.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getUserProgressMap", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map