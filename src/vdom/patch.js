export function patch(oldVnode, vnode) {
// 第一次不进行对比，初始化的时候将真实dom渲染成虚拟dom
    const isRealElement = oldVnode.nodeType
    if (isRealElement===1) {
        const oldElm = oldVnode
        const parentElm = oldElm.parentNode  //body
        let el = createElm(vnode)
        parentElm.insertBefore(el, oldVnode.nextSibling) //把新的节点放到原来节点的后面
        oldElm.remove()
        return el

    }else{
        // 更新时 用老的虚拟节点与新的进行对比，将不同的地方更新真实的dom

        // 如果tag不同，那么直接替换
        if(oldVnode.tag !== vnode.tag){
         return  oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
        }
        // 如果标签一样 tag都是undefined
        if(!oldVnode.tag){
         if(oldVnode.text !== vnode.text){ 
            return oldVnode.el.textContent = vnode.text
         }
        }
        // 标签一样 比对属性 和 儿子  标签一样直接复用
        let el = vnode.el = oldVnode.el
        updateProperties(vnode, oldVnode.data)

        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []

        // 儿子的比较
        if(oldChildren.length && newChildren.length){    // 3、 老的有儿子，新的也有儿子s
            updateChildren(oldChildren,newChildren,el)
        }else if(oldChildren.length){  // 1、 老的有儿子，新的没有儿子
            el.innerHTML = ''
        }else{  // 2、 老的没儿子，新的有儿子
            for(let i = 0 ; i < newChildren.length;i++){
                let child = newChildren[i]
                el.appendChild(createElm(child))
            }
        }
     

       
       
    }
}
function isSameVnode(oldVnode,newVnode){
    return (oldVnode.tag == newVnode.tag )  && (oldVnode.key == newVnode.key)
}

function makeIndexByKey(children){
    let map = {}
    children.forEach((item,index)=>{
        if(item.key){
            map[item.key] = index
        }
    })
    return map
}
function updateChildren(oldChildren,newChildren,parent){
  
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length-1
    let oldEndVnode = oldChildren[ oldChildren.length-1]

    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length-1
    let newEndVnode = newChildren[ newChildren.length-1]
    let map = makeIndexByKey(oldChildren) //把旧的key记录下来
    while(oldStartIndex <=oldEndIndex &&  newStartIndex <= newEndIndex){
        if(!oldStartVnode){
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if(!oldEndVnode){
            oldStartVnode = oldChildren[--oldEndIndex]
        }else if(isSameVnode(oldStartVnode,newStartVnode)){  // 如果前面的节点没有改变
            patch(oldStartVnode,newStartVnode)  //更新属性
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else if(isSameVnode(oldEndVnode,newEndVnode)){ //如果后面的节点没有改变
            patch(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldStartVnode,newEndVnode)){  //老的头和新的尾比较
            patch(oldStartVnode,newEndVnode)
            // 当前元素插到当前元素下一个的前面
            parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldEndVnode,newStartVnode)){ //老的尾和新的头比较
            patch(oldEndVnode,newStartVnode)
            parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else{  //都不相等需要暴力比对
            // 如果这个新节点在老节点中没有 那就直接插入
            let moveIndex = map[newStartVnode.key]
            if(moveIndex==undefined){
                parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
            }else {
                let moveVnode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null
                parent.insertBefore(createElm(moveVnode),oldStartVnode.el) //insertBefore会将元素直接移动走，所以先将这个moveIndex的老元素中设置为null
                patch(moveVnode,newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]

        }
    }
    if(oldStartIndex <= oldEndIndex){  //将剩余的老的节点删除
        for(let i = oldStartIndex;i<= oldEndIndex;i++){
            if(oldChildren[i]){
                parent.removeChild(oldChildren[i].el)
            }
        } 
    }
    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex;i<= newEndIndex;i++){
            parent.appendChild(createElm(newChildren[i]))
            //新元素前面元素与旧元素不一致，那么newChildren 中存在newEndIndex+1，因为是从后往前比对的，
            // 如果newChildren[newEndIndex + 1] == null 说明是从前往后比对的
            let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1] 
            parent.insertBefore( createElm(newChildren[i]),ele ) //insertBefore 当第二个值有的时候会把心的值当道第二个值得前面，如果第二个值是null  insertBefore 相当于appendChild
        }
    }

}


function createElm(vnode) {
    let { tag, children, key, data, text } = vnode

    if (typeof tag === 'string') {
        vnode.el = document.createElement(vnode.tag)
        updateProperties(vnode)
        children?.forEach(child => {  //递归创建儿子节0点，将儿子节点当道父节点
            return vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode,oldProps={}) {
    let newProps = vnode.data || {},
        el = vnode.el
        // 如果新节点上没有 老节点有 移除老节点上的属性
    for(let key in oldProps){
        if(!newProps[key]){
            el.removeAttribute(key)  //移除老节点属性
        }
    }

    let newStyle = newProps.style
    let oldStyle = oldProps.style
    // 新的中没有 老的中有 则删除老的
    for(let key in oldStyle){
        if(!newStyle[key]){
            el.style[key] = ''
        }
    }
    // 新的有 那就正常加载老的上就行
    for (let key in newProps) {
        if (key === 'style') {
            for (let stylekey in newProps.style) {
                el.style[stylekey] = newProps.style[stylekey]
            }
        }else if(key === 'class'){
            el.className = newProps[key]
        }else{
            el.setAttribute(key,newProps[key])
        }
    }
}