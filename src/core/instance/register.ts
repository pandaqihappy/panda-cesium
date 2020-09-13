import {
    Math,
    HeadingPitchRoll,
    Transforms,
    HeightReference,
    Color,
    DistanceDisplayCondition,
    KmlDataSource,
    GeoJsonDataSource,
    Entity,
    defined,
    LabelStyle,
    VerticalOrigin,
    LabelOptions
} from 'cesium'



//  传值示例
// let register = {
//     models: [
//         {
//             name: 'airport',
//             url: '../../glb/Cesium_Air.glb'
//         },
//         {
//             name: '',
//             url: '../../glb/Wood_Tower.glb'
//         }
//     ],
//     images: [

//     ],
//     geoJsons: [
//         {
//             name: "Amarica",
//             url: "../../json/ne_10m_us_states.topojson"
//         },
//         {
//             name: "ChinaAll",
//             url: "../../json/chinaall.geojson"
//         },
//         {
//             name: 'China',
//             uri: "../../json/china.geojson"
//         }
//     ]
// },


// 注册图片、模型及json路径
export function initRegister(cm) {
    const CACHE = {
        modelsUrlCache: {},
        imagesUrlCache: {},
        geoJsonsUrlCache: {}
    }

    cm.CACHE = CACHE

    const option = cm.$option

    if (option.register) {
        let register = option.register
        handleRegister.call(cm, register)
    }

    

    

    cm.addKml = addKml
    cm.addJson = addGeoJson
}

interface RegisterObject {
    name: string,
    url: string
}

interface Register {
    models?: Array<RegisterObject>,
    images?: Array<RegisterObject>,
    geoJsons?: Array<RegisterObject>
}

// 注册glb模型文件，geoJson文件，image文件
function handleRegister(register:Register) {
    let cm = this
    let { models, images, geoJsons } = register
    _setCacheMap(models, cm.CACHE.modelsUrlCache)
    _setCacheMap(images, cm.CACHE.imagesUrlCache)
    _setCacheMap(geoJsons, cm.CACHE.geoJsonsUrlCache, addGeoJson.bind(cm))
}

// 注册工具函数
function _setCacheMap(props:Array<RegisterObject>, cache: object, fn?:Function) {
    if (props && props.length > 0) {
        props.map(prop => {
            let { name, url } = prop
            cache[name] = url
            if (fn) fn(name)
        })
    }
}

/**
 * @description: 引入kml
 * @param {geoJson} json路径
 * @param {opt} 
 * @return: 
 */
function addKml(url, opt) {
    const defaultOpt = {
        camera: this.$viewer.scene.camera,
        canvas: this.$viewer.scene.canvas,
        clampToGround: true
    }
    opt = (<any>Object).assign({}, defaultOpt, opt)
    // Load geocache points of interest from a KML file
    // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
    const geocachePromise = KmlDataSource.load('../../../static/kml/eiffel-tower-flyto.kml', opt)
    geocachePromise.then((dataSource) => {
        this.$viewer.dataSources.add(dataSource)
    })
}

// GeoJsonOpt配置项接口
interface GeoJsonOpt {
    stroke?: object,
    fill?: object, // 矢量填充颜色
    strokeWidth?: number
}

/**
 * @description: 引入json
 * @param {geoJson} json路径
 * @param {opt} json配置
 * @return: 
 */
function addGeoJson(jsonName: string, opt?: object) {
    const cm = this
    let neighborhoods: object
    let url: string
    let name: string

    url = cm.CACHE.geoJsonsUrlCache[jsonName]
    let defaultOpt: GeoJsonOpt = {
        stroke: Color.AQUA, // 矢量边框颜色
        fill: Color.VIOLET.withAlpha(0), // 矢量填充颜色
        strokeWidth: 3, // 边框宽度
    }
    if (opt) {
        opt = (<any>Object).assign({}, defaultOpt, opt)
    } else {
        opt = defaultOpt
    }
    
    GeoJsonDataSource.load(url, opt).then(dataSource => {
        dataSource.name = jsonName
        cm.$viewer.dataSources.add(dataSource)

        neighborhoods = dataSource.entities;

        // 获取实例数组
        const neighborhoodEntities = dataSource.entities.values;
        for (let i = 0; i < neighborhoodEntities.length; i++) {
            const entity = neighborhoodEntities[i] as any

            if (defined(entity.polygon)) {
                // 设置实例的名字
                entity.name = entity.properties.neighborhood
                // 将实例多边形属性中的区域设置为随机颜色
                // entity.polygon.material = Color.fromRandom({
                //     red: 0.1,
                //     maximumGreen: 0.5,
                //     minimumBlue: 0.5,
                //     alpha: 0.6
                // });
            }
        }
    })
}