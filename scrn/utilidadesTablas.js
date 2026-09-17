/*global document */

export {crearCeldaConInput,
        crearCeldaConSelect,
        crearCeldaConTexto,
        crearCeldaConIcono,
        crearTRconCeldasApendadas,
        limpiarFilasTabla,
        crearTHconTexto,
        crearTHconIcono};

import {seleccionarMesPagarInscripcion, validacionMontoConCorreccionPagoTotalBSInscripcion, validacionMontoConCorreccionPagoTotalUSDInscripcion} from "./controlesInscripcionMensualidad.js";
import { validacionMontoEstiloBDV } from "./utilidades.js";

import { cambiarMontoDolaresDescuentoInscripcion, seleccionarDescuentoSelectInscripcion } from "./inscripcion/aritmetica.js";

function crearTHconTexto(texto){
    let celda = document.createElement("th");
    celda.textContent = texto;

    return celda;
}

function crearTHconIcono(fuente){

    let celda = document.createElement("th");

    let img = document.createElement("img");

    img.src = fuente;
    img.style.width = "18px";
    img.style.height = "18px";

    celda.appendChild(img);

    return celda;

}

function crearCeldaConTexto(texto){

    let celda = document.createElement("td");
    celda.textContent = texto;

    return celda;

}

function crearCeldaConIcono(fuente){

    let celda = document.createElement("td");

    let img = document.createElement("img");

    img.src = fuente;
    img.style.width = "18px";
    img.style.height = "18px";

    celda.appendChild(img);

    return celda;

}

function crearCeldaConInput(tipo, valor, cadenaNombreFuncion){

    let celda = document.createElement("td");

    let input = document.createElement("input");

    input.type = tipo;

    if(tipo != "checkbox") input.value = valor;
    else{
        input.checked = valor;
        input.className = "checkbox";
    } 

    input.value = valor;

    input = aplicarEventListener(input, cadenaNombreFuncion);

    celda.appendChild(input);

    return celda;

}

function crearTRconCeldasApendadas(arrayCeldas){

    let tr = document.createElement("tr");

    for(let i = 0; i <= arrayCeldas.length - 1; i++){

        tr.appendChild(arrayCeldas[i]);

    }

    return tr;

}

function crearCeldaConSelect(arrayOpciones, cadenaNombreFuncion, indice){

    let celda = document.createElement("td");
    let select = document.createElement("select");

    for(let i = 0; i <= arrayOpciones.length - 1; i++) select.appendChild(document.createElement("option"));
    
    for(let i = 0; i <= arrayOpciones.length - 1; i++) select.children[i].textContent = arrayOpciones[i];
    
    if(typeof(indice) != "number") indice = 0;

    select.selectedIndex = indice;

    select = aplicarEventListener(select, cadenaNombreFuncion);

    celda.appendChild(select);

    return celda;
}

function aplicarEventListener(elemento, cadenaNombreFuncion){

    //EVENT LISTENERS DE USO GENERAL

    if(cadenaNombreFuncion == "validacionMontoEstiloBDV") elemento.addEventListener("input", validacionMontoEstiloBDV);

    //EVENT LISTENERS DE INSCRIPCION

    if(cadenaNombreFuncion == "validacionMontoConCorreccionPagoTotalUSDInscripcion") elemento.addEventListener("input", validacionMontoConCorreccionPagoTotalUSDInscripcion);
    if(cadenaNombreFuncion == "validacionMontoConCorreccionPagoTotalBSInscripcion") elemento.addEventListener("input", validacionMontoConCorreccionPagoTotalBSInscripcion);
    if(cadenaNombreFuncion == "cambiarMontoDolaresDescuentoInscripcion") elemento.addEventListener("change", cambiarMontoDolaresDescuentoInscripcion);
    if(cadenaNombreFuncion == "seleccionarMesPagarInscripcion") elemento.addEventListener("change", seleccionarMesPagarInscripcion);
    if(cadenaNombreFuncion == "seleccionarDescuentoSelectInscripcion") elemento.addEventListener("change", seleccionarDescuentoSelectInscripcion);

    return elemento;


}

function limpiarFilasTabla(IdTabla, indiceInicio){

  let tabla = document.getElementById(IdTabla);

  while(tabla.rows.length > indiceInicio){
    tabla.removeChild(tabla.lastChild);
  }

}