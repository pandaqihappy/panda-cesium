import { ImageryLayer } from './layer';
import { SceneAPI } from '../instance/sence';
export interface CesiumApi extends ImageryLayer {
    $viewer: object;
    $option: CesiumOpt;
    sence: SceneAPI;
}
export interface CesiumOpt {
    maps: Array<string>;
    geoJson: Array<object>;
    clockViewModel: object;
}
