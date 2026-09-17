/*global document */

import {atrasConfirmarCrearConvenioInscripcion, 
        atrasConfirmarMesesConveniosInscripcion, 
        atrasSeleccionarMesesConvenioInscripcion, 
        botonSiImprimirConvenioIndividualInscripcion, 
        botonSiImprimirConvenioParesInscripcion, 
        continuarAconfirmarDatosConvenioInscripcion, 
        determinarSiguientePasoConvenioInscripcion, 
        determinarSiguientePasoFormularioInscripcion, 
        entrarConfirmarYcrearConveniosInscripcion, 
        imprimirFormularioInscripcionConvenio, 
        prepararDatosPantallaPreguntaImprimirInscripcion,
        seleccionarTodosMesesPagarInscripcionConvenio} from "./controlesInscripcionConvenio.js";




//ENTRAR A PANTALLA DE CONFIRMAR CONCEPTOS
document.getElementById("botonContinuarMesesConvenioInscripcion").addEventListener("click", continuarAconfirmarDatosConvenioInscripcion);

//ATRAS PANTALLA SELECCIONAR CONCEPTOS
document.getElementById("atrasSeleccionarConvenioInscripcion").addEventListener("click", atrasSeleccionarMesesConvenioInscripcion);

//ENTRAR A PANTALLA DE CONFIRMAR Y CREAR CONVENIO
document.getElementById("confirmarMesesConvenioInscripcion").addEventListener("click", entrarConfirmarYcrearConveniosInscripcion);

//ATRAS CONFIRMAR CONCEPTOS

document.getElementById("atrasConfirmarMesesConvenioInscripcion").addEventListener("click", atrasConfirmarMesesConveniosInscripcion);

//ATRAS CONFIRMAR Y CREAR CONVENIO

document.getElementById("atrasConfirmarYcrearConvenioInscripcion").addEventListener("click", atrasConfirmarCrearConvenioInscripcion);

//INSCRIBIR Y CREAR EL CONVENIO

document.getElementById("crearConvenioInscripcion").addEventListener("click", prepararDatosPantallaPreguntaImprimirInscripcion);

//BOTON SI IMPRIMIR CONVENIO PARES

document.getElementById("botonSIimprimirConvenioParesInscripcion").addEventListener("click", botonSiImprimirConvenioParesInscripcion);

//BOTON SI IMPRIMIR CONVENIO INDIVIDUAL

document.getElementById("botonSIimprimirConvenioIndividualInscripcion").addEventListener("click", botonSiImprimirConvenioIndividualInscripcion);

//BOTON NO IMPRIMIR CONVENIO PARES

document.getElementById("botonNOimprimirConvenioParesInscripcion").addEventListener("click", determinarSiguientePasoConvenioInscripcion);

//BOTON NO IMPRIMIR CONVENIO INDIVIDUAL

document.getElementById("botonNOimprimirConvenioIndividualInscripcion").addEventListener("click", determinarSiguientePasoConvenioInscripcion);

//BOTON SI IMPRIMIR FORMULARIO INSCRIPCION

document.getElementById("imprimirFormularioInscripcionConvenio").addEventListener("click", imprimirFormularioInscripcionConvenio);

//BOTON NO IMPRIMIR FORMULARIO INSCRIPCION

document.getElementById("NOimprimirFormularioInscripcionConvenio").addEventListener("click", determinarSiguientePasoFormularioInscripcion);

//SELECCIONAR TODOS LOS MESES CONVENIO

document.getElementById("seleccionarTodosLosMesesConvenioInscripcionInput").addEventListener("change", seleccionarTodosMesesPagarInscripcionConvenio);