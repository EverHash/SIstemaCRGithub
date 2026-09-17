/*global document */

import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { verSiEsNumeroEntero } from "./utilidades.js";


export function mostrarVerificarTicket(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-VerificarTicket").style.display = "block";
}

export function atrasVerificarTicket(){
    document.getElementById("main-container-VerificarTicket").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("tablaReciboVerificar").style.display = "none";
    document.getElementById("numeroTicket").value = "";
    document.getElementById("imprimirReciboVerificarTicket").style.display = "none";
}

export function mostrarTablaTicket(){

    document.getElementById("tablaReciboVerificar").style.display = "flex";
    document.getElementById("imprimirReciboVerificarTicket").style.display = "flex";

}

export function ocultarPantallaTicket(){

    document.getElementById("tablaReciboVerificar").style.display = "none";
    document.getElementById("imprimirReciboVerificarTicket").style.display = "none";

}

export function numeroTicketInvalido(numeroTicket){

    if(verSiEsNumeroEntero(numeroTicket) == 1){
      ocultarPantallaCarga();
      mostrarPantallaError("Ingrese únicamente digitos");
      return true;
    }

    return false;

}