
import { paeseHTML } from './parse-html.js'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function compileToFunctoin(template) {
    let root = paeseHTML(template)
    //将AST语法树生成render函数
    // <div id='app'><p>hello {{name}}</p>hello</div>
    //_c('div',{id:"app"},_c('p',undefined,_v("hello" + _s(name)),_v('hello')))
    return function render() {
        let code =  generate(root)
        let renderFn = new Function(`with(this){ return ${code}}`)
        return renderFn
    }
}

function generate(el) {
    let code = `_c('${el.tag}',
     ${el.attrs.length ? geneProps(el.attrs) : 'undefined'},
     ${genChildren(el) ? genChildren(el) : ''})
     `

    return code
}
function genChildren(el) {

    let children = el.children
    if (children && children.length) {
        return children.map(c => gen(c)).join(',')
        // for(let i = 0 ; i < children.length;i++){
        //     children[i].type == 1 ? text += generate(children[i])+',' : text += `_v(${children[i].text})`+ ','
        // }
    } else {
        return false
    }
}
function gen(node) {
    if (node.type == 1) {
        return generate(node)
    } else {
        let text = node.text
        let tokens = []
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            index = match.index
            if(lastIndex < index){
                tokens.push(JSON.stringify( text.slice(lastIndex,index)))
            }
            // asas{{as}}asas{{as}}
            tokens.push(`_s(${match[1]})`)
            lastIndex = index +match[0].length
        }
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join('+')})`
    }
}
function geneProps(attrs) {
    let str = ''
    attrs.forEach(item => {
        if (item.name === 'style') {
            let obj = {}
            const [key, value] = item.value.split(':')
            obj[key] = value
            item.value = obj
        }
        str += `${item.name}:${JSON.stringify(item.value)},`
    })
    return `{${str.slice(0, -1)}}`
}




