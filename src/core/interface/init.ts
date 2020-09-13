import { ImageryLayer } from './layer'
import { SceneAPI } from '../instance/sence'

// 核心构造函数接口
export interface CesiumApi extends ImageryLayer {
    $viewer: object,
    $option: CesiumOpt,
    sence: SceneAPI
}

// 配置文件
export interface CesiumOpt {
    maps: Array<string>,
    geoJson: Array<object>,
    clockViewModel: object
}
