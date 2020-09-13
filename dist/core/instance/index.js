define(["require", "exports", "./init"], function (require, exports, init_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function PdCesium(id, option) {
        this._init(id, option);
    }
    init_1.initMixin(PdCesium);
    exports.default = PdCesium;
});
