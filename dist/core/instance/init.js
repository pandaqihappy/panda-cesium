define(["require", "exports", "cesium-navigation-es6", "cesium", "./imageryLayer", "./sence", "./camera", "../composeApi/entity", "./register", "../layers/index", "../utils/warn"], function (require, exports, cesium_navigation_es6_1, cesium_1, imageryLayer_1, sence_1, camera_1, entity_1, register_1, index_1, warn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initMixin = void 0;
    const terrainProvider = new cesium_1.CesiumTerrainProvider({ url: 'http://127.0.0.1:8686/dem' });
    // buildModuleUrl.setBaseUrl('../Cesium/')
    // 测试option
    const testOpt = {
        clock: {
            startTime: '2020-07-11',
            endTime: '2020-07-12',
            currentTime: '2020-07-11',
        },
        maps: ["offLineMap"]
    };
    function initMixin(PdCesium) {
        PdCesium.prototype._init = function (domId, option) {
            const cm = this;
            cm.$option = option;
            // 测试用option
            // cm.$option = testOpt
            if (!domId) {
                return;
            }
            initViewer(cm, domId);
            imageryLayer_1.initImageryLayer(cm);
            sence_1.initSence(cm);
            camera_1.initCamera(cm);
            // initClock(cm)
            // initEntity(cm)
            entity_1.initEntityComposeApi(cm);
            register_1.initRegister(cm);
            index_1.initLayers(cm);
        };
    }
    exports.initMixin = initMixin;
    // 初始化viewer
    function initViewer(cm, domId) {
        cm.$dom = document.querySelector(`#${domId}`);
        const option = cm.$option;
        if (option.buildModuleUrl && typeof option.buildModuleUrl === 'string') {
            cesium_1.buildModuleUrl(option.buildModuleUrl);
        }
        else {
            warn_1.warn('has no buildModuleUrl');
            return;
        }
        const viewerOpt = {
            // animation: false, // 是否创建动画小部件
            // timeline: false, // 是否显示时间线控件
            // fullscreenButton: false, // 右下角全屏按钮
            // geocoder: false, // 是否显示地名查找控件
            // terrainProvider : Cesium.createWorldTerrain(),
            geocoder: false,
            navigationHelpButton: false,
            clockViewModel: null,
            terrainProvider: terrainProvider,
            terrainExaggeration: 1,
            infoBox: false,
            selectionIndicator: false,
            shadows: true,
            shouldAnimate: true,
            baseLayerPicker: false,
            requestRenderMode: true,
            // 在requestRenderMode为true时，如果有随时间执行的动画，可指定时间执行一次渲染
            maximumRenderTimeChange: 0.5,
        };
        // 初始化运行时间
        // if (option.clock) {
        //     const clock = option.clock
        //     let { startTime, endTime, currentTime, timeOpt } = clock
        //     viewerOpt.clockViewModel = timeOpt?setClock(startTime, endTime, currentTime, option)
        //     :setClock(startTime, endTime, currentTime)
        // }
        const viewer = cm.$viewer = new cesium_1.Viewer(domId, viewerOpt);
        cesium_navigation_es6_1.default(viewer, {});
        // 删除默认图层
        viewer.imageryLayers.removeAll();
    }
});
