
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
    VerticalOrigin, LabelOptions,
    BillboardOptions
} from 'cesium'

import { transformCart3Position, warn } from '../utils/index'

import { cloneDeep } from 'lodash'

import {
    EntitybaseProps,
    GlbProps,
    ModelProps,
    EntityPropsType,
    ModelInput
} from '../interface/entity'


// 创建实例
export function createEntity(inputProps: GlbProps) {
    let { id } = inputProps
    const entity = new Entity({ id })
    let props = cloneDeep(inputProps)

    return [entity, props]
}

// 添加基础数据
export function setBaseProps(entityAndProps): [object, object] {
    let [entity, props] = entityAndProps
    let { id, name, position, description, show } = props
    if (position instanceof Array && position.length > 1) {
        entity.position = transformCart3Position(position)
    } else {
        warn('position not the right type or position.lentgh less than 1')
    }

    entity.name = name || entity.name || ''
    if (show) entity.show = show
    // entity.show = show && show

    return [entity, props]
}

// 通过id获取数据
export function getEntityById (id:string|number):object {
    let cm = this
    const entities = cm.$viewer.entities
    let entity = entities.getById(id)
    return entity 
}

// 添加glb属性
export function setGlbProps(entityAndProps): [object, object] {
    let cm = this
    let modelsUrlCache = cm.CACHE.modelsUrlCache
    let [ entity, props ] = entityAndProps

    let model:ModelInput
    
    // 默认model设置
    const defualtModel: ModelProps = {
        // uri: entity.model.uri || '',
        minimumPixelSize: 128,
        maximumScale: 20000,
    }
    if (!entity.model) {
        entity.model
    }
    // 设置
    if (props.model) {
        let model = props.model
        let { distanceDisplayCondition, heightReference, url, minimumPixelSize, maximumScale } = model
        if (url) {
            defualtModel.uri = modelsUrlCache[url]
        }

        // 设置显示条件
        if (distanceDisplayCondition && distanceDisplayCondition.length === 2) {
            let [minDistance, maxDistance] = distanceDisplayCondition
            defualtModel.distanceDisplayCondition = new DistanceDisplayCondition(minDistance, maxDistance)
        }

        // 设置实例与地形关系
        if (heightReference) {
            defualtModel.heightReference = _selectHeightReference(heightReference)
        }
        // 实例最小显示大小
        if (minimumPixelSize) {
            defualtModel.minimumPixelSize = minimumPixelSize
        }
        // 实例最大显示大小
        if (maximumScale) {
            defualtModel.maximumScale = maximumScale
        }
    }

    entity.model = Object.assign(entity.model, defualtModel)

    return [entity, props]
}

// 设置实例方向
export function setOrientationProps(entityAndProps): [object, object] {
    let [entity, props] = entityAndProps
    let { hpr, position } = props
    // let { position } = entity
    let orientation
    let headingPitchRoll
    // 如果有旋转角度数据，则进行数据转换
    if (hpr) {
        headingPitchRoll = _handleHeadingPitchRoll(hpr)
        if (position) {
            if (position instanceof Array) {
                position = transformCart3Position(position)
            } else {
                position = entity.position
            }
            if (typeof position === 'object') {
                orientation = Transforms.headingPitchRollQuaternion(position, headingPitchRoll)
                console.log('orientation', orientation)
            } else {
                warn('position not the right type')
            }
        } else {
            warn('has no position')
        }
    }

    entity.orientation = orientation
    // 通过位置、倾斜、旋转、指向确定实例在地球中的方位

    return [entity, props]
}

// 添加label
export function setLabelProps(entityAndProps): [object, object] {
    let [entity, props] = entityAndProps
    let labelOptions:LabelOptions = {}
    if (!entity.label) {
        entity.label = labelOptions
    } 
    if (props.label) {
        let { text, font, style, outlineWidth,  } = props.label
        if (text) labelOptions.text = text
        if (font) labelOptions.font = font
        if (style) labelOptions.style = _setLabelStyle(style) // fill or fillAndOutline or outline
        if (outlineWidth) labelOptions.outlineWidth = outlineWidth
    }
    entity.label = Object.assign(entity.label, labelOptions)
    return [entity, props]
}

// 添加盒子
export function setBoxProps(entityAndProps): [object, object] {
    let [entity, props] = entityAndProps
    return [entity, props]
}

// 添加广告牌
export function setBillboardProps(entityAndProps): [object, object] {
    let cm = this
    let imagesUrlCache = cm.CACHE.imagesUrlCache
    let [entity, props] = entityAndProps
    let { billboard } = props


    let defaultBillboard:BillboardOptions = {
        show: false
    }
    if (!entity.billboard) {
        entity.billboard = defaultBillboard
    }

    if (billboard) {
        let { url, width, height, show } = billboard
        defaultBillboard.show = show || false
        if (url) defaultBillboard.image = imagesUrlCache[url]
        if (width) defaultBillboard.width = width
        if (height) defaultBillboard.height = height
        entity.billboard =  Object.assign(entity.billboard, defaultBillboard)
    }

    return [entity, props]

}

// 添加实例到实例数据源中
export function addEntityToDataSource(entityAndProps):void {
    let [entity, props] = entityAndProps
    let entities = this.$viewer.entities
    entities.add(entity)
}

//用航向、俯仰和横滚表示的旋转。
export function _handleHeadingPitchRoll(hpr: Array<number>): HeadingPitchRoll {
    let [heading, pitch, roll] = hpr
    // 配置模型的三维方向
    heading = Math.toRadians(heading); // 航向
    let headingPitchRoll = new HeadingPitchRoll(heading, pitch, roll); //用航向、俯仰和横滚表示的旋转。
    return headingPitchRoll
}

// 设置实体与地形关系
export function _selectHeightReference(select) {
    switch (select) {
        case 'CLAMP_TO_GROUND':
            return HeightReference.CLAMP_TO_GROUND
            break
        case 'RELATIVE_TO_GROUND':
            return HeightReference.RELATIVE_TO_GROUND
            break
        default:
            return HeightReference.NONE
    }
}

// 设置babel样式
export function _setLabelStyle(style) {
    switch (style) {
        case 'fill':
            return LabelStyle.FILL
        case 'fillAndOutline':
            return LabelStyle.FILL_AND_OUTLINE
        case 'outline':
            return LabelStyle.OUTLINE
        default:
            return LabelStyle.FILL
    }
}

// 设置字体位置
function _setVerticalOrigin(position) {
    switch (position) {
        case 'top':
            return VerticalOrigin.TOP
        case 'bottom':
            return VerticalOrigin.BOTTOM
        case 'center':
            return VerticalOrigin.CENTER
        case 'baseline':
            return VerticalOrigin.BASELINE
        default:
            return VerticalOrigin.TOP
    }
}