define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transformCart3Position = void 0;
    function transformCart3Position(position) {
        let [lon, lat, h] = position;
        return cesium_1.Cartesian3.fromDegrees(lon, lat, h);
    }
    exports.transformCart3Position = transformCart3Position;
});
