define(["require", "exports", "cesium", "../utils/index", "lodash"], function (require, exports, cesium_1, index_1, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._setLabelStyle = exports._selectHeightReference = exports._handleHeadingPitchRoll = exports.addEntityToDataSource = exports.setBillboardProps = exports.setBoxProps = exports.setLabelProps = exports.setOrientationProps = exports.setGlbProps = exports.getEntityById = exports.setBaseProps = exports.createEntity = void 0;
    // 创建实例
    function createEntity(inputProps) {
        let { id } = inputProps;
        const entity = new cesium_1.Entity({ id });
        let props = lodash_1.cloneDeep(inputProps);
        return [entity, props];
    }
    exports.createEntity = createEntity;
    // 添加基础数据
    function setBaseProps(entityAndProps) {
        let [entity, props] = entityAndProps;
        let { id, name, position, description, show } = props;
        if (position instanceof Array && position.length > 1) {
            entity.position = index_1.transformCart3Position(position);
        }
        else {
            index_1.warn('position not the right type or position.lentgh less than 1');
        }
        entity.name = name || entity.name || '';
        if (show)
            entity.show = show;
        // entity.show = show && show
        return [entity, props];
    }
    exports.setBaseProps = setBaseProps;
    // 通过id获取数据
    function getEntityById(id) {
        let cm = this;
        const entities = cm.$viewer.entities;
        let entity = entities.getById(id);
        return entity;
    }
    exports.getEntityById = getEntityById;
    // 添加glb属性
    function setGlbProps(entityAndProps) {
        let cm = this;
        let modelsUrlCache = cm.CACHE.modelsUrlCache;
        let [entity, props] = entityAndProps;
        let model;
        // 默认model设置
        const defualtModel = {
            // uri: entity.model.uri || '',
            minimumPixelSize: 128,
            maximumScale: 20000,
        };
        if (!entity.model) {
            entity.model;
        }
        // 设置
        if (props.model) {
            let model = props.model;
            let { distanceDisplayCondition, heightReference, url, minimumPixelSize, maximumScale } = model;
            if (url) {
                defualtModel.uri = modelsUrlCache[url];
            }
            // 设置显示条件
            if (distanceDisplayCondition && distanceDisplayCondition.length === 2) {
                let [minDistance, maxDistance] = distanceDisplayCondition;
                defualtModel.distanceDisplayCondition = new cesium_1.DistanceDisplayCondition(minDistance, maxDistance);
            }
            // 设置实例与地形关系
            if (heightReference) {
                defualtModel.heightReference = _selectHeightReference(heightReference);
            }
            // 实例最小显示大小
            if (minimumPixelSize) {
                defualtModel.minimumPixelSize = minimumPixelSize;
            }
            // 实例最大显示大小
            if (maximumScale) {
                defualtModel.maximumScale = maximumScale;
            }
        }
        entity.model = Object.assign(entity.model, defualtModel);
        return [entity, props];
    }
    exports.setGlbProps = setGlbProps;
    // 设置实例方向
    function setOrientationProps(entityAndProps) {
        let [entity, props] = entityAndProps;
        let { hpr, position } = props;
        // let { position } = entity
        let orientation;
        let headingPitchRoll;
        // 如果有旋转角度数据，则进行数据转换
        if (hpr) {
            headingPitchRoll = _handleHeadingPitchRoll(hpr);
            if (position) {
                if (position instanceof Array) {
                    position = index_1.transformCart3Position(position);
                }
                else {
                    position = entity.position;
                }
                if (typeof position === 'object') {
                    orientation = cesium_1.Transforms.headingPitchRollQuaternion(position, headingPitchRoll);
                    console.log('orientation', orientation);
                }
                else {
                    index_1.warn('position not the right type');
                }
            }
            else {
                index_1.warn('has no position');
            }
        }
        entity.orientation = orientation;
        // 通过位置、倾斜、旋转、指向确定实例在地球中的方位
        return [entity, props];
    }
    exports.setOrientationProps = setOrientationProps;
    // 添加label
    function setLabelProps(entityAndProps) {
        let [entity, props] = entityAndProps;
        let labelOptions = {};
        if (!entity.label) {
            entity.label = labelOptions;
        }
        if (props.label) {
            let { text, font, style, outlineWidth, } = props.label;
            if (text)
                labelOptions.text = text;
            if (font)
                labelOptions.font = font;
            if (style)
                labelOptions.style = _setLabelStyle(style); // fill or fillAndOutline or outline
            if (outlineWidth)
                labelOptions.outlineWidth = outlineWidth;
        }
        entity.label = Object.assign(entity.label, labelOptions);
        return [entity, props];
    }
    exports.setLabelProps = setLabelProps;
    // 添加盒子
    function setBoxProps(entityAndProps) {
        let [entity, props] = entityAndProps;
        return [entity, props];
    }
    exports.setBoxProps = setBoxProps;
    // 添加广告牌
    function setBillboardProps(entityAndProps) {
        let cm = this;
        let imagesUrlCache = cm.CACHE.imagesUrlCache;
        let [entity, props] = entityAndProps;
        let { billboard } = props;
        let defaultBillboard = {
            show: false
        };
        if (!entity.billboard) {
            entity.billboard = defaultBillboard;
        }
        if (billboard) {
            let { url, width, height, show } = billboard;
            defaultBillboard.show = show || false;
            if (url)
                defaultBillboard.image = imagesUrlCache[url];
            if (width)
                defaultBillboard.width = width;
            if (height)
                defaultBillboard.height = height;
            entity.billboard = Object.assign(entity.billboard, defaultBillboard);
        }
        return [entity, props];
    }
    exports.setBillboardProps = setBillboardProps;
    // 添加实例到实例数据源中
    function addEntityToDataSource(entityAndProps) {
        let [entity, props] = entityAndProps;
        let entities = this.$viewer.entities;
        entities.add(entity);
    }
    exports.addEntityToDataSource = addEntityToDataSource;
    //用航向、俯仰和横滚表示的旋转。
    function _handleHeadingPitchRoll(hpr) {
        let [heading, pitch, roll] = hpr;
        // 配置模型的三维方向
        heading = cesium_1.Math.toRadians(heading); // 航向
        let headingPitchRoll = new cesium_1.HeadingPitchRoll(heading, pitch, roll); //用航向、俯仰和横滚表示的旋转。
        return headingPitchRoll;
    }
    exports._handleHeadingPitchRoll = _handleHeadingPitchRoll;
    // 设置实体与地形关系
    function _selectHeightReference(select) {
        switch (select) {
            case 'CLAMP_TO_GROUND':
                return cesium_1.HeightReference.CLAMP_TO_GROUND;
                break;
            case 'RELATIVE_TO_GROUND':
                return cesium_1.HeightReference.RELATIVE_TO_GROUND;
                break;
            default:
                return cesium_1.HeightReference.NONE;
        }
    }
    exports._selectHeightReference = _selectHeightReference;
    // 设置babel样式
    function _setLabelStyle(style) {
        switch (style) {
            case 'fill':
                return cesium_1.LabelStyle.FILL;
            case 'fillAndOutline':
                return cesium_1.LabelStyle.FILL_AND_OUTLINE;
            case 'outline':
                return cesium_1.LabelStyle.OUTLINE;
            default:
                return cesium_1.LabelStyle.FILL;
        }
    }
    exports._setLabelStyle = _setLabelStyle;
    // 设置字体位置
    function _setVerticalOrigin(position) {
        switch (position) {
            case 'top':
                return cesium_1.VerticalOrigin.TOP;
            case 'bottom':
                return cesium_1.VerticalOrigin.BOTTOM;
            case 'center':
                return cesium_1.VerticalOrigin.CENTER;
            case 'baseline':
                return cesium_1.VerticalOrigin.BASELINE;
            default:
                return cesium_1.VerticalOrigin.TOP;
        }
    }
});
