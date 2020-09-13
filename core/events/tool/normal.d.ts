/**
 * @description: 默认工具实现方法
 * @param {type}
 * @return:
 */
declare const normalEvent: () => {
    click: (callback: any) => void;
    dbclick: (callback: any) => void;
    mousemove: (callback: any) => void;
};
export default normalEvent;
