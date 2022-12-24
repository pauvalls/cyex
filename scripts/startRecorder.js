let commandList =[];
let element
let inputType= false;
let clicked = () => {
console.log("clicado")
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
    this.element= element;

    macro(data)
};

let checkInput =() =>{
    if(commandList.length!==0){
        if(inputType){
            if(this.element.type==="text" || this.element.type==="number"){
            console.log(this.element.value)
                commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.clear().type('${this.element.value}');`)
            }
            if(this.element.type==="radio"){
                commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.check()`)
            }
        }
        else{
            console.log("ha entrado aqui alguna vez")
            commandList[commandList.length-1] =commandList[commandList.length-1].concat(`.click();`)
        }
    }
    inputType = false;
}

macro = (line) =>{
    if(commandList.length === 0){
        commandList.push(`cy.visit('${window.location.href}')`)
        commandList.push(line)
    }
    else{
        commandList.push(line)
    }
}

function getDomPath(el) {
    var stack = [];
    while ( el.parentNode != null ) {
        //console.log(el.nodeName);
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
document.addEventListener('click', clicked)