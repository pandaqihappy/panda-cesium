/*
 * @Author: 潘文奇
 * @Date: 2020-03-17 14:16:14
 * @LastEditTime: 2020-03-30 17:35:06
 * @LastEditors: Please set LastEditors
 * @Description: 工具栏默认事件
 * @FilePath: \cesiumTest\components\cesium\event\tool\process\normal.js
 */
import {
    defined,
    Color,
    ScreenSpaceEventType,

} from './cesium'

let lastClickCallback = null
let lastDbclickCallback = null
let lastMousemoveCallback = null
/**
 * @description: 默认工具实现方法
 * @param {type} 
 * @return: 
 */
const normalEvent = () => {
    let lastEntity = null
    return {
        click: function(callback) {
            if (callback) lastClickCallback = callback
            if (!callback && lastClickCallback) callback = lastClickCallback

            let handler = this.handler
            let viewer = this.viewer
            const getSelectedEntity = this.getSelectedEntity
            const resetSelectedEntity = this.resetSelectedEntity
            handler.setInputAction(movement => {
                if (lastEntity && lastEntity.model) {
                    lastEntity.model.silhouetteColor = undefined
                    lastEntity.model.silhouetteSize = 0
                }
                const scene = viewer.scene
                const position = movement.position
                const pickedObject = scene.pick(position)
                // 如果存在该实例，执行回调函数
                if (defined(pickedObject)) {
                    const entity = pickedObject.id
                    if (entity.model) {
                        entity.model.silhouetteColor = Color.RED
                        entity.model.silhouetteSize = 2
                    }
                    scene.requestRender()
                    // 通过Screen类的getSelectedEntity方法获取选中的实例
                    getSelectedEntity(entity)
                    lastEntity = entity
                    callback(entity, position)
                } else {
                    resetSelectedEntity()
                }

            }, ScreenSpaceEventType.LEFT_CLICK)
        },
        dbclick: function (callback) {
            if (callback) lastDbclickCallback = callback
            if (!callback && lastDbclickCallback) callback = lastDbclickCallback

            let handler = this.handler
            let viewer = this.viewer
            handler.setInputAction(movement => {
                const position = movement.position
                const pickedObject = viewer.scene.pick(position)
                if (callback) callback(pickedObject, position)
            }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        },
        mousemove: function (callback) {
            if (callback) lastMousemoveCallback = callback
            if (!callback && lastMousemoveCallback) callback = lastMousemoveCallback

            let handler = this.handler
            handler.setInputAction(movement => {
                const endPosition = movement.endPosition
                if (callback) callback(endPosition)
            }, ScreenSpaceEventType.MOUSE_MOVE)
        }
    }
}



export default normalEvent