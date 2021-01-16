
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

let currentParen
let root
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createAstElement(tagName,attrs){
    return {
        tag:tagName,
        type:ELEMENT_TYPE,
        parent:null,
        children:[],
        attrs
    }
}

function start(tagName,attrs){
   let ele =  createAstElement(tagName,attrs)
   if(!root) {
    root = ele
   }
   currentParen = ele
   stack.push(ele)
}
function chars(text){
    text =  text.replace(/\s/g,'')
    if(text){
        currentParen.children.push({
            text,
            type:TEXT_TYPE
        })
    }
}

function end(tagName){
 let ele =  stack.pop()
 currentParen  = stack[stack.length - 1]

 if(currentParen){
    ele.parent = currentParen
    currentParen.children.push(ele)
 }

}
export  function paeseHTML(html) {
     root = null
    while (html) {
        const textEnd = html.indexOf('<')
        if (textEnd === 0) {  //如果等于0那么是开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }

        

    }
    return root


    function advance(n) {
        html = html.substring(n)
    }

    function parseStartTag() {
        let start = html.match(startTagOpen)
        const parse = {
            tagName: start && start[1],
            attrs: []
        }
        advance(start && start[0].length)  //删除已经放到parse中的字符串
        let attrs, end;
        while ((attrs = html.match(attribute)) && !(end = html.match(startTagClose))) { //如果有属性，并且不是结束标签
            let obj = {
                name: attrs[1],
                value : attrs[3]
            }
            parse.attrs.push(obj)
            advance(attrs[0].length)
        }
        if (end = html.match(startTagClose)) {
            advance(end[0].length)
            return parse
        }
        return null

    }
}