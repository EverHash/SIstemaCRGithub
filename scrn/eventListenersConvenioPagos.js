/*global document */

import {atrasConfirmarCrearConvenio, atrasConfirmarMesesConvenios, 
        atrasSeleccionarMesesConvenio, 
        botonSiImprimirConvenioIndividual, 
        botonSiImprimirConvenioPares, 
        continuarAconfirmarDatosConvenio, 
        determinarSiguientePaso, 
        entrarConfirmarYcrearConvenios, 
        entrarConvenios, 
        prepararDatosPantallaPreguntaImprimir, 
        salirConvenios, 
        seleccionarTodosLosMesesConvenio } from "./controlesConvenioPagos.js";
import {consultar, 
        continuarVerMesesDetalladosConvenios } from "./conveniosPagos.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("conveniosDePago").addEventListener("click", entrarConvenios);
document.getElementById("atrasConveniosMensualidad").addEventListener("click", salirConvenios);

document.getElementById("atrasDetallesMesesConvenio").addEventListener("click", atrasSeleccionarMesesConvenio);
document.getElementById("atrasConfirmarMesesConvenio").addEventListener("click", atrasConfirmarMesesConvenios);

//BOTONES

document.getElementById("buscarEstudiantesConvenios").addEventListener("click", consultar);
document.getElementById("continuarCrearConvenio").addEventListener("click", continuarVerMesesDetalladosConvenios);
document.getElementById("continuarDetallesConveniosMensualidades").addEventListener("click", continuarAconfirmarDatosConvenio);
document.getElementById("confirmarMesesConvenio").addEventListener("click", entrarConfirmarYcrearConvenios);
document.getElementById("crearConvenio").addEventListener("click", prepararDatosPantallaPreguntaImprimir);
document.getElementById("botonSIimprimirConvenioIndividual").addEventListener("click", botonSiImprimirConvenioIndividual);
document.getElementById("botonSIimprimirConvenioPares").addEventListener("click", botonSiImprimirConvenioPares);
document.getElementById("botonNOimprimirConvenioPares").addEventListener("click", determinarSiguientePaso);
document.getElementById("botonNOimprimirConvenioIndividual").addEventListener("click", determinarSiguientePaso);
document.getElementById("atrasConfirmarYcrearConvenio").addEventListener("click", atrasConfirmarCrearConvenio);



//CHECKBOX

document.getElementById("seleccionarTodosLosMesesConvenio").addEventListener("change", seleccionarTodosLosMesesConvenio);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaConvenios").addEventListener("click", pegarContenidoPortapapeles);