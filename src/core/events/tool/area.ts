/*
 * @Author: your name
 * @Date: 2020-03-19 14:26:25
 * @LastEditTime: 2020-03-23 15:06:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesiumTest\components\cesium\event\tool\process\area.js
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
import * as turf from '@turf/turf'
function areaEvent() {
    let positions = []
    let tempPoints = []
    let polygon = null
    // var tooltip = document.getElementById("toolTip");
    let cartesian = null;
    let floatingPoints = [];//浮动点
    let textEntity = null // 面积label实例
    let isDraw = false // 是否正在画图

    const reset = (entities) => {
        floatingPoints.forEach(points => {
            entities.remove(points)
        })
        entities.remove(polygon) // 删除面实例
        entities.remove(textEntity) // 删除文本实例
        positions = []
        tempPoints = []
        polygon = null // 面实例
        cartesian = null
        textEntity = null
        isDraw = false // 是否正在画图
    }

    return {
        click: function () {
            const viewer = this.viewer
            const entities = viewer.entities
            this.handler.setInputAction(function (movement) {
                if (!isDraw) reset(entities)
                isDraw = true
                let ray = viewer.camera.getPickRay(movement.position);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加点
                // 通过笛卡尔坐标来获取一个制图实例
                var cartographic = Cartographic.fromCartesian(positions[positions.length - 1]);
                // 将制图实例的经纬度弧度转为角度
                var longitudeString = CesiumMath.toDegrees(cartographic.longitude);
                var latitudeString = CesiumMath.toDegrees(cartographic.latitude);
                // 制图实例高度
                var heightString = cartographic.height;
                tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
                let floatingPoint = viewer.entities.add({
                    name: '多边形面积',
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 5,
                        color: Color.RED,
                        outlineColor: Color.WHITE,
                        outlineWidth: 2,
                        heightReference: HeightReference.CLAMP_TO_GROUND
                    }
                });
                floatingPoints.push(floatingPoint)
            }, ScreenSpaceEventType.LEFT_CLICK);
        },
        dbclick: function () {
            const entities = this.viewer.entities
            this.handler.setInputAction((movement) => {

            }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        },
        mousemove: function () {
            const viewer = this.viewer
            this.handler.setInputAction(movement => {
                let ray = viewer.camera.getPickRay(movement.endPosition)
                cartesian = viewer.scene.globe.pick(ray, viewer.scene)
                if (positions.length >= 2 && cartesian && isDraw) {
                    if (!defined(polygon)) {
                        polygon = new PolygonPrimitive(positions, viewer)
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, ScreenSpaceEventType.MOUSE_MOVE)
        },
        rightClick: function () {
            const viewer = this.viewer
            const entities = viewer.entities
            this.handler.setInputAction((movement) => {
                if (textEntity) {entities.remove(textEntity)}
                positions.pop()
                // viewer.entities.remove(floatingPoints.pop())
                let areaPointArr = tempPoints.map(point => {
                    let lon = point.lon
                    let lat = point.lat
                    return [lon, lat]
                })
                areaPointArr.push(areaPointArr[0])
                let polygon = turf.polygon([areaPointArr])
                var area = turf.area(polygon)
                // const textArea = getArea(tempPoints, positions) + "平方公里";
                textEntity = entities.add({
                    name: '多边形面积',
                    position: positions[positions.length - 1],
                    // point : {
                    //  pixelSize : 5,
                    //  color : Cesium.Color.RED,
                    //  outlineColor : Cesium.Color.WHITE,
                    //  outlineWidth : 2,
                    //  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND 
                    // },
                    label: {
                        // text: textArea,
                        text: area + '平方米',
                        font: '18px sans-serif',
                        fillColor: Color.GOLD,
                        style: LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        pixelOffset: new Cartesian2(20, -40),
                        heightReference: HeightReference.CLAMP_TO_GROUND
                    }
                });
                isDraw = false
            }, ScreenSpaceEventType.RIGHT_CLICK);
        },
        destroy(viewer) {
            if (!viewer) return
            const entities = viewer.entities
            reset(entities)
        },
    }
}

var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

//计算多边形面积
function getArea(points, positions) {

    var res = 0;
    //拆分三角曲面

    for (var i = 0; i < points.length - 2; i++) {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        var totalAngle = Angle(points[i], points[j], points[k]);


        var dis_temp1 = distance(positions[i], positions[j]);
        var dis_temp2 = distance(positions[j], positions[k]);
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
        console.log(res);
    }


    return (res / 1000000.0).toFixed(4);
}

// turf计算面积
function trufArea() {

}

/*角度*/
function Angle(p1, p2, p3) {
    var bearing21 = Bearing(p2, p1);
    var bearing23 = Bearing(p2, p3);
    var angle = bearing21 - bearing23;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
/*方向*/
function Bearing(from, to) {
    var lat1 = from.lat * radiansPerDegree;
    var lon1 = from.lon * radiansPerDegree;
    var lat2 = to.lat * radiansPerDegree;
    var lon2 = to.lon * radiansPerDegree;
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
        angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian;//角度
    return angle;
}

class PolygonPrimitive {
    public options
    public positions
    public viewer
    public hierarchy
    constructor (positions, viewer) {
        this.options = {
            name: '多边形',
            polygon: {
                hierarchy: [],
                // perPositionHeight : true,
                outline: true,
                outlineWidth: 10,
                height : 0,
                // heightReference : Cesium.HeightReference.CLAMP_TO_GROUND, // 是否贴地
                material: Color.GREEN.withAlpha(0.5),
                // heightReference:20000
            }
        };
        this.positions = positions
        this.viewer = viewer
        this.hierarchy = { positions }
        return this._init();
    }

    _init = function () {
        var _update = () => {
            return this.hierarchy;
        };
        //实时更新polygon.hierarchy
        this.options.polygon.hierarchy = new CallbackProperty(_update, false);
        let polygon = this.viewer.entities.add(this.options);
        return polygon
    };

}

function distance(point1, point2) {
    var point1cartographic = Cartographic.fromCartesian(point1);
    var point2cartographic = Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    var geodesic = new EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    var s = geodesic.surfaceDistance;
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    return s;
}



export default areaEvent