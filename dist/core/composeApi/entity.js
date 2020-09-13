define(["require", "exports", "../instance/entity", "lodash", "../utils/index"], function (require, exports, entity_1, lodash_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initEntityComposeApi = void 0;
    function initEntityComposeApi(cm) {
        cm = Object.assign(cm, {
            addEntity,
            showEntity
        });
    }
    exports.initEntityComposeApi = initEntityComposeApi;
    // 设置实例参数
    const setEntityProps = lodash_1.flowRight(entity_1.setOrientationProps, entity_1.setBillboardProps, entity_1.setGlbProps, entity_1.setLabelProps, entity_1.setBaseProps);
    // 添加glb文件
    const addEntity = lodash_1.flowRight(entity_1.addEntityToDataSource, setEntityProps, entity_1.createEntity);
    // 更新实例
    const updateEntity = lodash_1.flowRight(setEntityProps, entity_1.getEntityById);
    // 是否显示实例
    function showEntity(id, show) {
        let cm = this;
        let entities = cm.$viewer.entities;
        let entity = entities.getById(id);
        // 如果数据源中查找到实例
        if (entity) {
            entity_1.setBaseProps([entity, { show }]);
            // 如果id为
        }
        else if (id === 'entity') {
            entities.show = show;
        }
        else {
            index_1.warn('has no entity or id');
        }
    }
});
// 2d3d实例转换
// function changeModelAndBillboard (type) {
// }
