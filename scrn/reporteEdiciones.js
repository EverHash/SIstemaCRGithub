/*global console, document */

import { arrayFechasConsultar, dibujarTablaEdiciones, escribirTablaDatosReporte, formularioInvalido, mostrarModalDetallesReporte, obtenerArrayFechasConsultar } from "./controlesReporteEdiciones.js";
import { Base, collection, doc, getDoc, getDocs, orderBy, query, where } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export async function obtenerReportesEdiciones(){

    try {
    mostrarPantallaCarga();
    
    document.getElementById("contenedorTablaReportesEdiciones").style.display = "none";

    limpiarFilasTabla("tablaListaReportes", 1);

    let arrayReportes = [];

    if(formularioInvalido()) return;

    obtenerArrayFechasConsultar();

    let obtenerReportesEdicion;

    let coleccionEdiciones = await collection(Base, "reportesEdicion/");

    let documentosEdicion;

    let flagVacio = true;

    for(let i = 0; i <= arrayFechasConsultar.length - 1; i++){

        obtenerReportesEdicion = await query(coleccionEdiciones, orderBy("numeroReporte", "asc"), where("fecha", "==", arrayFechasConsultar[i]));
        documentosEdicion = await getDocs(obtenerReportesEdicion);
        documentosEdicion.forEach((documento) => {
          arrayReportes.push(documento.data());
          flagVacio = false;
        });   


    }

    if(flagVacio){

        ocultarPantallaCarga();
        mostrarPantallaError("No hay ediciones para este día");
        return;

    }

    dibujarTablaEdiciones(arrayReportes);

    document.getElementById("contenedorTablaReportesEdiciones").style.display = "block";

    ocultarPantallaCarga();   
    } catch (error) {
        console.log(error);
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }

}

export async function verDetallesReporte(){

    try {
        
        mostrarPantallaCarga();
    
        limpiarFilasTabla("tablaDetallesReporte", 1);
    
        let numeroReporte = this.parentNode.parentNode.children[4].textContent;
    
        let reporte = await getDoc(doc(Base, "reportesEdicion", numeroReporte));
    
        escribirTablaDatosReporte(reporte.data());
    
        mostrarModalDetallesReporte();
    
        ocultarPantallaCarga();
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }


}