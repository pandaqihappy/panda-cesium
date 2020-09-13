define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initSence = void 0;
    function initSence(cm) {
        const viewer = cm.$viewer;
        viewer.scene.globe.enableLighting = false; // 设置基于太阳位置的光照
        let sceneAPI = Object.create({ viewer });
        sceneAPI = Object.assign(sceneAPI, {
            resetScene,
            requestRender,
            scenePostUpdateListener,
            scenePreRenderListener
        });
        cm.sence = sceneAPI;
    }
    exports.initSence = initSence;
    /**
     * @description: 重置场景
     * @param {type}
     * @return:
     */
    const resetScene = () => {
        const viewer = this.viewer;
        const scene = this.viewer.scene;
        viewer.trackedEntity = undefined;
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
        // scene.primitives.remove(tileset)
        viewer.clock.shouldAnimate = false;
        // handler = handler && handler.destroy()
        scene.skyBox.show = true;
        scene.camera.flyHome(0.0);
        scene.requestRender();
        // viewModel.showTimeOptions = false
        // viewModel.timeChangeEnabled = false
        // viewModel.maximumRenderTimeChange = 0
    };
    /**
     * @description: 如果设置了scene.requestRenderMode为true，
     * 在执行如增删查改，或者改变某个属性，需要调用该方法才会自动渲染出新的帧，实现场景变化
     * @param {type}
     * @return:
     */
    const requestRender = () => {
        const scene = this.viewer.scene;
        scene.requestRender();
    };
    /**
     * @description: 数据更新后钩子函数订阅
     * @param {type}
     * @return:
     */
    const scenePostUpdateListener = () => {
        const scene = this.viewer.scene;
        scene.postUpdate.addEventListener(function () {
            // This code will run at 60 FPS
            // if (changeToPromptRender) {
            //     scene.requestRender()
            // }
        });
    };
    /**
     * @description: 数据渲染前钩子函数订阅
     * @param {type}
     * @return:
     */
    const scenePreRenderListener = () => {
        const scene = this.viewer.scene;
        scene.preRender.addEventListener(function () {
            console.log('preRender');
            // This code will run when a new frame is rendered
            // including when changeToPromptRender is true
        });
    };
});
