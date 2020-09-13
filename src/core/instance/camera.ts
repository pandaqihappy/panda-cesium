import { Math, Cartesian3, HeadingPitchRoll } from 'cesium'
import { CesiumApi } from '../interface/init'
import { transPositionValue, TransPositionValue } from '../utils/index'

export type VerifyPositionValue = (lon: number | string, lat: number | string, h?: number | string) => void

// 初始化相机
export function initCamera(cm) {
    const $viewer = cm.$viewer

    let cameraAPI = Object.create(cm)
    cameraAPI = (<any>Object).assign(cameraAPI, {
        setView,
        flyTo,
        setHomeBtn,
        flyToHeadingPitchRoll
    })
    cm.camera = cameraAPI
    cm.camera.setHomeBtn(101.78, 36.62, 5000000)
}

// 直接显示位置
function setView(lon: number | string, lat: number | string, h?: number | string) {
    lon = transPositionValue(lon) as number
    lat = transPositionValue(lat) as number
    h = transPositionValue(h) as number

    var initialOrientation = HeadingPitchRoll.fromDegrees(0, -90, 0);

    const cameraView = {
        destination: Cartesian3.fromDegrees(lon, lat, h),
        orientation: { // 方向
            // heading: Math.toRadians(0),
            // pitch: Math.toRadians(-90),
            // roll: Math.toRadians(0),
            heading : initialOrientation.heading,
            pitch : initialOrientation.pitch,
            roll : initialOrientation.roll
        }
    };

    this.$viewer.camera.setView(cameraView)
}

// 飞到某地
function flyTo(lon: number | string, lat: number | string, h?: number | string) {
    lon = transPositionValue(lon);
    lat = transPositionValue(lat);
    h = transPositionValue(h);
    
    this.$viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon as number, lat as number, h as number)
    })
}

// 切换摄像机视图
function flyToHeadingPitchRoll(lon: number | string, lat: number | string, h?: number | string) {
    lon = transPositionValue(lon) as number
    lat = transPositionValue(lat) as number
    h = transPositionValue(h) as number
    this.$viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon, lat, h),
        orientation: {
            heading: Math.toRadians(20.0),
            pitch: Math.toRadians(-35.0),
            roll: 0.0
        }
    });
}

// 设置Home按钮
function setHomeBtn (lon: number|string, lat: number|string, h?: number|string) {
    lon = transPositionValue(lon)
    lat = transPositionValue(lat)
    h = transPositionValue(h)
    let cm = this
    cm.$viewer.homeButton.viewModel.command.beforeExecute.addEventListener( (e) => {
        e.cancel = true;
        cm.$viewer.scene.camera.flyTo({
            destination: Cartesian3.fromDegrees(lon as number, lat as number, h as number)
        });
    });
}

