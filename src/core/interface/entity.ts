export interface EntitybaseProps {
    id: string,
    name?: string,
    position: Array<number>, // [经度、纬度、高度]
    show?: boolean // 是否显示实例
    description?: string, // 可输入html节点
    distanceDisplayCondition?: Array<number> // 摄像机距离显示条件
    label?: string, // 文字
    orientation?: object // 实例自身方位
}

export interface GlbProps extends EntitybaseProps {
    url:string,
    hpr?:Array<number>, // [方向、倾斜度、旋转]
    // 绝对位置：NONE，贴地形：CLAMP_TO_GROUND，RELATIVE_TO_GROUND，高于地形：RELATIVE_TO_GROUND
    heightReference?:string,
    description?: string // 实体描述，可以是html
}

// 实例model接口
export interface ModelProps {
    uri?: string,
    minimumPixelSize?: number,
    maximumScale?: number,
    heightReference?: number,
    distanceDisplayCondition?: object
}

export type EntityPropsType = (entityAndProps:[object, object]) => [object, object];

// 实例model用户输入接口
export interface ModelInput {
    entityType: string,
    uri: string,
    minimumPixelSize?: number,
    maximumScale?: number,
    heightReference?: string,
    distanceDisplayCondition?: [number, number]
}