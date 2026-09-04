"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTechnologyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_technology_dto_1 = require("./create-technology.dto");
class UpdateTechnologyDto extends (0, swagger_1.PartialType)(create_technology_dto_1.CreateTechnologyDto) {
}
exports.UpdateTechnologyDto = UpdateTechnologyDto;
//# sourceMappingURL=update-technology.dto.js.map