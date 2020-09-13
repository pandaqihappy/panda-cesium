/*
 * @Author: your name
 * @Date: 2020-03-12 15:31:13
 * @LastEditTime: 2020-03-31 10:10:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesiumTest\components\cesium\event\index.js
 */
import * as Cesium from 'cesium'
import Tools from './tool/index'


export default class Event extends Screen {
    public handler
    public selectedToolName
    public toolEntity
    public currentTool
    public cm
    public viewer
    public selectedEntity
    constructor(cm) {
        super()
        this.cm = cm
        this.viewer = this.cm.$viewer
        this.handler = null // 事件监听实例
        this.selectedToolName = 'normal' // 被选中的工具名称
        this.toolEntity = null // 缓存工具创建的实例
        this.currentTool = null // 缓存工具具体实现函数
        this.selectedEntity = null // 被选中的实例
    }
    // 事件初始化
    _initEvent = (viewer) => {
        this.viewer = viewer
        this._createEvent()
        this._bindEvent()
    }

    // 创建事件监听实例
    _createEvent = () => {
        const scene = this.viewer.scene
        this.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    }

    // 销毁事件监听实例
    _destroyEvent = () => {
        this.handler.destroy()
    }

    /**
     * @description: 工具栏选择
     * @param {String} selectedToolName
     * @return: 
     */
    selectTool = (selectedToolName) => {
        let viewer = this.viewer
        // 重置工具实体实例
        this.resetEntity(this.toolEntity)
        this.selectedToolName = selectedToolName
        if (this.currentTool.destroy) this.currentTool.destroy(viewer) // 销毁数据
        this.currentTool = null
        this._destroyEvent()
        this._createEvent()
        this._bindEvent()
    }
    /**
     * @description: 绑定事件，对外接口
     * @param {String} event事件类型，如click、dbclick等
     * @param {Function} callback 回调函数，用于将数据传递给外部业务进行处理
     * @return: 
     */
    on = (event, callback) => {
        // let currentTool = Tools[this.selectedToolName]
        let currentTool = this.currentTool
        if (currentTool[event]) currentTool[event].call(this, callback)
    }
    /**
     * @description: 遍历工具事件
     * @param {type} 
     * @return: 
     */
    _bindEvent = () => {
        // 获取当前工具
        let currentTool = Tools[this.selectedToolName]()
        if (currentTool) {
            // 得到当前工具中的事件类型
            const events = Object.keys(currentTool)
            if (events.length > 0) {
                events.forEach(event => {currentTool[event].call(this)})
            }
        }
        this.currentTool = currentTool
    }
    /**
     * @description: 重置实例
     * @param {type} 
     * @return: 
     */
    resetEntity = (entity) => {
        this.viewer.entities.remove(entity)
    }
}