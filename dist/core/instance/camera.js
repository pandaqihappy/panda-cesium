define(["require", "exports", "cesium", "../utils/index"], function (require, exports, cesium_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initCamera = void 0;
    // 初始化相机
    function initCamera(cm) {
        const $viewer = cm.$viewer;
        let cameraAPI = Object.create(cm);
        cameraAPI = Object.assign(cameraAPI, {
            setView,
            flyTo,
            setHomeBtn,
            flyToHeadingPitchRoll
        });
        cm.camera = cameraAPI;
        cm.camera.setHomeBtn(101.78, 36.62, 5000000);
    }
    exports.initCamera = initCamera;
    // 直接显示位置
    function setView(lon, lat, h) {
        lon = index_1.transPositionValue(lon);
        lat = index_1.transPositionValue(lat);
        h = index_1.transPositionValue(h);
        var initialOrientation = cesium_1.HeadingPitchRoll.fromDegrees(0, -90, 0);
        const cameraView = {
            destination: cesium_1.Cartesian3.fromDegrees(lon, lat, h),
            orientation: {
                // heading: Math.toRadians(0),
                // pitch: Math.toRadians(-90),
                // roll: Math.toRadians(0),
                heading: initialOrientation.heading,
                pitch: initialOrientation.pitch,
                roll: initialOrientation.roll
            }
        };
        this.$viewer.camera.setView(cameraView);
    }
    // 飞到某地
    function flyTo(lon, lat, h) {
        lon = index_1.transPositionValue(lon);
        lat = index_1.transPositionValue(lat);
        h = index_1.transPositionValue(h);
        this.$viewer.camera.flyTo({
            destination: cesium_1.Cartesian3.fromDegrees(lon, lat, h)
        });
    }
    // 切换摄像机视图
    function flyToHeadingPitchRoll(lon, lat, h) {
        lon = index_1.transPositionValue(lon);
        lat = index_1.transPositionValue(lat);
        h = index_1.transPositionValue(h);
        this.$viewer.camera.flyTo({
            destination: cesium_1.Cartesian3.fromDegrees(lon, lat, h),
            orientation: {
                heading: cesium_1.Math.toRadians(20.0),
                pitch: cesium_1.Math.toRadians(-35.0),
                roll: 0.0
            }
        });
    }
    // 设置Home按钮
    function setHomeBtn(lon, lat, h) {
        lon = index_1.transPositionValue(lon);
        lat = index_1.transPositionValue(lat);
        h = index_1.transPositionValue(h);
        let cm = this;
        cm.$viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
            e.cancel = true;
            cm.$viewer.scene.camera.flyTo({
                destination: cesium_1.Cartesian3.fromDegrees(lon, lat, h)
            });
        });
    }
});
