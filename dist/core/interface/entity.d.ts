export interface EntitybaseProps {
    id: string;
    name?: string;
    position: Array<number>;
    show?: boolean;
    description?: string;
    distanceDisplayCondition?: Array<number>;
    label?: string;
    orientation?: object;
}
export interface GlbProps extends EntitybaseProps {
    url: string;
    hpr?: Array<number>;
    heightReference?: string;
    description?: string;
}
export interface ModelProps {
    uri?: string;
    minimumPixelSize?: number;
    maximumScale?: number;
    heightReference?: number;
    distanceDisplayCondition?: object;
}
export declare type EntityPropsType = (entityAndProps: [object, object]) => [object, object];
export interface ModelInput {
    entityType: string;
    uri: string;
    minimumPixelSize?: number;
    maximumScale?: number;
    heightReference?: string;
    distanceDisplayCondition?: [number, number];
}
