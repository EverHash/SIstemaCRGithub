/*global document, console */

import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { verDetallesReporte } from "./reporteEdiciones.js";
import { crearCeldaConIcono, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export let arrayFechasConsultar;

export function entrarReporteEdiciones(){

    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("mainContainerReporteEdiciones").style.display = "block";

}

export function atrasReporteEdiciones(){

    document.getElementById("mainContainerReporteEdiciones").style.display = "none";    
    document.getElementById("mainContainerSelectorTipoReportesRepresentante").style.display = "block";
    limpiarFormularios();
}

export function formularioInvalido(){

    let dia = document.getElementById("SeleccionarDiaReporteEdiciones").selectedIndex;

    let anno = document.getElementById("SeleccionarAnnoReporteEdiciones").value;

    let mes = document.getElementById("SeleccionarMesReporteEdiciones").selectedIndex;
    
    if(anno == ""){

        ocultarPantallaCarga();
        mostrarPantallaError("Inserte el año a consultar");
        return true;

    }

    if(mes == 0){

        ocultarPantallaCarga();
        mostrarPantallaError("Inserte el mes a consultar");
        return true;

    }

    if(dia == 0){

        ocultarPantallaCarga();
        mostrarPantallaError("Inserte el día a consultar");
        return true;

    }

    return false;

}

export function obtenerArrayFechasConsultar(){

    arrayFechasConsultar = [];

    let dia = document.getElementById("SeleccionarDiaReporteEdiciones").selectedIndex;

    let anno = document.getElementById("SeleccionarAnnoReporteEdiciones").value;

    let mes = document.getElementById("SeleccionarMesReporteEdiciones").selectedIndex;

    let cadena;

    if(dia == 32){

        for(let i = 1; i <= 31; i++){

            cadena = "";

            if(i <= 9) cadena += "0" + i;
            else cadena += i.toString();
            
            cadena += "/";

            if(mes <= 9) cadena += "0" + mes;
            else cadena += mes.toString();

            cadena += "/" + anno;

            arrayFechasConsultar.push(cadena);

        }

        console.log(arrayFechasConsultar);

        return;

    }

    cadena = "";

    if(dia <= 9) cadena += "0" + dia;
    else cadena += dia.toString();
            
    cadena += "/";

    if(mes <= 9) cadena += "0" + mes;
    else cadena += mes.toString();

    cadena += "/" + anno;

    arrayFechasConsultar.push(cadena);


}

export function dibujarTablaEdiciones(lista){

    let col1;
    let col2;
    let col3;
    let col4;
    let col5;
    let col6;

    let arrayCeldas;

    let tabla = document.getElementById("tablaListaReportes");

    for(let i = 0; i <= lista.length - 1; i++){

        col1 = crearCeldaConTexto(lista[i].nombreRepresentante);
        col2 = crearCeldaConTexto(lista[i].cedulaRepresentante);
        col3 = crearCeldaConTexto(lista[i].tipoEdicion);
        col4 = crearCeldaConIcono("rsrcs/eye.png");
        col5 = crearCeldaConTexto(lista[i].numeroReporte);
        col6 = crearCeldaConTexto(lista[i].fecha);

        col4.children[0].addEventListener("click", verDetallesReporte);
        col4.children[0].style.width = "24px";
        col4.children[0].style.height = "24px";

        arrayCeldas = [];

        arrayCeldas.push(col1);
        arrayCeldas.push(col2);
        arrayCeldas.push(col3);
        arrayCeldas.push(col4);
        arrayCeldas.push(col5);
        arrayCeldas.push(col6);

        tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

    }

}

function limpiarFormularios(){

    document.getElementById("SeleccionarDiaReporteEdiciones").selectedIndex = 0;

    document.getElementById("SeleccionarAnnoReporteEdiciones").value = "";

    document.getElementById("SeleccionarMesReporteEdiciones").selectedIndex = 0;

    limpiarFilasTabla("tablaListaReportes", 1);

    document.getElementById("contenedorTablaReportesEdiciones").style.display = "none";
}



export function escribirTablaDatosReporte(reporte){

    let col1;
    let col2;
    let col3;
    let col4;

    let numero = 1;

    let tabla = document.getElementById("tablaDetallesReporte");

    let arrayCeldas = [];

    if(reporte.tipoEdicion == "Abono"){

        while(reporte.hasOwnProperty("cambio" + numero)){

            arrayCeldas = [];

            col1 = crearCeldaConTexto("N/A");
            col2 = crearCeldaConTexto("Abono");
            col3 = crearCeldaConTexto(reporte["cambio" + numero][0]); //ANTERIOR
            col4 = crearCeldaConTexto(reporte["cambio" + numero][1]); //NUEVO

            arrayCeldas.push(col1);
            arrayCeldas.push(col2);
            arrayCeldas.push(col3);
            arrayCeldas.push(col4);

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

            numero++;

        }

        return;
    }

    if(reporte.tipoEdicion.includes("Convenio")){

        while(reporte.hasOwnProperty("cambio" + numero)){

            arrayCeldas = [];

            col1 = crearCeldaConTexto(reporte["cambio" + numero][0]);
            col2 = crearCeldaConTexto("Convenio");
            col3 = crearCeldaConTexto(reporte["cambio" + numero][1]); //ANTERIOR
            col4 = crearCeldaConTexto(reporte["cambio" + numero][2]); //NUEVO

            arrayCeldas.push(col1);
            arrayCeldas.push(col2);
            arrayCeldas.push(col3);
            arrayCeldas.push(col4);

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

            numero++;

        }

        return;

    }

    if(reporte.tipoEdicion == "Variables"){

        while(reporte.hasOwnProperty("cambio" + numero)){

            arrayCeldas = [];

            col1 = crearCeldaConTexto("N/A");
            col2 = crearCeldaConTexto("Variables");
            col3 = crearCeldaConTexto(reporte["cambio" + numero][1]); //ANTERIOR
            col4 = crearCeldaConTexto(reporte["cambio" + numero][2]); //NUEVO

            arrayCeldas.push(col1);
            arrayCeldas.push(col2);
            arrayCeldas.push(col3);
            arrayCeldas.push(col4);

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

            numero++;

        }

        return;        

    }

    if(reporte.tipoEdicion == "Recibo Eliminado"){

        while(reporte.hasOwnProperty("cambio" + numero)){

            arrayCeldas = [];

            col1 = crearCeldaConTexto("N/A");
            col2 = crearCeldaConTexto("Variables");
            col3 = crearCeldaConTexto(reporte["cambio" + numero][0]); //ANTERIOR
            col4 = crearCeldaConTexto(reporte["cambio" + numero][1]); //NUEVO

            arrayCeldas.push(col1);
            arrayCeldas.push(col2);
            arrayCeldas.push(col3);
            arrayCeldas.push(col4);

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

            numero++;

        }

        return;        

    }

}

export function mostrarModalDetallesReporte(){

    document.getElementById("PantallaDatosReporte").style.display = "block";

}