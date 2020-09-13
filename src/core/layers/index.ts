import {
    getEntityById,
    setBaseProps
} from '../instance/entity'
import { warn } from '../utils/warn'

export function initLayers(cm) {
    let viewer = cm.$viewer
    let imageryLayers = viewer.imageryLayers._layers
    let dataSources = viewer.dataSources._dataSources
    let entities = viewer.entities.values
    let layers = {
        dataSources,
        imageryLayers,
        entities
    }

    let layerApi = Object.create(cm)
    layerApi = Object.assign(layerApi, {
        layers,
        setViewerShow
    })

    cm.layers = layerApi
}

const setViewerShow = (type, name, show) => {
    let cm = this
    switch (type) {
        case 'layer':
            showLayer(name, show)
            break
        case 'geoJson':
            showGeojson(name, show)
            break
        case 'entity':
            showEntity(name, show)
            break
        default:
            return
    }
}

function showEntity(id: string|number, show: boolean):void {
    console.log('showEntity')
    let cm = this
    let entities = cm.$viewer.entities
    let entity = getEntityById(id)
    // 如果数据源中查找到实例
    if (entity) {
        setBaseProps([entity, { show }])
    // 如果id为
    } else if (id === 'entity') {
        entities.show = show
    } else {
        warn('has no entity or id')
    }
}

// 设置底图是否显示
function showLayer (name, show) {
    console.log('showLayer')
    let cm = this
    let layers = cm.$viewer.imageryLayers._layers
    let selectedLayer = layers.find(layer => name === layer.name)
    if (selectedLayer) selectedLayer.show = show
}
// 设置矢量图是否显示
function showGeojson (name, show) {
    console.log('showGeojson')
    let cm = this
    let dataSources = cm.$viewer.dataSources._dataSources
    // let selectedDataSources = dataSources.find(dataSource => name === dataSource.name)
    // if (selectedDataSources) selectedDataSources.show = show
}