define(["require", "exports", "./cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let lastClickCallback = null;
    let lastDbclickCallback = null;
    let lastMousemoveCallback = null;
    /**
     * @description: 默认工具实现方法
     * @param {type}
     * @return:
     */
    const normalEvent = () => {
        let lastEntity = null;
        return {
            click: function (callback) {
                if (callback)
                    lastClickCallback = callback;
                if (!callback && lastClickCallback)
                    callback = lastClickCallback;
                let handler = this.handler;
                let viewer = this.viewer;
                const getSelectedEntity = this.getSelectedEntity;
                const resetSelectedEntity = this.resetSelectedEntity;
                handler.setInputAction(movement => {
                    if (lastEntity && lastEntity.model) {
                        lastEntity.model.silhouetteColor = undefined;
                        lastEntity.model.silhouetteSize = 0;
                    }
                    const scene = viewer.scene;
                    const position = movement.position;
                    const pickedObject = scene.pick(position);
                    // 如果存在该实例，执行回调函数
                    if (cesium_1.defined(pickedObject)) {
                        const entity = pickedObject.id;
                        if (entity.model) {
                            entity.model.silhouetteColor = cesium_1.Color.RED;
                            entity.model.silhouetteSize = 2;
                        }
                        scene.requestRender();
                        // 通过Screen类的getSelectedEntity方法获取选中的实例
                        getSelectedEntity(entity);
                        lastEntity = entity;
                        callback(entity, position);
                    }
                    else {
                        resetSelectedEntity();
                    }
                }, cesium_1.ScreenSpaceEventType.LEFT_CLICK);
            },
            dbclick: function (callback) {
                if (callback)
                    lastDbclickCallback = callback;
                if (!callback && lastDbclickCallback)
                    callback = lastDbclickCallback;
                let handler = this.handler;
                let viewer = this.viewer;
                handler.setInputAction(movement => {
                    const position = movement.position;
                    const pickedObject = viewer.scene.pick(position);
                    if (callback)
                        callback(pickedObject, position);
                }, cesium_1.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            },
            mousemove: function (callback) {
                if (callback)
                    lastMousemoveCallback = callback;
                if (!callback && lastMousemoveCallback)
                    callback = lastMousemoveCallback;
                let handler = this.handler;
                handler.setInputAction(movement => {
                    const endPosition = movement.endPosition;
                    if (callback)
                        callback(endPosition);
                }, cesium_1.ScreenSpaceEventType.MOUSE_MOVE);
            }
        };
    };
    exports.default = normalEvent;
});
