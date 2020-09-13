declare function areaEvent(): {
    click: () => void;
    dbclick: () => void;
    mousemove: () => void;
    rightClick: () => void;
    destroy(viewer: any): void;
};
export default areaEvent;
