import {mergeOptions} from '../utils/index.js'
import initExtent from './extent.js'
 
export function initGlobalAPI (Vue){
    // 整合了所有的全局api  
    Vue.options = {}

    Vue.mixin = function(mixin){
        this.options = mergeOptions(this.options,mixin)
    }

    initExtent(Vue)
    Vue.options._base = Vue
    Vue.options.components = {}
    Vue.component = function (id,definition){
        definition.name = definition.name || id
        // new definition().$mount()
        definition = this.options._base.extent(definition)
        Vue.options.components[id] = definition
    }

}