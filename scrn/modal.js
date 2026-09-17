 /*global document, console */

/*PANTALLAS DE MODAL, LOS ELEMENTOS DEL MODAL YA EXISTEN EN EL HTML
 Y SE CARGAN AL ABRIR EL PROGRAMA. SU APARICIÓN SE CONTROLA POR MEDIO DE ESTAS
 FUNCIONES, ALGUNAS NO SE EXPORTAN DEBIDO A QUE SU ÚNICA FUNCIÓN ES ESTAR EN UN
 EVENT LISTENER*/

export {
    mostrarPantallaCarga,
    ocultarPantallaCarga,
    mostrarPantallaError,
    mostrarPantallaExito,
    obtenerDatosPagoIndividual, 
    mostrarConfirmarPagar, 
    ocultarModalConfirmarPagar,
    mostrarPantallaNotificacion
};

import { Base, doc, getDoc} from "./firebase.js";
import { obtenerPrecioAdministrativo } from "./obtenerPrecios.js"; 
import { escribirTablaDetallesPagoUnico } from "./controlesDetallesPagoUnico.js";
import { establecerNumeroDePago, numeroPago } from "./verificarPago.js";
import { determinarTipoPagoYdeuda, validarArrayDatosTabla } from "./controlesEfectuarPago.js";
import { numberAformatoMontos } from "./utilidades.js";
import { contenedoresAbonos } from "./mensualidad.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";

function mostrarPantallaCarga(){
    document.getElementById("PantallaCargaFondo").style.display = "block";
}

function ocultarPantallaCarga(){
    document.getElementById("PantallaCargaFondo").style.display = "none";
}

function mostrarPantallaError(cadena){
    document.getElementById("PantallaErrorFondo").style.display = "block";
    document.getElementById("mensajeErrorGeneral").innerHTML = cadena;
}

function mostrarConfirmarPagar(){

    let formularioInvalido = validarArrayDatosTabla();

    if(formularioInvalido){
        return;
    }

    determinarTipoPagoYdeuda();
    document.getElementById("modalConfirmarPagar").style.display = "block";
}

function ocultarModalConfirmarPagar(){
    document.getElementById("modalConfirmarPagar").style.display = "none";
}


function ocultarPantallaError(){
    document.getElementById("PantallaErrorFondo").style.display = "none";
}

function mostrarPantallaExito(cadena){
    document.getElementById("PantallaExitoFondo").style.display = "block";
    document.getElementById("mensajeExito").textContent = cadena;
}

function ocultarPantallaExito(){
    document.getElementById("PantallaExitoFondo").style.display = "none";
}

function mostrarPantallaDatosPagoUnico(){
    document.getElementById("PantallaDatosPago").style.display = "block";
}

function ocultarPantallaDatosPagoUnico(){
    document.getElementById("PantallaDatosPago").style.display = "none";
}

function ocultarPantallaCuentaAbonosRepresentante(){
    document.getElementById("pantallaCuentaAbonosRepresentante").style.display = "none";
}


async function obtenerDatosPagoIndividual(){
    let documentoDePago = await getDoc(doc(Base, "pagos", numeroPago));
    await obtenerPrecioAdministrativo();
    escribirTablaDetallesPagoUnico(documentoDePago.data());
    console.log(documentoDePago.data());
    mostrarPantallaDatosPagoUnico();
}



function limpiarTablaCuentaAbonoRepresentanteModal(){

    let tabla = document.getElementById("tablaDetallesCuentaAbonos");

    while(tabla.rows.length >= 2){
        tabla.lastChild.remove();
    }

}

function mostrarPantallaNotificacion(cadena){

    document.getElementById("PantallaNotificacionFondo").style.display = "block";
    document.getElementById("mensajeNotificacion").textContent = cadena;
    
}

function ocultarPantallaNotificacion(){

    document.getElementById("PantallaNotificacionFondo").style.display = "none";

}

function escribirTablaCuentaAbonoRepresentanteModal(){
    limpiarTablaCuentaAbonoRepresentanteModal();
    console.log(contenedoresAbonos);
    if(contenedoresAbonos.length == []){
        mostrarPantallaError("El representante no tiene contenedores de abono");
        return;
    }
    let tabla = document.getElementById("tablaDetallesCuentaAbonos");
    let nombreContenedor, monto, fila;
    for(let i = 0; i <= contenedoresAbonos.length - 1; i ++){
        nombreContenedor = document.createElement("td");
        monto = document.createElement("td");
        nombreContenedor.textContent = contenedoresAbonos[i][0];
        monto.textContent = numberAformatoMontos(contenedoresAbonos[i][2]);
        if(contenedoresAbonos[i][1] == "Bolívares") monto.textContent += " Bs";
        else monto.textContent += " $";
        fila = document.createElement("tr");
        fila.appendChild(nombreContenedor);
        fila.appendChild(monto);
        tabla.appendChild(fila);
    }
    document.getElementById("pantallaCuentaAbonosRepresentante").style.display = "block";
}

export function mostrarPantallaColisionesHashes(){

    mostrarPantalla("pantallaColisionesHashes");

}

function ocultarPantallaColisionesHashes(){

    ocultar("pantallaColisionesHashes");

}

document.getElementById("continuarDatosPagoUnico").addEventListener("click", ocultarPantallaDatosPagoUnico);
document.getElementById("continuarCuentaAbonosRepresentante").addEventListener("click", ocultarPantallaCuentaAbonosRepresentante);
document.getElementById("verCuentaAbonoRepresentanteMensualidad").addEventListener("click", escribirTablaCuentaAbonoRepresentanteModal);
document.getElementById("ContinuarExito").addEventListener("click", ocultarPantallaExito);
document.getElementById("ContinuarError").addEventListener("click", ocultarPantallaError);
document.getElementById("ContinuarNotificacion").addEventListener("click", ocultarPantallaNotificacion);
document.getElementById("cerrarTablaHashes").addEventListener("click", ocultarPantallaColisionesHashes);