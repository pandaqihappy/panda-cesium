/*
 * @Author: your name
 * @Date: 2020-03-18 11:21:33
 * @LastEditTime: 2020-03-23 14:55:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesiumTest\components\cesium\event\tool\process\distance.js
 */
import {
    Math as CesiumMath,
    CallbackProperty,
    Color,
    Cartographic,
    EllipsoidGeodesic,
    HeightReference,
    ScreenSpaceEventType,
    LabelStyle,
    VerticalOrigin,
    defined,
    Cartesian2
} from 'cesium'

function distanceEvent() {
    let positions = []
    let poly = null
    // var tooltip = document.getElementById("toolTip");
    let distance = 0
    let cartesian = null
    let floatingPoint
    let distancePoints = []
    // 重置数据
    const reset = (entities) => {
        distancePoints.map(distancePoint => {
            entities.remove(distancePoint)
        })
        entities.remove(poly) // 删除polyline实例
        poly = null
        distancePoints = []
        positions = []
        distance = 0
    }

    return {
        click: function () {
            const viewer = this.viewer
            this.handler.setInputAction(function (movement) {
                let ray = viewer.camera.getPickRay(movement.position)
                cartesian = viewer.scene.globe.pick(ray, viewer.scene)
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加Label
                //   var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let textDisance = distance + "米";
                // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
                floatingPoint = viewer.entities.add({
                    name: '空间直线距离',
                    // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 5,
                        color: Color.RED,
                        outlineColor: Color.WHITE,
                        outlineWidth: 2,
                    },
                    label: {
                        text: textDisance,
                        font: '18px sans-serif',
                        fillColor: Color.GOLD,
                        style: LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        pixelOffset: new Cartesian2(20, -20),
                    }
                });
                // 缓存浮点
                distancePoints.push(floatingPoint)
            }, ScreenSpaceEventType.LEFT_CLICK);
        },
        dbclick: function () {
            const entities = this.viewer.entities
            this.handler.setInputAction((movement) => {
                // distancePoints.map(distancePoint => {
                //     entities.remove(distancePoint)
                // })
                // entities.remove(poly) // 删除polyline实例
                // poly = null
                // distancePoints = []
                // positions = []
                // distance = 0
                reset(entities)
            }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        },
        mousemove: function () {
            const viewer = this.viewer
            this.handler.setInputAction(movement => {
                // 通过鼠标指向的点转换为一条射线，ray为世界坐标
                let ray = viewer.camera.getPickRay(movement.endPosition);
                // 在射线和被渲染的球体表面之间找到一个交点。射线必须以世界坐标表示
                cartesian = viewer.scene.globe.pick(ray, viewer.scene)
                // 点位大于2且能获取到当前点位坐标时
                if (positions.length >= 2 && cartesian) {
                    if (!defined(poly)) {
                        // 添加polyline实例
                        poly = new PolyLinePrimitive(positions, viewer);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                    let distance = getSpaceDistance(positions);
                    // console.log("distance: " + distance);
                    // tooltip.innerHTML='<p>'+distance+'米</p>';
                }
                // console.log('positions', positions)
            }, ScreenSpaceEventType.MOUSE_MOVE)
        },
        rightClick: function () {
            this.handler.setInputAction((movement) => {
                positions.pop(); //最后一个点无效
                this.viewer.entities.remove(distancePoints.pop());
                if (distancePoints.length === 0) {
                    poly = null
                    positions = []
                    distance = 0
                }
            }, ScreenSpaceEventType.RIGHT_CLICK);
        },
        destroy: function (viewer) {
            if (!viewer) return
            const entities = viewer.entities
            reset(entities)
        }
    }
}

class PolyLinePrimitive {
    public positions
    public viewer
    public options
    constructor(positions, viewer) {
        this.options = {
            name: '直线',
            polyline: {
                show: true,
                positions: [],
                material: Color.CHARTREUSE,
                width: 4,
                clampToGround: true
            }
        };
        this.positions = positions;
        this.viewer = viewer;
        return this._init();
    }
    _init = () => {
        var _update = () => {
            return this.positions;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new CallbackProperty(_update, false);
        let polyline = this.viewer.entities.add(this.options);
        return polyline
    }
}

//空间两点距离计算函数
function getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
    }
    return distance.toFixed(2);
}

export default distanceEvent