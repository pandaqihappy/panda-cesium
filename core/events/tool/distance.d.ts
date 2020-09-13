declare function distanceEvent(): {
    click: () => void;
    dbclick: () => void;
    mousemove: () => void;
    rightClick: () => void;
    destroy: (viewer: any) => void;
};
export default distanceEvent;
