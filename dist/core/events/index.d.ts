export default class Event extends Screen {
    handler: any;
    selectedToolName: any;
    toolEntity: any;
    currentTool: any;
    cm: any;
    viewer: any;
    selectedEntity: any;
    constructor(cm: any);
    _initEvent: (viewer: any) => void;
    _createEvent: () => void;
    _destroyEvent: () => void;
    /**
     * @description: 工具栏选择
     * @param {String} selectedToolName
     * @return:
     */
    selectTool: (selectedToolName: any) => void;
    /**
     * @description: 绑定事件，对外接口
     * @param {String} event事件类型，如click、dbclick等
     * @param {Function} callback 回调函数，用于将数据传递给外部业务进行处理
     * @return:
     */
    on: (event: any, callback: any) => void;
    /**
     * @description: 遍历工具事件
     * @param {type}
     * @return:
     */
    _bindEvent: () => void;
    /**
     * @description: 重置实例
     * @param {type}
     * @return:
     */
    resetEntity: (entity: any) => void;
}
