
let callbacks = []
let waiting = false

function flushCallback(){
    while(callbacks.length){
        let cb = callbacks.pop()
        cb()
    }
    waiting = false

}
let timerFunc;

if(Promise){
    timerFunc = ()=>{
        Promise.resolve().then(flushCallback)
    }
}else if(MutationObserver){
    // 监听dom变化 ，如果dom变化执行flushCallback
    let observe = new MutationObserver(flushCallback)
    let textNode = document.createTextNode(1)
    observe.observe(textNode,{characterData:true})
    timerFunc = ()=>{
        textNode.textContent = 2
    }
}else if(setImmediate){
    timerFunc = ()=>{
        setImmediate(flushCallback)
    }
}else{
    setTimeout(flushCallback)
}
export function nextTick(cb){
    // 只要没有添加完就继续添加
    callbacks.push(cb)
    if(!waiting){
        waiting = true
        // 已经放到宏任务中了，等到callbacks  push完毕后才会执行cb
        // setTimeout会最后执行 这样最后只有一个setTimeout 
        timerFunc()
    }
    
}