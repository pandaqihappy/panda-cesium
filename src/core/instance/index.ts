/*
 * @Author: your name
 * @Date: 2020-04-11 17:55:49
 * @LastEditTime: 2020-04-12 13:38:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \npm-link-module\index.js
 */
import { CesiumOpt } from '../interface/index'

import { initMixin } from './init'


function PdCesium (id:string, option:CesiumOpt) {
    this._init(id, option)
}

initMixin(PdCesium)

export default PdCesium