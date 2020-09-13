import point from './coordinatePoint';
import distance from './distance';
import area from './area';
declare const _default: {
    normal: () => {
        click: (callback: any) => void;
        dbclick: (callback: any) => void;
        mousemove: (callback: any) => void;
    };
    point: typeof point;
    distance: typeof distance;
    area: typeof area;
};
export default _default;
