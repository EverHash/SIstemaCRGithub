/*global document */

import { agregarPaginaPreinscribir, atrasConfirmarPreinscripcion, atrasConsultaUSDpreinscripcion, atrasFormularioPreinscripcion, atrasPreinscripcion, botonNOimprimirFormularioEstudiantePreinscripcion, botonSIimprimirFormularioEstudiantePreinscripcion, cambiarSelectCursosGradoInstruccion, continuarEntrarConfirmar, entrarFormularioPreinscripcion, entrarPantallaConsultaImprimirFormulario, entrarPantallaConsultaUSDpreinscripcion, entrarPantallaPagarPreinscripcion, entrarPreinscripcion, paginaAnteriorPreinscribir, paginaSiguientePreinscribir } from "./controlesPreinscripcion.js";
import { imprimirTicketPreinscripcion } from "./impresion.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { obtenerDatosRepresentantePreinscripcion } from "./preinscripcion.js";
import { continuarDocumentoDePagoPreinscripcion } from "./recibos.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";

//ENTRAR PREINSCRIPCION

document.getElementById("preinscripcion").addEventListener("click", entrarPreinscripcion);

//LAS FLECHAS DE ARRIBA Y ABAJO AÑO ESCOLAR (PANTALLA INICIAL DE CONSULTA DE PREINSCRIPCION)

document.getElementById("flechaArribaAnnoEscolarPreinscripcion").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarPreinscripcion").addEventListener("click", flechaAbajoAnnoEscolar);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaPreinscripcion").addEventListener("click", pegarContenidoPortapapeles);

//SALIR PREINSCRIPCION (ATRAS PANTALLA INICIAL DE CONSULTA)

document.getElementById("atrasDatosRepresentantePreinscripcion").addEventListener("click", atrasPreinscripcion);

//CONSULTAR EL REPRESENTANTE

document.getElementById("consultarRepresentantePreinscripcion").addEventListener("click", obtenerDatosRepresentantePreinscripcion);

//ENTRAR A LA PANTALLA DE FORMULARIOS DE PREINSCRIPCION

document.getElementById("botonContinuarRepresentantePreinscripcion").addEventListener("click", entrarFormularioPreinscripcion);

//VOLVER A DONDE SE INTRODUCEN LOS DATOS DEL REPRESENTANTE

document.getElementById("atrasPreinscribirEstudiantes").addEventListener("click", atrasFormularioPreinscripcion);

//SIGUIENTE PAGINA FORMULARIO

document.getElementById("preinscribirSiguiente").addEventListener("click", paginaSiguientePreinscribir);

//PAGINA ANTERIOR FORMULARIO

document.getElementById("preinscribirAtras").addEventListener("click", paginaAnteriorPreinscribir);

//AGREGAR PAGINA

document.getElementById("preinscribirAgregar").addEventListener("click", agregarPaginaPreinscribir);

//CAMBIAR LOS SELECTS DE GRADO, PRIMER ESTUDIANTE

document.getElementById("gradoDeInstruccionPreinscripcion").addEventListener("change", cambiarSelectCursosGradoInstruccion);

//ENTRAR A LA PANTALLA DE CONSULTA DEL PRECIO EN DOLARES

document.getElementById("continuarPreinscripcion").addEventListener("click", entrarPantallaConsultaUSDpreinscripcion);

//RETROCEDER DESDE LA PANTALLA DE CONSULTA DEL PRECIO EN DOLARES

document.getElementById("atrasConsultaUSDpreinscripcion").addEventListener("click", atrasConsultaUSDpreinscripcion);

//ENTRAR A LA PANTALLA DE CONFIRMAR

document.getElementById("BotonContinuarPreinscripcionConsultaUSD").addEventListener("click", continuarEntrarConfirmar);

//RETROCEDER DESDE LA PANTALLA DE CONFIRMAR

document.getElementById("atrasConfirmarPreinscripcion").addEventListener("click", atrasConfirmarPreinscripcion);

//ENTRAR A LA PANTALLA DE PAGAR

document.getElementById("botonConfirmarPreinscribir").addEventListener("click", entrarPantallaPagarPreinscripcion);

//CONTINUAR Y ENTRAR A DONDE SE IMPRIMEN LOS FORMULARIOS DE INSCRIPCION (YA EL PAGO ESTA HECHO AQUI)

document.getElementById("ContinuarTicketPreinscripcion").addEventListener("click", continuarDocumentoDePagoPreinscripcion);

//IMPRIMIR EL RECIBO DE PREINSCRIPCION

document.getElementById("imprimirTicketPreinscripcion").addEventListener("click", imprimirTicketPreinscripcion);

//IMPRIMIR EL FORMULARIO DE INSCRIPCION DEL ESTUDIANTE

document.getElementById("imprimirFormularioPreinscripcion").addEventListener("click", botonSIimprimirFormularioEstudiantePreinscripcion);

//NO IMPRIMIR EL FORMULARIO DE INSCRIPCION DEL ESTUDIANTE

document.getElementById("NOimprimirFormularioPreinscripcion").addEventListener("click", botonNOimprimirFormularioEstudiantePreinscripcion);