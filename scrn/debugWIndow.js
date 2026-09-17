/*global document */

export function mostrarVariable(variable, nombreVariable, idObjecto){

    let idElemento = "variable" + idObjecto;

    if(elementoNoExiste(idElemento)) crearElementoDepuracion(idElemento);

    let elemento = document.getElementById(idElemento);

    elemento.textContent = nombreVariable + ": " + variable;
    
}

function crearElementoDepuracion(idElemento){

    let variable = document.createElement("span");
    variable.id = idElemento;

    let ventanaDebug = document.getElementById("debugWindow");

    ventanaDebug.appendChild(variable);
    ventanaDebug.appendChild(document.createElement("br"));

}

function elementoNoExiste(idElemento){

    let elemento = document.getElementById(idElemento);

    if(elemento == null) return true;
    else return false;

}