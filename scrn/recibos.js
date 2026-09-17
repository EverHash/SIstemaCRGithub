/*global document */

import { limpiarMetodosPago } from "./controlesEfectuarPago.js";
import { entrarConsultaImpresion } from "./controlesInscripcion.js";
import { entrarConsultaImpresionAgregar } from "./controlesAgregarEstudiante.js";
import { entrarConsultaImpresionReinscripcion } from "./controlesReinscripcion.js";
import { limpiarTodoAtras as limpiarTodoAbonos, limpiarTodoAbonosNoRegistrado } from "./controlesAbonos.js";
import { numberAformatoMontos } from "./utilidades.js";
import { precioDolar } from "./obtenerPrecios.js";
import { ocultarYlimpiar } from "./controlesEditorMensualidad.js";
import { gestorFormulario } from "./controlesAdministrativo.js";
import { limpiarInputText, mostrarPantalla, ocultar, reiniciarSelect } from "./funcionesHTML.js";
import { gestorFormularioPreinscripcion } from "./controlesPreinscripcion.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export {mostrarDocumentodePagoAdministrativo, 
        mostrarDocumentodePagoMensualidad, 
        ContinuarTicketInscribir, 
        mostrarDocumentodePagoInscripcion, 
        ContinuarTicketAdministrativo, 
        ContinuarTicketMensualidad, 
        mostrarDocumentodePagoAgregar, 
        ContinuarTicketAgregar, 
        ContinuarTicketReinscripcion, 
        mostrarDocumentodePagoReinscripcion,
        mostrarDocumentodePagoAbono,
        continuarTicketAbono,
        continuarTicketAbonoNoRegistrado, 
        mostrarDocumentodePagoAbonoNoRegistrado,
        mostrarDocumentoEdicionMensualidad,
        continuarTicketEdicionMensualidad};

function ContinuarTicketMensualidad(){
    document.getElementById("cedula-representante-consultar").value = "";
    document.getElementById("main-container-PagoMensualidadRealizado").style.display = "none";
    document.getElementById("mes-en-curso").selectedIndex = 0;
    document.getElementById("tablaConsultar").style.display = "none";
    document.getElementById("verificarTodosLosMeses").checked = false;
    document.getElementById("nombre-representante-consultar").style.display = "none";
    document.getElementById("totalAbonosRepresentanteConsultar").style.display = "none";
    document.getElementById("consultarEstudiantes").style.display = "none";
    document.getElementById("main-container-GestionMensualidades").style.display = "block";
    document.getElementById("tablaTicketMensualidad").removeChild(document.getElementById("tablaTicketMensualidad").children[0]);
    document.getElementById("verCuentaAbonoRepresentanteMensualidad").style.display = "none";
    limpiarMetodosPago();
}

function ContinuarTicketInscribir(){
    entrarConsultaImpresion();
    limpiarMetodosPago();
}

function ContinuarTicketAgregar(){
    entrarConsultaImpresionAgregar();
    limpiarMetodosPago();
}

function continuarTicketEdicionMensualidad(){
    ocultarYlimpiar();
    document.getElementById("main-container-EdicionMensualidadRealizada").style.display = "none";
    document.getElementById("mainContainerEditorMensualidad").style.display = "block";
    document.getElementById("tablaTicketEdicionMensualidad").removeChild(document.getElementById("tablaTicketEdicionMensualidad").children[0]);
}

function ContinuarTicketAdministrativo(){

    gestorFormulario.limpiarInterfaz();

    limpiarInputText("cedulaRepresentanteAdministrativo");
    limpiarInputText("nombresRepresentanteAdministrativo");
    limpiarInputText("apellidosRepresentanteAdministrativo");
    limpiarInputText("totalAbonadoRepresentanteAdministrativo");
    reiniciarSelect("representanteRegistradoAdministrativo");
    document.getElementById("mainContainerRegistroRepresentanteAdministrativo").style.display = "block";
    document.getElementById("main-container-PagoAdministrativoRealizado").style.display = "none";
    document.getElementById("tablaAdministrativoImprimir").removeChild(document.getElementById("tablaAdministrativoImprimir").children[0]);
    limpiarMetodosPago();    
}

function continuarTicketAbono(){
    limpiarTodoAbonos();
    document.getElementById("main-container-PagoAbonoRealizado").style.display = "none";
    document.getElementById("main-container-Abonos").style.display = "block";
    document.getElementById("tablaTicketAbono").removeChild(document.getElementById("tablaTicketAbono").children[0]);
    limpiarMetodosPago();
}


function mostrarDocumentodePagoInscripcion(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoInscripcionRealizado").style.display = "block";
}


function mostrarDocumentodePagoMensualidad(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoMensualidadRealizado").style.display = "block";
}

function mostrarDocumentodePagoAdministrativo(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoAdministrativoRealizado").style.display = "block";
}

function mostrarDocumentodePagoAgregar(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoAgregarRealizado").style.display = "block";
}

function mostrarDocumentodePagoReinscripcion(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoReinscripcionRealizado").style.display = "block";
}

function mostrarDocumentodePagoAbono(){
    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoAbonoRealizado").style.display = "block";
}

function mostrarDocumentodePagoAbonoNoRegistrado(){

    document.getElementById("mainContainerPagar").style.display = "none";
    document.getElementById("main-container-PagoAbonoNoRegistradoRealizado").style.display = "block";

}

function mostrarDocumentoEdicionMensualidad(){

    document.getElementById("mainContainerEditorMensualidad").style.display = "none";    
    document.getElementById("main-container-EdicionMensualidadRealizada").style.display = "block";

}

function continuarTicketAbonoNoRegistrado(){

    limpiarTodoAbonosNoRegistrado();
    document.getElementById("main-container-PagoAbonoNoRegistradoRealizado").style.display = "none";
    document.getElementById("mainContainerIntroducirDatosAbonoNoRegistrado").style.display = "block";
    document.getElementById("tablaTicketAbonoNoRegistrado").removeChild(document.getElementById("tablaTicketAbonoNoRegistrado").children[0]);
    limpiarMetodosPago();

}

function ContinuarTicketReinscripcion(){
    entrarConsultaImpresionReinscripcion();
    limpiarMetodosPago();
}

export function mostrarDocumentoDePagoPreinscripcion(){

    ocultar("mainContainerPagar");
    mostrarPantalla("mainContainerPagoPreinscripcionRealizado");


}

export function continuarDocumentoDePagoPreinscripcion(){

    gestorFormularioPreinscripcion.determinarSiguientePantallaFormularioImprimir();

    limpiarFilasTabla("tablaEstudiantesPreinscripcionConsulta", 1);
    limpiarFilasTabla("tablaPreinscripcionConfirmar", 1);

    limpiarInputText("cedulaRepresentantePreinscribir"); 
    limpiarInputText("nombresRepresentantePreinscripcion");
    limpiarInputText("apellidosRepresentantePreinscripcion");
    limpiarInputText("totalAbonadoRepresentantePreinscripcion");

    ocultar("mainContainerPagoPreinscripcionRealizado");
    mostrarPantalla("PantallaPreguntaImprimirFormularioPreinscripcion");
    document.getElementById("tablaPreinscripcionImprimir").removeChild(document.getElementById("tablaPreinscripcionImprimir").children[0]);
    limpiarMetodosPago();

}

