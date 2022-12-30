commandList = typeof(commandList) === 'undefined' ? [] : commandList;
elementData = typeof(element) === 'undefined' ? '' : element;
inputType = typeof(inputType) === 'undefined' ? false : inputType;
var ultimoElementoClicado;
window.removeEventListener('click', clicked)
window.addEventListener('click', clicked)
window.addEventListener("click", function(event) {
    e = window.event;
    var element = e.target || e.srcElement;
    data = `cy.get('${getDomPath(element)}')`
    ultimoElementoClicado = data;
});
window.addEventListener("beforeunload", function(event) {
    e = window.event;
    var element = e.target || e.srcElement;
    data = `cy.get('${getDomPath(element)}')`
    checkInput();
    messageCommandList()
});


function clicked () {
    ultimoElementoClicado = event.target;
    checkInput();
    e = window.event;
    var element = e.target || e.srcElement;
    var data;
    data = `cy.get('${getDomPath(element)}')`
    if(element.id){
        data=`cy.get('#${element.id}')`
    }
    if(element.class){
        data=`cy.get('.${element.id}')`
    }
    inputType = element.nodeName === 'INPUT';
    elementData= element;
    macro(data)
    messageCommandList()
};
function messageCommandList(){
    chrome.runtime.sendMessage({text: commandList}, function(response) {
    if(typeof(commandList) === 'undefined') {
         commandList = response.text
        checkInput();
    }
    if(response !== 'undefined'){
        commandList = response
    }
    });
}
function checkInput (){
    const listSize = commandList.length;
    let lastElement = commandList[listSize - 1];

    if(listSize!==0){
        if(!lastElement.includes(";")){
            if(inputType){
                if(elementData.type==="text" || elementData.type==="number"){
                    if(elementData.value){
                        lastElement = lastElement.concat(`.clear().type('${elementData.value}');`)
                    }
                    else{
                        lastElement =lastElement.concat(`;`)
                    }
                }
                if(elementData.type==="radio"){
                    lastElement =lastElement.concat(`.check()`)
                }
            }
        else{
            lastElement =lastElement.concat(`.click();`)
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
