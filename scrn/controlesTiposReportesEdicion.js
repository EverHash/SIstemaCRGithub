/*global document */

import { mediadorColegioFecha } from "./controlesReportesColegioFecha.js";
import { mediadorReportesCedula } from "./controlesReportesRepresentantesCedula.js";
import { mediadorVariablesAnno } from "./controlesReporteVariablesAnno.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";

let flagRepresentante = false;

//NAVEGACION TIPOS PRIMARIOS (SALIR Y ENTRAR DEL MODULO)
//NAVEGACION TIPOS PRIMARIOS (SALIR Y ENTRAR DEL MODULO)
//NAVEGACION TIPOS PRIMARIOS (SALIR Y ENTRAR DEL MODULO)

export function entrarTiposPrimariosReportesEdicion(){

    ocultar("main-container-postLogin");
    mostrarPantalla("mainContainerTiposReportes");

}

export function atrasTiposPrimariasReportesEdicion(){

    ocultar("mainContainerTiposReportes");
    mostrarPantalla("main-container-postLogin");

}

//NAVEGACION TIPOS PRIMARIOS (PASAR AL SIGUIENTE TIPO)
//NAVEGACION TIPOS PRIMARIOS (PASAR AL SIGUIENTE TIPO)
//NAVEGACION TIPOS PRIMARIOS (PASAR AL SIGUIENTE TIPO)

export function entrarTipoReporteColegio(){

    ocultar("mainContainerTiposReportes");
    mostrarPantalla("mainContainerSelectorTipoReportesColegio");

}

export function entrarTipoReporteRepresentante(){

    ocultar("mainContainerTiposReportes");
    mostrarPantalla("mainContainerSelectorTipoReportesRepresentante");

}

//NAVEGACION TIPOS DE REPORTES REPRESENTANTES
//NAVEGACION TIPOS DE REPORTES REPRESENTANTES
//NAVEGACION TIPOS DE REPORTES REPRESENTANTES

export function atrasTipoReportesRepresentante(){

    ocultar("mainContainerSelectorTipoReportesRepresentante");
    mostrarPantalla("mainContainerTiposReportes");

}

export function entrarReportesRepresentantesFecha(){

    ocultar("mainContainerSelectorTipoReportesRepresentante");
    mostrarPantalla("mainContainerReporteEdiciones");

}

//LA FUNCION DE ATRAS DE REPORTES REPRESENTATE FECHA YA ESTA PUESTA EN EL MODULO DE REPORTE ANTERIOR

export function entrarReportesRepresentantesCedula(){

    ocultar("mainContainerSelectorTipoReportesRepresentante");
    mostrarPantalla("mainContainerReporteEdicionesRepresentanteCedula");    

}

export function atrasReportesRepresentantesCedula(){

    ocultar("mainContainerReporteEdicionesRepresentanteCedula");    
    mostrarPantalla("mainContainerSelectorTipoReportesRepresentante");

    let mediador = new mediadorReportesCedula();

    mediador.limpiarGUI();

}

//NAVEGACION TIPOS DE REPORTE COLEGIO
//NAVEGACION TIPOS DE REPORTE COLEGIO
//NAVEGACION TIPOS DE REPORTE COLEGIO

export function atrasTipoReportesColegio(){

    ocultar("mainContainerSelectorTipoReportesColegio");
    mostrarPantalla("mainContainerTiposReportes");

}

export function entrarReportesColegioFecha(){

    ocultar("mainContainerSelectorTipoReportesColegio");
    mostrarPantalla("mainContainerReporteEdicionesVariablesFecha");

}

export function atrasReportesColegioFecha(){

    ocultar("mainContainerReporteEdicionesVariablesFecha");
    mostrarPantalla("mainContainerSelectorTipoReportesColegio");

    let mediador = new mediadorColegioFecha();

    mediador.limpiarGUI();

}


export function entrarReportesColegioAnno(){

    ocultar("mainContainerSelectorTipoReportesColegio");
    mostrarPantalla("mainContainerReporteEdicionesVariablesAnno");

}

export function atrasReportesColegioAnno(){

    ocultar("mainContainerReporteEdicionesVariablesAnno");
    mostrarPantalla("mainContainerSelectorTipoReportesColegio");
    
    let mediador = new mediadorVariablesAnno();

    mediador.limpiarGUI();

}
