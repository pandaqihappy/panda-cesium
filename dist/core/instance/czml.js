define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCzmlDataSource = void 0;
    function createCzmlDataSource(name) {
        const cm = this;
        const entities = cm.$viewer.entities;
        let dataSource = new cesium_1.CzmlDataSource(name);
        entities.add(dataSource);
    }
    exports.createCzmlDataSource = createCzmlDataSource;
});
