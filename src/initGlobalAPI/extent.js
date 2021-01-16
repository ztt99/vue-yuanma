import { mergeOptions } from "../utils/index.js"

export default function initExtent(Vue) {
    let cid = 0
    let cidarr = []
    Vue.extent = function (extentOptions) {
        let Sub
        if(cidarr.includes(cid)) return Sub
        const Super = this
        Sub = function VueCompoment(options) {
            this._init(options)

        }
        Sub.cid = cid++
        cidarr.push(Sub.cid)
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