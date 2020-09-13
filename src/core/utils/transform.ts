import { Cartesian3 } from 'cesium'


export function transformCart3Position (position:Array<number>) {
   let [lon, lat, h] = position
   return Cartesian3.fromDegrees(lon, lat, h)
}