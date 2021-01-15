import { mergeOptions } from "../utils"

export default function initExtent(Vue) {
    Vue.extent = function (extentOptions) {
        const Super = this
        const Sub = function VueCompoment(options) {
            this._init(options)

        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        // vm.$options = mergeOptions(vm.constructor.options, options) 
        /** 
         * init中的
         * vm是当前sub的实例
         * vm.constructor.options 是Sub.options Sub.options 是Vue.options 和 extent传进来的
         * 相当于将全局的options 与实例的options储存在一起
         */
        Sub.options = mergeOptions(Super.options,extentOptions)

        return Sub
    }
}