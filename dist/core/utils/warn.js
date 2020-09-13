define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.warn = void 0;
    function warn(msg) {
        console.error(`[cesium-tool]:${msg}`);
    }
    exports.warn = warn;
});
