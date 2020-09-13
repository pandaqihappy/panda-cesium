export interface SceneAPI {
    resetScene: Function;
    requestRender: Function;
    scenePostUpdateListener: Function;
    scenePreRenderListener: Function;
}
export declare function initSence(cm: any): void;
