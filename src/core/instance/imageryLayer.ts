import { CesiumApi } from '../interface/index'

import {
    OpenStreetMapImageryProvider,
    WebMapTileServiceImageryProvider,
    UrlTemplateImageryProvider,
    defaultValue
} from 'cesium'



export function initImageryLayer (cm: CesiumApi):void {
    const option = cm.$option
    const maps = option.maps
    cm.addLayer = addLayer(cm)
    cm.addLayer(maps) // 初始化地图图层


}

// 添加多个图层
export function addLayer(cm: CesiumApi):Function {
    return (maps:Array<string>) => {
        const viewer = cm.$viewer
        maps
        .reverse()
        .map(name => {
            _addLayer(viewer, {name, imageryProvider: new NewImageryProvider(name)})
        })
    }
}

interface _AddLayer {
    name:string,
    imageryProvider:object,
    alpha?:any,
    show?:boolean
}

function _addLayer (viewer: any, opt: _AddLayer) {
    let { name, imageryProvider, alpha, show } = opt
    let layer = viewer.imageryLayers.addImageryProvider(imageryProvider)
    if (alpha) layer.alpha = defaultValue(alpha, 1)
    if (show) layer.show = defaultValue(show, true)
    layer.name = name
}

// 通过地图名称生成 imageryProvider
class NewImageryProvider {
    constructor(name) {
        switch (name) {
            case 'OpenStreetMap':
                return new OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/'
                })
            case 'TianDiTu':
                return new WebMapTileServiceImageryProvider({
                    url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=c24d9716c14a72ab120075db91686c17',
                    layer: 'img',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                })
            case 'TianDiTuBZ':
                return new WebMapTileServiceImageryProvider({
                    url: 'http://t0.tianditu.gov.cn/cia_w/wmts?tk=c24d9716c14a72ab120075db91686c17',
                    layer: 'cia',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                })
            case 'offLineMap': 
                return new UrlTemplateImageryProvider({
                    url: 'http://127.0.0.1:8686/satellite/{z}/{x}/{y}.jpg',
                    // fileExtension: 'jpg',
                    minimumLevel: 0,
                    maximumLevel: 10,
                })
            case 'Overlay':
                return new UrlTemplateImageryProvider({
                    url: 'http://127.0.0.1:8686/overlay/{z}/{x}/{y}.png',
                    // fileExtension: 'png',
                    minimumLevel: 0,
                    maximumLevel: 10,
                })
        }
    }
}