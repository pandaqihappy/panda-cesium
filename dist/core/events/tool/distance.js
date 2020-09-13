define(["require", "exports", "./cesium"], function (require, exports, Cesium) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function distanceEvent() {
        let positions = [];
        let poly = null;
        // var tooltip = document.getElementById("toolTip");
        let distance = 0;
        let cartesian = null;
        let floatingPoint;
        let distancePoints = [];
        // 重置数据
        const reset = (entities) => {
            distancePoints.map(distancePoint => {
                entities.remove(distancePoint);
            });
            entities.remove(poly); // 删除polyline实例
            poly = null;
            distancePoints = [];
            positions = [];
            distance = 0;
        };
        return {
            click: function () {
                const viewer = this.viewer;
                this.handler.setInputAction(function (movement) {
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
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
                            color: Cesium.Color.RED,
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2,
                        },
                        label: {
                            text: textDisance,
                            font: '18px sans-serif',
                            fillColor: Cesium.Color.GOLD,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(20, -20),
                        }
                    });
                    // 缓存浮点
                    distancePoints.push(floatingPoint);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            dbclick: function () {
                const entities = this.viewer.entities;
                this.handler.setInputAction((movement) => {
                    // distancePoints.map(distancePoint => {
                    //     entities.remove(distancePoint)
                    // })
                    // entities.remove(poly) // 删除polyline实例
                    // poly = null
                    // distancePoints = []
                    // positions = []
                    // distance = 0
                    reset(entities);
                }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            },
            mousemove: function () {
                const viewer = this.viewer;
                this.handler.setInputAction(movement => {
                    // 通过鼠标指向的点转换为一条射线，ray为世界坐标
                    let ray = viewer.camera.getPickRay(movement.endPosition);
                    // 在射线和被渲染的球体表面之间找到一个交点。射线必须以世界坐标表示
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    // 点位大于2且能获取到当前点位坐标时
                    if (positions.length >= 2 && cartesian) {
                        if (!Cesium.defined(poly)) {
                            // 添加polyline实例
                            poly = new PolyLinePrimitive(positions, viewer);
                        }
                        else {
                            positions.pop();
                            positions.push(cartesian);
                        }
                        distance = getSpaceDistance(positions);
                        // console.log("distance: " + distance);
                        // tooltip.innerHTML='<p>'+distance+'米</p>';
                    }
                    // console.log('positions', positions)
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },
            rightClick: function () {
                this.handler.setInputAction((movement) => {
                    positions.pop(); //最后一个点无效
                    this.viewer.entities.remove(distancePoints.pop());
                    if (distancePoints.length === 0) {
                        poly = null;
                        positions = [];
                        distance = 0;
                    }
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            },
            destroy: function (viewer) {
                if (!viewer)
                    return;
                const entities = viewer.entities;
                reset(entities);
            }
        };
    }
    class PolyLinePrimitive {
        constructor(positions, viewer) {
            this._init = () => {
                var _update = () => {
                    return this.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                let polyline = this.viewer.entities.add(this.options);
                return polyline;
            };
            this.options = {
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 4,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this.viewer = viewer;
            return this._init();
        }
    }
    //空间两点距离计算函数
    function getSpaceDistance(positions) {
        var distance = 0;
        for (var i = 0; i < positions.length - 1; i++) {
            var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
    }
    exports.default = distanceEvent;
});
