define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initRegister = void 0;
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
    function initRegister(cm) {
        const CACHE = {
            modelsUrlCache: {},
            imagesUrlCache: {},
            geoJsonsUrlCache: {}
        };
        cm.CACHE = CACHE;
        const option = cm.$option;
        if (option.register) {
            let register = option.register;
            handleRegister.call(cm, register);
        }
        cm.addKml = addKml;
        cm.addJson = addGeoJson;
    }
    exports.initRegister = initRegister;
    // 注册glb模型文件，geoJson文件，image文件
    function handleRegister(register) {
        let cm = this;
        let { models, images, geoJsons } = register;
        _setCacheMap(models, cm.CACHE.modelsUrlCache);
        _setCacheMap(images, cm.CACHE.imagesUrlCache);
        _setCacheMap(geoJsons, cm.CACHE.geoJsonsUrlCache, addGeoJson.bind(cm));
    }
    // 注册工具函数
    function _setCacheMap(props, cache, fn) {
        if (props && props.length > 0) {
            props.map(prop => {
                let { name, url } = prop;
                cache[name] = url;
                if (fn)
                    fn(name);
            });
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
        };
        opt = Object.assign({}, defaultOpt, opt);
        // Load geocache points of interest from a KML file
        // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
        const geocachePromise = cesium_1.KmlDataSource.load('../../../static/kml/eiffel-tower-flyto.kml', opt);
        geocachePromise.then((dataSource) => {
            this.$viewer.dataSources.add(dataSource);
        });
    }
    /**
     * @description: 引入json
     * @param {geoJson} json路径
     * @param {opt} json配置
     * @return:
     */
    function addGeoJson(jsonName, opt) {
        const cm = this;
        let neighborhoods;
        let url;
        let name;
        url = cm.CACHE.geoJsonsUrlCache[jsonName];
        let defaultOpt = {
            stroke: cesium_1.Color.AQUA,
            fill: cesium_1.Color.VIOLET.withAlpha(0),
            strokeWidth: 3,
        };
        if (opt) {
            opt = Object.assign({}, defaultOpt, opt);
        }
        else {
            opt = defaultOpt;
        }
        cesium_1.GeoJsonDataSource.load(url, opt).then(dataSource => {
            dataSource.name = jsonName;
            cm.$viewer.dataSources.add(dataSource);
            neighborhoods = dataSource.entities;
            // 获取实例数组
            const neighborhoodEntities = dataSource.entities.values;
            for (let i = 0; i < neighborhoodEntities.length; i++) {
                const entity = neighborhoodEntities[i];
                if (cesium_1.defined(entity.polygon)) {
                    // 设置实例的名字
                    entity.name = entity.properties.neighborhood;
                    // 将实例多边形属性中的区域设置为随机颜色
                    // entity.polygon.material = Color.fromRandom({
                    //     red: 0.1,
                    //     maximumGreen: 0.5,
                    //     minimumBlue: 0.5,
                    //     alpha: 0.6
                    // });
                }
            }
        });
    }
});
