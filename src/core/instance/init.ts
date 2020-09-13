import CesiumNavigation from 'cesium-navigation-es6'
import { CesiumTerrainProvider, Viewer, buildModuleUrl } from 'cesium'
import { initImageryLayer } from './imageryLayer'
import { initSence } from './sence'
import { initCamera } from './camera'
import { initClock, setClock } from './clock'
import { initEntityComposeApi } from '../composeApi/entity'
import { initRegister } from './register'
import { initLayers } from '../layers/index'
import { warn } from '../utils/warn'

const terrainProvider = new CesiumTerrainProvider({ url: 'http://127.0.0.1:8686/dem' })

// buildModuleUrl.setBaseUrl('../Cesium/')

// 测试option
const testOpt = {
    clock: {
        startTime: '2020-07-11',
        endTime: '2020-07-12',
        currentTime: '2020-07-11',
    },
    maps: ["offLineMap"]
}

export function initMixin(PdCesium: Function) {
    PdCesium.prototype._init = function (domId: string, option?: object) {
        const cm = this
        cm.$option = option
        // 测试用option
        // cm.$option = testOpt
        if (!domId) {
            return
        }
        initViewer(cm, domId)
        initImageryLayer(cm)
        initSence(cm)
        initCamera(cm)
        // initClock(cm)
        // initEntity(cm)
        initEntityComposeApi(cm)
        initRegister(cm)
        initLayers(cm)
    }
}



// 初始化viewer
function initViewer(cm, domId: string): void {
    cm.$dom = document.querySelector(`#${domId}`)
    const option = cm.$option
    if (option.buildModuleUrl && typeof option.buildModuleUrl === 'string')  {
        buildModuleUrl(option.buildModuleUrl)
    } else {
        warn('has no buildModuleUrl')
        return
    }
    
    const viewerOpt = {
        // animation: false, // 是否创建动画小部件
        // timeline: false, // 是否显示时间线控件
        // fullscreenButton: false, // 右下角全屏按钮
        // geocoder: false, // 是否显示地名查找控件
        // terrainProvider : Cesium.createWorldTerrain(),
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        clockViewModel: null,
        terrainProvider: terrainProvider,
        terrainExaggeration: 1,
        infoBox: false,
        selectionIndicator: false,
        shadows: true,
        shouldAnimate: true,
        baseLayerPicker: false, // 是否显示图层选择控件
        requestRenderMode: true, // 用于提高性能，只在指定情况触发时执行渲染
        // 在requestRenderMode为true时，如果有随时间执行的动画，可指定时间执行一次渲染
        maximumRenderTimeChange: 0.5,
        // targetFrameRate: 30,
    }
    // 初始化运行时间
    // if (option.clock) {
    //     const clock = option.clock
    //     let { startTime, endTime, currentTime, timeOpt } = clock
    //     viewerOpt.clockViewModel = timeOpt?setClock(startTime, endTime, currentTime, option)
    //     :setClock(startTime, endTime, currentTime)
    // }

    const viewer = cm.$viewer = new Viewer(domId, viewerOpt)
    CesiumNavigation(viewer, {})
    // 删除默认图层
    viewer.imageryLayers.removeAll()
}
