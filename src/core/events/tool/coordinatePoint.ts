/*
 * @Author: 潘文奇
 * @Date: 2020-03-17 14:31:00
 * @LastEditTime: 2020-03-31 11:33:42
 * @LastEditors: Please set LastEditors
 * @Description: 坐标点工具
 * @FilePath: \cesiumTest\components\cesium\event\tool\process\coordinatePoint.js
 */
import {
    HorizontalOrigin,
    VerticalOrigin,
    Cartesian2,
    Cartographic,
    Math,
    ScreenSpaceEventType,
    Color
} from 'cesium'
/**
 * @description: 移入获取坐标
 * 这里的this指向入口类
 * @param {type}
 * @return: 
 */
function coordinatePoint() {
    return {
        mousemove: function (callback) {
            const scene = this.viewer.scene
            // 创建坐标点展示
            const entity = this.viewer.entities.add({
                point: {
                    show : false, // default
                    color : Color.YELLOW, // default: WHITE
                    pixelSize : 8, // default: 1
                    // outlineWidth : 2, // default: 0
                },
                label: {
                    show: false,
                    showBackground: true,
                    font: '14px monospace',
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.TOP,
                    pixelOffset: new Cartesian2(15, 0)
                }
            });
            // 缓存工具用实例
            this.toolEntity = entity
    
            this.handler.setInputAction(movement => {
                // 获取视图中鼠标所指的世界坐标
                const cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid)
                if (cartesian) {
                    const cartographic = Cartographic.fromCartesian(cartesian)
                    const longitudeString = Math.toDegrees(cartographic.longitude).toFixed(2) // 经度
                    const latitudeString = Math.toDegrees(cartographic.latitude).toFixed(2) // 纬度
                    const heightString = cartographic.height // 高度

                    entity.position = cartesian
                    entity.label.show = true
                    entity.point.show = true
                    entity.label.text =
                        'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                        '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm';
    
                    // entity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));
                } else {
                    entity.label.show = false
                    entity.point.show = false
                }
            }, ScreenSpaceEventType.MOUSE_MOVE)
        }
    }
}

export default coordinatePoint