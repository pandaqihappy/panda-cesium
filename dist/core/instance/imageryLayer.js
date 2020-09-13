define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addLayer = exports.initImageryLayer = void 0;
    function initImageryLayer(cm) {
        const option = cm.$option;
        const maps = option.maps;
        cm.addLayer = addLayer(cm);
        cm.addLayer(maps); // 初始化地图图层
    }
    exports.initImageryLayer = initImageryLayer;
    // 添加多个图层
    function addLayer(cm) {
        return (maps) => {
            const viewer = cm.$viewer;
            maps
                .reverse()
                .map(name => {
                _addLayer(viewer, { name, imageryProvider: new NewImageryProvider(name) });
            });
        };
    }
    exports.addLayer = addLayer;
    function _addLayer(viewer, opt) {
        let { name, imageryProvider, alpha, show } = opt;
        let layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
        if (alpha)
            layer.alpha = cesium_1.defaultValue(alpha, 1);
        if (show)
            layer.show = cesium_1.defaultValue(show, true);
        layer.name = name;
    }
    // 通过地图名称生成 imageryProvider
    class NewImageryProvider {
        constructor(name) {
            switch (name) {
                case 'OpenStreetMap':
                    return new cesium_1.OpenStreetMapImageryProvider({
                        url: 'https://a.tile.openstreetmap.org/'
                    });
                case 'TianDiTu':
                    return new cesium_1.WebMapTileServiceImageryProvider({
                        url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=c24d9716c14a72ab120075db91686c17',
                        layer: 'img',
                        style: 'default',
                        tileMatrixSetID: 'w',
                        format: 'tiles',
                        maximumLevel: 18
                    });
                case 'TianDiTuBZ':
                    return new cesium_1.WebMapTileServiceImageryProvider({
                        url: 'http://t0.tianditu.gov.cn/cia_w/wmts?tk=c24d9716c14a72ab120075db91686c17',
                        layer: 'cia',
                        style: 'default',
                        tileMatrixSetID: 'w',
                        format: 'tiles',
                        maximumLevel: 18
                    });
                case 'offLineMap':
                    return new cesium_1.UrlTemplateImageryProvider({
                        url: 'http://127.0.0.1:8686/satellite/{z}/{x}/{y}.jpg',
                        // fileExtension: 'jpg',
                        minimumLevel: 0,
                        maximumLevel: 10,
                    });
                case 'Overlay':
                    return new cesium_1.UrlTemplateImageryProvider({
                        url: 'http://127.0.0.1:8686/overlay/{z}/{x}/{y}.png',
                        // fileExtension: 'png',
                        minimumLevel: 0,
                        maximumLevel: 10,
                    });
            }
        }
    }
});
