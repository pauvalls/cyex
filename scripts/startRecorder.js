commandList = typeof(commandList) === 'undefined' ? [] : commandList;
elementData = typeof(element) === 'undefined' ? '' : element;
inputType = typeof(inputType) === 'undefined' ? false : inputType;

window.addEventListener('click', clicked)

window.addEventListener("beforeunload", beforeunload)
function beforeunload(){
    e = window.event;
    var element = e.target || e.srcElement;
    data = `cy.get('${getDomPath(element)}')`
    inputType = element.nodeName === 'INPUT';
    elementData= element;
    checkInput();
    commandList.push(`cy.url().should('eq', '${window.location.href}');`)
    messageCommandList()
}
function clicked () {
    checkInput();
    e = window.event;
    var element = e.target || e.srcElement;
    var data;
    data = `cy.get('${getDomPath(element)}')`
    if(element.id){
        data=`cy.get('#${element.id}')`
    }
    if(element.class){
        data=`cy.get('.${element.class}')`
    }
    inputType = element.nodeName === 'INPUT';
    elementData= element;
    macro(data)
    messageCommandList()
};
function messageCommandList(){
    chrome.runtime.sendMessage({text: commandList}, function(response) {
        console.log(response)
        commandList = response

    })
}
function checkInput (){
    if(commandList.length!==0){
        if(!commandList[commandList.length-1].includes(";")){
            if(inputType){
                if(elementData.type==="text" || elementData.type==="number"){
                    if(elementData.value){
                    commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.clear().type('${elementData.value}');`)
                    }
                    else{
                        commandList[commandList.length-1] =commandList[commandList.length-1].concat(`;`)
                    }
                }
                if(elementData.type==="radio"){
                    commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.check()`)
                }
            }else{
                    commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.click();`)
            }
        }
    }
    inputType = false;
}

macro = (line) =>{
    if(commandList.length === 0){
        commandList.push(`cy.visit('${window.location.href}');`)
        commandList.push(line)
    }
    else{
        commandList.push(line)
    }
}

function getDomPath(el) {
    var stack = [];
    while ( el.parentNode != null ) {
        var sibCount = 0;
        var sibIndex = 0;
        for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
            var sib = el.parentNode.childNodes[i];
            if ( sib.nodeName == el.nodeName ) {
                if ( sib === el ) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if ( el.hasAttribute('id') && el.id != '' ) {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if ( sibCount > 1 ) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }

    return stack.slice(1).join(' > '); // removes the html element
}
