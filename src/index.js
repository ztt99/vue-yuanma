import { initMixin } from './init'
import {renderMixin} from './render.js'
import { lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './initGlobalAPI/index.js'
import {stateMixin} from './state.js'
function Vue (options){
    this._init(options)
}
stateMixin(Vue)
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)  //合并api

export default Vue