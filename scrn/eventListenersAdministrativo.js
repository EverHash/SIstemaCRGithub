/*global document */

//WARNING: RECONSTRUCCION EN PROCESO
//FALTA ARREGLAR LA NUEVA NAVEGACION, PONER EL MODULO PARA PAGAR LAS DEUDAS DEL ADMINISTRATIVO
//Y ARREGLAR LAS FUNCIONES QUE HACEN LOS PAGOS NUEVOS


//ESTE DOCUMENTO CONTROLA UNICAMENTE LO RELACIONADO A LOS PAGOS ADMINISTRATIVOS

import {atrasPagosNuevosAdministrativos, 
        entrarSeleccionarRegistroRepresentantePagoAdministrativo,
        agregarPaginaAdministrativo,
        paginaAnteriorAdministrativo,
        paginaSiguienteAdministrativo,
        atrasSeleccionarRepresentanteAdministrativo,
        entrarPantallaDatosRepresentante,
        atrasIntroducirDatosRepresentanteAdministrativo,
        entrarPantallaFormularioAdministrativo,
        cambiarConceptoPagoAdministrativo,
        continuarConsultarPreciosAdministrativo,
        entrarPantallaConfirmarAdministrativo,
        atrasPantallaConfirmarAdministrativo,
        atrasConsultaPreciosAdministrativo,
        entrarPantallaPagoAdministrativo} from "./controlesAdministrativo.js";
import { ContinuarTicketAdministrativo } from "./recibos.js";
import { pdfPagoAdministrativo } from "./impresion.js";
 import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { consultarRepresentanteAdministrativo } from "./administrativo.js";

//BOTONES PANTALLA TIPO REPRESENTANTE ADMINISTRATIVO

document.getElementById("atrasRegistroRepresentanteAdministrativo").addEventListener("click", atrasSeleccionarRepresentanteAdministrativo);
document.getElementById("botonCuestionarioRegistroRepresentanteAdministrativo").addEventListener("click", entrarPantallaDatosRepresentante);

//PANTALLA DATOS REPRESENTANTE

document.getElementById("consultarRepresentanteAdministrativo").addEventListener("click", consultarRepresentanteAdministrativo);
document.getElementById("atrasIntroducirDatosRepresentanteAdministrativo").addEventListener("click", atrasIntroducirDatosRepresentanteAdministrativo);
document.getElementById("botonContinuarRepresentanteAdministrativo").addEventListener("click", entrarPantallaFormularioAdministrativo);

//ENTRAR A PANTALLA CONFIRMAR PAGO ADMINISTRATIVO

document.getElementById("botonContinuarConsultaPrecioAdministrativo").addEventListener("click", entrarPantallaConfirmarAdministrativo);

//NAVEGACION SELECCIONAR PAGOS ADMINISTRATIVOS

document.getElementById("PagosAdministrativos").addEventListener("click", entrarSeleccionarRegistroRepresentantePagoAdministrativo);

//NAVEGACION NUEVOS PAGOS ADMINISTRATIVOS

document.getElementById("atrasNuevosPagosAdministrativos").addEventListener("click", atrasPagosNuevosAdministrativos);

//NAVEGACION DEL NUEVO FORMULARIO

document.getElementById("pgSiguienteAdministrativo").addEventListener("click", paginaSiguienteAdministrativo);
document.getElementById("pgAgregarAdministrativo").addEventListener("click", agregarPaginaAdministrativo);
document.getElementById("pgAtrasAdministrativo").addEventListener("click", paginaAnteriorAdministrativo);

//ATRAS TABLA PRECIOS ADMINISTRATIVO

document.getElementById("atrasConsultaPrecioAdministrativo").addEventListener("click", atrasConsultaPreciosAdministrativo);

//ATRAS CONFIRMAR TABLA ADMINISTRATIVO

document.getElementById("atrasConfirmarConceptosAdministrativo").addEventListener("click", atrasPantallaConfirmarAdministrativo);

//ENTRAR A PAGAR

document.getElementById("botonConfirmarPagoAdministrativo").addEventListener("click", entrarPantallaPagoAdministrativo);

//BOTONES Y ELEMENTOS DE INTERACCION INTERNOS

document.getElementById("conceptoPagoAdministrativo").addEventListener("change", cambiarConceptoPagoAdministrativo);
document.getElementById("pagarAdministrativo").addEventListener("click", continuarConsultarPreciosAdministrativo);

//BOTONES DE RECIBO

document.getElementById("imprimirTicketAdministrativo").addEventListener("click", pdfPagoAdministrativo);
document.getElementById("ContinuarTicketAdministrativo").addEventListener("click", ContinuarTicketAdministrativo);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaPagosAdministrativos").addEventListener("click", pegarContenidoPortapapeles);