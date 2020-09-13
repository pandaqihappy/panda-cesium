define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @description: 移入获取坐标
     * 这里的this指向入口类
     * @param {type}
     * @return:
     */
    function coordinatePoint() {
        return {
            mousemove: function (callback) {
                const scene = this.viewer.scene;
                // 创建坐标点展示
                const entity = this.viewer.entities.add({
                    point: {
                        show: false,
                        color: cesium_1.Color.YELLOW,
                        pixelSize: 8,
                    },
                    label: {
                        show: false,
                        showBackground: true,
                        font: '14px monospace',
                        horizontalOrigin: cesium_1.HorizontalOrigin.LEFT,
                        verticalOrigin: cesium_1.VerticalOrigin.TOP,
                        pixelOffset: new cesium_1.Cartesian2(15, 0)
                    }
                });
                // 缓存工具用实例
                this.toolEntity = entity;
                this.handler.setInputAction(movement => {
                    // 获取视图中鼠标所指的世界坐标
                    const cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                    if (cartesian) {
                        const cartographic = cesium_1.Cartographic.fromCartesian(cartesian);
                        const longitudeString = cesium_1.Math.toDegrees(cartographic.longitude).toFixed(2); // 经度
                        const latitudeString = cesium_1.Math.toDegrees(cartographic.latitude).toFixed(2); // 纬度
                        const heightString = cartographic.height; // 高度
                        entity.position = cartesian;
                        entity.label.show = true;
                        entity.point.show = true;
                        entity.label.text =
                            'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                                '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                                '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm';
                        // entity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));
                    }
                    else {
                        entity.label.show = false;
                        entity.point.show = false;
                    }
                }, cesium_1.ScreenSpaceEventType.MOUSE_MOVE);
            }
        };
    }
    exports.default = coordinatePoint;
});
