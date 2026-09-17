/*global document */

export function ocultar(elemento){

    document.getElementById(elemento).style.display = "none";

}

export function ocultarHTML(elemento){

    elemento.style.display = "none";

}

export function mostrarBlockHTML(elemento){

    elemento.style.display = "block";

}

export function mostrarFlex(idElemento){

    document.getElementById(idElemento).style.display = "flex";

}

export function mostrarBlock(elemento){

    document.getElementById(elemento).style.display = "block";    

}

export function mostrarPantalla(id){

    document.getElementById(id).style.display = "block";

}

export function limpiarInputText(id){

    document.getElementById(id).value = "";

}

export function consultarInputText(id){

    return document.getElementById(id).value;

}

export function consultarInputTextHTML(elemento){

    return elemento.value;

}

export function asignarValueInput(id, valor){

    document.getElementById(id).value = valor;

}

export function cambiarTextContent(id, valor){

    document.getElementById(id).textContent = valor;

}

export function obtenerTextContent(id){

    return document.getElementById(id).textContent;

}

export function obtenerTextContentHTML(elemento){

    return elemento.textContent;

}

export function borrarElementoHTML(elemento){

    elemento.remove();

}

export function obtenerElementoHTML(id){

    return document.getElementById(id);

}

export function obtenerSelectedIndex(id){

    return document.getElementById(id).selectedIndex;

}

export function reiniciarSelect(id){

    document.getElementById(id).selectedIndex = 0;

}

export function deshabilitarInput(id){

    document.getElementById(id).disabled = true;

}

export function habilitarInput(id){

    document.getElementById(id).disabled = false;

}

export function obtenerTextContentSelectedIndex(elemento, indice){

    //ESTA FUNCION RECIBE EL ELEMENTO EN SI

    let texto = elemento.options[indice].textContent;

    return texto;

}