import { HeadingPitchRoll, HeightReference, Entity, LabelStyle } from 'cesium';
import { GlbProps } from '../interface/entity';
export declare function createEntity(inputProps: GlbProps): (GlbProps | Entity)[];
export declare function setBaseProps(entityAndProps: any): [object, object];
export declare function getEntityById(id: string | number): object;
export declare function setGlbProps(entityAndProps: any): [object, object];
export declare function setOrientationProps(entityAndProps: any): [object, object];
export declare function setLabelProps(entityAndProps: any): [object, object];
export declare function setBoxProps(entityAndProps: any): [object, object];
export declare function setBillboardProps(entityAndProps: any): [object, object];
export declare function addEntityToDataSource(entityAndProps: any): void;
export declare function _handleHeadingPitchRoll(hpr: Array<number>): HeadingPitchRoll;
export declare function _selectHeightReference(select: any): HeightReference;
export declare function _setLabelStyle(style: any): LabelStyle;