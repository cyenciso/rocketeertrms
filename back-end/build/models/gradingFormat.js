"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradingFormat = void 0;
var GradingFormat = /** @class */ (function () {
    function GradingFormat(gradingType, presentationRequired, cutOff) {
        this.gradingType = '';
        this.presentationRequired = false;
        this.cutOff = '';
        this.gradingType = gradingType;
        this.presentationRequired = presentationRequired;
        this.cutOff = cutOff;
    }
    return GradingFormat;
}());
exports.GradingFormat = GradingFormat;
