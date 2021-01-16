import { initState } from './state'
import { compileToFunctoin } from './compile/index.js'
import { mountComponent, callHook } from './lifecycle.js'
import { mergeOptions } from './utils/index'
import { nextTick } from './utils/next-tick'
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this 
        vm.$options = mergeOptions(vm.constructor.options, options)
        callHook(vm, 'beforeCreate')
        initState(vm)
        callHook(vm, 'created')
        let el = vm.$options.el
        if (el) {
            vm.$mount(el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)

        let template = vm.$options.template
        //如果el存在并且不存在template
        if (!template && el) {
            template = el.outerHTML
        }
        const render = compileToFunctoin(template)()
        vm.$options.render = render
        mountComponent(vm, el)
    }
    Vue.prototype.$nextTick = nextTick
}