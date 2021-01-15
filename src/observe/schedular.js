//调度的功能

import {nextTick } from '../utils/next-tick'
let queue = []
let has = { }

function flushSchedularQueue(){
    queue.forEach(watcher=>watcher.run()) 
    queue = []
    has = { }
}
/**
 * 假设存在属性name，如果多次给name赋值，就会多次触发set，就会多次触发notify 就会触发watcher的update 就会触发geteers
 * 就会渲染dom，也就是说修改了相同的属性，但是还是多次触发没有意义
 */
export function queueWatcher(watcher){
    let id = watcher.id  //现在只new 了一个watcher 所以id都是0
    if(has[id]== null){
        has[id] = true
        queue.push(watcher)
        // vue.nextTick = promise / mutationObserver / setImmediate / setTimeout  优雅降级
        // 将更新dom放到宏任务中，同步代码执行完毕，再执行宏任务
        nextTick(flushSchedularQueue)
    }
     
}