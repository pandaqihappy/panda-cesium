
import {
    createEntity,
    setBaseProps,
    getEntityById,
    setLabelProps,
    setOrientationProps,
    setBillboardProps,
    addEntityToDataSource,
    setGlbProps
} from '../instance/entity'

import { flowRight } from 'lodash'
import { warn } from '../utils/index'

export function initEntityComposeApi (cm) {
    cm = Object.assign(cm, {
        addEntity,
        showEntity
    })
}

// 设置实例参数
const setEntityProps = flowRight(
    setOrientationProps,
    setBillboardProps,
    setGlbProps,
    setLabelProps,
    setBaseProps
)

// 添加glb文件
const addEntity = flowRight(
    addEntityToDataSource,
    setEntityProps,
    createEntity
)

// 更新实例
const updateEntity = flowRight(
    setEntityProps,
    getEntityById
)

// 是否显示实例
function showEntity (id: string|number, show: boolean):void {
    let cm = this
    let entities = cm.$viewer.entities
    let entity = entities.getById(id)
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

// 2d3d实例转换
// function changeModelAndBillboard (type) {

// }
