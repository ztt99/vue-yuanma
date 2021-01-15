import {mergeOptions} from '../utils/index.js'
 
export function initGlobalAPI (Vue){
    // 整合了所有的全局api  
    Vue.options = {}

    Vue.mixin = function(mixin){
        this.options = mergeOptions(this.options,mixin)
    }
    Vue.mixin({
        beforeCreate(){
        }
    })
    Vue.mixin({
        beforeCreate(){
        }
    })

}