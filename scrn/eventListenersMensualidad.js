/*global document */

import {marcarTodosLosMesesPagar, 
        marcarTodosLosEstudiantesConsultar, 
        entrarGestionarMensualidades, 
        entrarPagarMensualidad, 
        atrasPagosMensualidades, 
        atrasConsultarEstudiantes, 
        atrasMensualidades,
        MostrarTablaPagar} from "./controlesMensualidad.js";

import { buscarEstudiantesParaConsultar, consultarEstudiantes } from "./mensualidad.js";

import { ContinuarTicketMensualidad } from "./recibos.js";

import { pdfMensualidad } from "./impresion.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar, validacionMontoEstiloBDV } from "./utilidades.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("GestionMensualidades").addEventListener("click", entrarGestionarMensualidades);
document.getElementById("BotonPagarConfirmar").addEventListener("click", entrarPagarMensualidad);
document.getElementById("atrasPagosMensualidades").addEventListener("click", atrasPagosMensualidades);
document.getElementById("atrasMensualidades").addEventListener("click", atrasMensualidades);
document.getElementById("atrasConsultarEstudiantes").addEventListener("click", atrasConsultarEstudiantes);
document.getElementById("BotonPagar").addEventListener("click", MostrarTablaPagar);

//BOTONES DE CONSULTA

document.getElementById("BuscarEstudiantesConsultar").addEventListener("click", buscarEstudiantesParaConsultar);
document.getElementById("pegarCedulaCopiadaMensualidad").addEventListener("click", pegarContenidoPortapapeles);
document.getElementById("consultarEstudiantes").addEventListener("click", consultarEstudiantes);

//OTROS ELEMENTOS HTML

document.getElementById("pagar-todos-los-meses-estudiante-input").addEventListener("change", marcarTodosLosMesesPagar);
document.getElementById("marcarTodosLosEstudiantesConsultar").addEventListener("change", marcarTodosLosEstudiantesConsultar);
document.getElementById("flechaAbajoAnnoEscolarMensualidad").addEventListener("click", flechaAbajoAnnoEscolar);
document.getElementById("flechaArribaAnnoEscolarMensualidad").addEventListener("click", flechaArribaAnnoEscolar);




//RECIBO

document.getElementById("ContinuarTicketMensualidad").addEventListener("click", ContinuarTicketMensualidad);
document.getElementById("imprimirTicketMensualidad").addEventListener("click", pdfMensualidad);