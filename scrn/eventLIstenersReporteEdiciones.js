/*global document */

import { atrasReporteEdiciones } from "./controlesReporteEdiciones.js"; //REPRESENTANTES FECHA
import { atrasReportesColegioAnno, atrasReportesColegioFecha, atrasReportesRepresentantesCedula, atrasTipoReportesColegio, atrasTipoReportesRepresentante, atrasTiposPrimariasReportesEdicion, entrarReportesColegioAnno, entrarReportesColegioFecha, entrarReportesRepresentantesCedula, entrarReportesRepresentantesFecha, entrarTipoReporteColegio, entrarTipoReporteRepresentante, entrarTiposPrimariosReportesEdicion } from "./controlesTiposReportesEdicion.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { obtenerReportesEdiciones } from "./reporteEdiciones.js";
import { consultarReportesFechaColegio } from "./reportesColegioFecha.js";
import { consultarReportesCedula } from "./reportesRepresentantesCedula.js";
import { buscarReporteVariablesAnno } from "./reporteVariablesAnno.js";

//NAVEGACION (TIPO PRIMARIO)

document.getElementById("reporteEdiciones").addEventListener("click", entrarTiposPrimariosReportesEdicion);
document.getElementById("atrasTiposReportes").addEventListener("click", atrasTiposPrimariasReportesEdicion);

document.getElementById("reportesColegio").addEventListener("click", entrarTipoReporteColegio);
document.getElementById("reportesRepresentantes").addEventListener("click", entrarTipoReporteRepresentante);

//NAVEGACION TIPOS REPRESENTANTES

document.getElementById("atrasTipoReportesRepresentante").addEventListener("click", atrasTipoReportesRepresentante); //ATRAS

document.getElementById("reportesPorFechasRepresentante").addEventListener("click", entrarReportesRepresentantesFecha); //FECHA
document.getElementById("atrasReporteEdiciones").addEventListener("click", atrasReporteEdiciones); //ATRAS FECHAS

document.getElementById("reportesPorCedulaRepresentante").addEventListener("click", entrarReportesRepresentantesCedula); //CEDULA
document.getElementById("atrasReporteEdicionesRepresentanteCedula").addEventListener("click", atrasReportesRepresentantesCedula);

//NAVEGACION TIPOS COLEGIO

document.getElementById("atrasTipoReportesColegio").addEventListener("click", atrasTipoReportesColegio); //ATRAS
document.getElementById("reportesPorFechasColegio").addEventListener("click", entrarReportesColegioFecha); //COLEGIO FECHAS
document.getElementById("atrasReporteEdicionesVariablesFecha").addEventListener("click", atrasReportesColegioFecha); //ATRAS COLEGIO FECHA
document.getElementById("reportesPorAnnoColegio").addEventListener("click", entrarReportesColegioAnno);
document.getElementById("atrasReporteEdicionesVariablesAnno").addEventListener("click", atrasReportesColegioAnno); //ATRAS COLEGIO ANNO

//PORTAPAPELES CEDULA EDICIONES REPRESENTANTE

document.getElementById("pegarCedulaCopiadaEdicionRepresentanteCedula").addEventListener("click", pegarContenidoPortapapeles);

//BUSCAR REPORTES (POR FECHA) COLEGIO

document.getElementById("consultarReporteEdicionesVariablesFecha").addEventListener("click", consultarReportesFechaColegio);

//BUSCAR CAMBIOS ANUALES COLEGIO

document.getElementById("consultarReporteEdicionesVariablesAnual").addEventListener("click", buscarReporteVariablesAnno);


//BUSCAR REPORTES (POR FECHA) REPRE

document.getElementById("BotonConsultarReporteEdiciones").addEventListener("click", obtenerReportesEdiciones);

//BUSCAR REPORTES (POR CEDULA) REPRE

document.getElementById("consultarReporteEdicionesCedula").addEventListener("click", consultarReportesCedula);