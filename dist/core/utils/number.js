define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transPositionValue = void 0;
    // 转换为number类型
    exports.transPositionValue = (value) => {
        if (typeof value === 'string')
            value = Number(value);
        return value;
    };
});
