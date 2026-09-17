/*global document */

import { paginaSiguienteInscripcion, 
         paginaAnteriorInscripcion, 
         agregarPaginaEstudianteInscripcion,
         listaDeCursos,
         respuestaNOFormularioImprimir,
         respuestaSIFormularioImprimir, 
         selectorRepresentanteRegistrado,
         selectorAbonoRepresentanteNoRegistrado,
         continuarNuevoIngreso} from "./controlesInscripcion.js";

import {continuarProcesoInscripcion} from "./controlesInscripcion.js";

import {ContinuarTicketInscribir} from "./recibos.js";

import {pdfInscripcion} from "./impresion.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";
import { buscarEstudiantesProsecucion, buscarRepresentanteNuevoIngreso, buscarRepresentanteProsecucion, continuarRepresentanteNuevoIngreso, continuarRepresentanteProsecucion } from "./inscribir.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaInscripcionNuevoIngreso").addEventListener("click", pegarContenidoPortapapeles);
document.getElementById("pegarCedulaCopiadaInscripcionProsecucion").addEventListener("click", pegarContenidoPortapapeles);

//CONTROLES AÑO ESCOLAR NUEVO INGRESO

document.getElementById("flechaArribaAnnoEscolarNuevoIngreso").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarNuevoIngreso").addEventListener("click", flechaAbajoAnnoEscolar);

//CONTROLES AÑO ESCOLAR SELECCIONAR ESTUDIANTES PROSECUCION

document.getElementById("flechaArribaAnnoEscolarEstudiantesProsecucion").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarEstudiantesProsecucion").addEventListener("click", flechaAbajoAnnoEscolar);

//CONTROLES AÑO ESCOLAR A INSCRIBIR PROSECUCION

document.getElementById("flechaArribaAnnoEscolarProsecucion").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarProsecucion").addEventListener("click", flechaAbajoAnnoEscolar);

//BOTONES INFERIORES DE NAVEGACION

document.getElementById("inscribirSiguiente").addEventListener("click", paginaSiguienteInscripcion);
document.getElementById("inscribirAtras").addEventListener("click", paginaAnteriorInscripcion);
document.getElementById("inscribirAgregar").addEventListener("click", agregarPaginaEstudianteInscripcion);


//BOTON CONTINUAR CUESTIONARIO REPRESENTANTE NUEVO INGRESO

document.getElementById("botonCuestionarioInscripcionNuevoIngreso").addEventListener("click", continuarNuevoIngreso);

//SELECTOR REPRESENTANTE REGISTRADO

document.getElementById("representanteRegistradoInscripcion").addEventListener("change", selectorRepresentanteRegistrado);

//SELECTOR REPRESENTANTE NO REGISTRADO ABONO

document.getElementById("representanteNoRegistradoAbonoInscripcion").addEventListener("change", selectorAbonoRepresentanteNoRegistrado);

//BUSCAR REPRESENTANTE NUEVO INGRESO

document.getElementById("consultarRepresentanteNuevoIngreso").addEventListener("click", buscarRepresentanteNuevoIngreso);

//ENTRAR A FORMULARIO DE INSCRIPCION DESDE BUSCAR REPRESENTANTE NUEVO INGRESO

document.getElementById("botonContinuarRepresentanteNuevoIngreso").addEventListener("click", continuarRepresentanteNuevoIngreso);

//BUSCAR REPRESENTANTE PROSECUCION

document.getElementById("consultarRepresentanteProsecucion").addEventListener("click", buscarRepresentanteProsecucion);

//BOTON CONTINUAR PROSECUCION (PASAR A BUSCAR LOS ESTUDIANTES A PROSECUCION)

document.getElementById("botonContinuarRepresentanteProsecucion").addEventListener("click", continuarRepresentanteProsecucion);

//BUSCAT ESTUDIANTES PROSECUCION

document.getElementById("buscarEstudiantesProsecucion").addEventListener("click", buscarEstudiantesProsecucion);

//SELECTOR DE GRADO DE INSTRUCCION

document.getElementById("Grado-De-Instruccion").addEventListener("change", listaDeCursos);

//BOTON INSCRIBIR

document.getElementById("inscribir-Estudiante").addEventListener("click", continuarProcesoInscripcion);

//RECIBO

document.getElementById("ContinuarTicketInscripcion").addEventListener("click", ContinuarTicketInscribir);
document.getElementById("imprimirTicketInscripcion").addEventListener("click", pdfInscripcion);

//BOTONES DE IMPRIMIR FORMULARIO

document.getElementById("imprimirFormulario").addEventListener("click", respuestaSIFormularioImprimir);
document.getElementById("NOimprimirFormulario").addEventListener("click", respuestaNOFormularioImprimir);
