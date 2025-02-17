

/**
 * 
 * @param {string} html 
 * @returns {HTMLElement}
 * @example
 * this is string "<p>hello</p>"  // this is html element <p>hello</p>
 */



var allDataElements = []
document.body.onload = (() => {

   /**
    * this function is store all the elements of data , in a const of allDataElements
    */ 
    function getAllDataElements() {
        allDataElements = Array.from(document.querySelectorAll('[data]'))
        .map((eleData)=>elementFromHtml(eleData.outerHTML))
    }
    getAllDataElements();
    getAllTempElements();
    htmlLogic(document.body)
})


    /**
     *  
     * @param {html element } element 
     * it will start from the element u give her and go thro each child and implement the html logic on it
     */
    function htmlLogic(element) {
        let children = Array.from(element.children)
        children.forEach((child) => {
            try {
                if (child.getAttribute("loop")) {
                    loopEle(child)
                }
                if (child.getAttribute("data")) {
                    dataAtr(child)
                }
                if (child.getAttribute("code") == "" || child.getAttribute("code")) {
                    codeAtr(child)
                }
                if (child.getAttribute("if")) {
                    ifAtr(child)
                }
                if (child.getAttribute("styling")) {
                    styleAtr(child)
                }
                if (child.getAttribute("inside") == "" || child.getAttribute("inside")) {
                    insideAtr(child)
                }
                if (child.localName.substr(-1) == ".") {
                    getTemp(child)
                }
                if (child.getAttribute("text")) {
                    textAtr(child)
                }
            } catch (err) {
                console.log(err)
                child.innerHTML = "<div style='background:#f003;color:#f00;padding:4px 10px;width:fit-content;border-radius:8px;'>" + err.message + "</div>"
            }
            htmlLogic(child)
        })
    }








/**
 * 
 * @param {html element} ele 
 * you give this html element that have a data att on it and it will generate a data from the data att
 * 
 */

function dataAtr(ele) {
    if (ele.getAttribute("name")) {
        function getInner(){
            allDataElements.forEach((dataEle)=>{
                if(dataEle.getAttribute("name")==ele.getAttribute("name")){
                    ele.innerHTML=dataEle.innerHTML
                }
            })

        }

        let data = window[ele.getAttribute("name")] = new Object(eval(` new Object(${ele.getAttribute("data")})`))



        window[ele.getAttribute("name")].set=function(item,value){
            if(typeof(value)=='function'){
                eval(`this.${item.split(".").join(".")} = ${JSON.stringify(value(eval(`this.${item.split(".").join(".")}`)))}`)
            }else{
                eval(`this.${item.split(".").join(".")} = ${JSON.stringify(value)}`)
            }
            ele.setAttribute('data',JSON.stringify(window[ele.getAttribute("name")]))
            data=window[ele.getAttribute("name")]
            getInner();
            replaceAll()
            htmlLogic(ele);
        }

        replaceAll()
        function replaceAll() {
            for (const key in data) {
                if(key!="set"){
                    ele.innerHTML = ele.innerHTML.replaceAll("_" + key + "_", data[key])
                }
            }
        }
    } else {
        let data = eval(` new Object(${ele.getAttribute("data")})`)
        for (const key in data) {
            if (Array.isArray(data[key])) {
                ele.innerHTML = ele.innerHTML.replaceAll("_" + key + "_", "[" + data[key].map(m => "'" + m + "'") + "]")
            } else {
                ele.innerHTML = ele.innerHTML.replaceAll("_" + key + "_", data[key])
            }
        }
    }

}


/**
 * 
 * @param {html element} ele 
 * you give this html element that have a code att on it and it will render the content of the element as code
 * @example 
        codeAtr(<p code>1 + 1</p>) // <p>2</p>
 */
function codeAtr(ele) {
    if (ele.getAttribute("code")) {
        let val = eval(ele.getAttribute("code"))
        ele.innerHTML = val ? val : val == 0 ? 0 : ''
    } else {
        let content = ele.innerHTML
        let val = eval(content)
        ele.innerHTML = val ? val : val == 0 ? 0 : ''
    }
}

/**
 * 
 * @param {html element} ele 
 * you give this html element that have a code att on it and it will render the content of the element as code
 * @example 
        codeAtr(<p text="hello"></p>) // <p>hello</p>
 */
function textAtr(ele) {
    let content = ele.getAttribute("text")
    ele.innerHTML = content
}

/**
 * 
 * @param {html element} ele 
 * you give this html element that have a if att on it and it will render only if the content of if is true
 * @example 
        (<p if="1==2">hello</p>) // it wont render the p tag bc the if condition is not correct
 */


function ifAtr(ele) {
    let con = ele.getAttribute("if")
    if (!eval(con)) {
        ele.style.display = "none"
    }
}

/**
 * 
 * @param {html element} ele 
 * you give this html element that have a -style att on it and it will return an element with style that -style att have
 * @example 
        (<p -style="{color:'red'}">hello</p>) // hello <= the color of the p tag is  red
 */


function styleAtr(ele) {
    let style = ele.getAttribute("styling")
    Object.assign(ele.style, eval(`new Object(${style})`));
}

/**
 * 
 * @param {html element} ele 
 * you give this html element that have a inside att on it and it will return a the element but any thing inside _(any)_ will render as code
 *  
 * @example 
        <p inside>_(1+2)_hello</p> // <p inside> 3 hello </p>
 */

function insideAtr(ele) {
    ele.innerHTML = ele.innerHTML.replaceAll("_(", "{{{")
        .replaceAll(")_", "}}}")
    ele.innerHTML = ele.innerHTML.replaceAll(/{{{[^/}}}]+}}}/g, (f) =>  eval(f.slice(3, -3)))
}

/**
 * 
 * @param {html element} ele 
 * you give this html element that have a loop and name  att on it and it will loop inside the array in the in att and return for each item in the array an element
 *  
 * @example 
        <div loop='color' in="['red','blue']"><p -for='color' item></p></div> //  <div> <p>red</p> <p>blue</p> </div>
 */

function loopEle(ele) {
    let _loop = ele.getAttribute("loop")
    let _In = ele.getAttribute("in")
    let array = window[_loop] = new Object(eval(` new Object(${_In})`))
    result = ""
    for (let i = 0; i < array.length; i++) {
        let getTexts = ele.querySelectorAll("[item]")
        getTexts.forEach((text) => {
            if (text.getAttribute("of") == _loop) {
                if (text.getAttribute("item")) {
                    text.innerHTML = eval("array[" + i + "]." + text.getAttribute("item"))
                } else {
                    text.innerHTML = eval("array[" + i + "]")
                }
            }

        })
        result += ele.innerHTML;
        result = result.replaceAll("i_" + _loop + "", i)
        result = result.replaceAll("v_" + _loop + "", array[i])
    }

    ele.innerHTML = result;
}
/**
 * get all the tags of temp.create and hide them from
 */

let allTemps = Array.from(document.getElementsByTagName("temp.create"))
allTemps.forEach((ele) => {
    ele.style.display = 'none'
})
allTemps= elementFromHtml( "<div>" + allTemps.map(m=>m.outerHTML).join(" ")+"</div>")
allTemps=allTemps.getElementsByTagName("temp.create")




var getTempsElements = []
var getTempsElementsUI = []
function getAllTempElements() {
    getTempsElements = Array.from(document.getElementsByTagName('temp.create'))
    .map((eleData)=>elementFromHtml(eleData.outerHTML))
    getTempsElementsUI=  Array.from(myUi.children)
    .map((eleData)=>elementFromHtml(eleData.outerHTML))
}




/**
 * 
 * @param {html element} ele 
 * here u give this function a temp and it will replace it with the temp.create element , it pass data too
 */



function getTemp(ele) {
    tempName = ele.localName.substr(0, ele.localName.length - 1);
    let allTemps;
    if (ele.getAttribute('from') == "handy-ui") {
        allTemps = Array.from(myUi.children)
        allTemps=getTempsElementsUI;
    } else {
        allTemps = Array.from(document.getElementsByTagName("temp.create"))
        allTemps= elementFromHtml( "<div>" + allTemps.map(m=>m.outerHTML).join(" ")+"</div>")
        allTemps=Array.from(allTemps.getElementsByTagName("temp.create"))
        allTemps=getTempsElements;
    }

    



    allTemps.forEach((temp) => {
        if (temp.getAttribute("name") == tempName) {
            let tempInnerHTML = elementFromHtml(temp.outerHTML)
            let notAllowed = { class: "", data: "", from: "", name: "" }
            ele.getAttributeNames().forEach(att => {
                tempInnerHTML.querySelectorAll("[target]")?.forEach((target) => {
                    let targetName = target.getAttribute("target")
                        if (att.substr(0, targetName.length + 1) == targetName + ".") {
                            if(att.substr(targetName.length + 1)=="class"){
                                target.setAttribute(att.substr(targetName.length + 1),target.getAttribute("class")+" "+ ele.getAttribute(att))
                            }else{
                                target.setAttribute(att.substr(targetName.length + 1),ele.getAttribute(att))
                            }
                        }
                })
            })
            ele.innerHTML = tempInnerHTML.innerHTML.replaceAll('_children_', ele.innerHTML)
            dataAtr(ele)
        }
    })

}

/**
 * 
 * return and element from html string
 */



function elementFromHtml(html) {
    const template = document.createElement("template")
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}




