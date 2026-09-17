/*global document */

import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso } from "./obtenerPrecios.js";
import { verSiEsNumeroEntero } from "./utilidades.js";
import { crearCeldaConInput, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export {entrarHabilitarMensualides,
        atrasHabilitarMensualidades, 
        cedulaInvalida,
        dibujarFilaEstudiante,
        rellenarFormularioRepresentante,
        noHayEstudiantes,
        mostrarElementosInterfazConsulta,
        ocultarElementosInterfazConsulta,
        noHayEstudiantesSeleccionados,
        entrarPantallaSeleccionarMesesHabilitar,
        atrasPantallaConsultaMesesHabilitar,
        checkboxConsultarTodos,
        dibujarFilaTablaSeleccionarConcepto,
        marcarTodosLosMesesHabilitar,
        continuarMesesDesactivarSeleccionados,
        atrasPantallaConfirmarMesesHabilitar,
        obtenerDirectorioEstudiante,
        obtenerDirectorioRepresentante,
        volverPantallaInicioProcesoFinalizado
};

function entrarHabilitarMensualides(){

    document.getElementById("mainContainerTipoEdicion").style.display = "none";
    document.getElementById("mainContainerHabilitarMensualidades").style.display = "block";

}

function atrasHabilitarMensualidades(){

    document.getElementById("mainContainerHabilitarMensualidades").style.display = "none";
    document.getElementById("mainContainerTipoEdicion").style.display = "block";
    document.getElementById("marcarTodosLosEstudiantesHabilitar").checked = false;
    document.getElementById("cedulaRepresentanteHabilitar").value = "";
    ocultarElementosInterfazConsulta();

}

function mostrarElementosInterfazConsulta(){

    document.getElementById("tablaHabilitarMensualidades").style.display = "block";
    document.getElementById("nombreRepresentanteHabilitarMensualidades").style.display = "block";
    document.getElementById("botonHabilitarMensualidades").style.display = "block";

}

function ocultarElementosInterfazConsulta(){

    document.getElementById("tablaHabilitarMensualidades").style.display = "none";
    document.getElementById("nombreRepresentanteHabilitarMensualidades").style.display = "none";
    document.getElementById("botonHabilitarMensualidades").style.display = "none";

}

function cedulaInvalida(){

    let cedula = document.getElementById("cedulaRepresentanteHabilitar").value;

    if(verSiEsNumeroEntero(cedula)){

        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el número de cédula sin separaciones, por favor");
        return true;

    }

    return false;

}

function noHayEstudiantes(estudiantes){

    let vacio = true;

    estudiantes.forEach(estudiante => {

        vacio = false;

    });

    if(vacio){

        ocultarPantallaCarga();
        mostrarPantallaError("No hay estudiantes representados en este año escolar");

    }

    return vacio;

}

export function tablaPrimeraConsultaMesesVacia(){

    let tabla = document.getElementById("tbodyMesesSeleccionarHabilitar");

    return tabla.rows.length == 1; //SI ES 1 RETORNA TRUE, DE LO CONTRARIO, FALSE 

}

function rellenarFormularioRepresentante(datosRepresentante){

    let nombreRepresentante = datosRepresentante.nombres + " " + datosRepresentante.apellidos;
    document.getElementById("nombreRepresentanteHabilitarMensualidades").value = nombreRepresentante;
    document.getElementById("nombreRepresentanteHabilitarMensualidades").style.display = "block";

}

function dibujarFilaEstudiante(datosEstudiante){

    let col1 = crearCeldaConTexto(datosEstudiante.nombres);
    let col2 = crearCeldaConTexto(datosEstudiante.apellidos);
    let col3 = crearCeldaConTexto(datosEstudiante.cedula);
    let col4 = crearCeldaConTexto(datosEstudiante.grado);
    let col5 = crearCeldaConTexto(datosEstudiante.curso);
    let col6 = crearCeldaConTexto(datosEstudiante.seccion);
    let col7 = crearCeldaConInput("checkbox", false, "");
    col7.children[0].addEventListener("change", marcarEstudianteHabilitar);

    let arrayCeldas = [];

    let tabla = document.getElementById("tbodyHabilitarMensualidades");

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);
    arrayCeldas.push(col3);
    arrayCeldas.push(col4);
    arrayCeldas.push(col5);
    arrayCeldas.push(col6);
    arrayCeldas.push(col7);

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function dibujarFilaTablaSeleccionarConcepto(datosEstudiante){

    let tabla = document.getElementById("tbodyMesesSeleccionarHabilitar");

    let col1; //NOMBRE COMPLETO
    let col2; //CEDULA
    let col3; //CURSO
    let col4; //SECCION
    let col5; //MES
    let col6; //SELECCIONAR

    let arrayCeldas = [];

    let arrayMeses = ["pagoInscripcion",
                      "pago09Septiembre",
                      "pago10Octubre",
                      "pago11Noviembre",
                      "pago12Diciembre",
                      "pago13Enero",
                      "pago14Febrero",
                      "pago15Marzo",
                      "pago16Abril",
                      "pago17Mayo",
                      "pago18Junio",
                      "pago19Julio",
                      "pago20Agosto"];

    let arrayMesesSolo = ["Inscripcion",
                      "Septiembre",
                      "Octubre",
                      "Noviembre",
                      "Diciembre",
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio",
                      "Julio",
                      "Agosto"];

    for(let i = 0; i <= arrayMeses.length- 1; i++){

        if(datosEstudiante[arrayMeses[i]] != "N/A") continue;

        arrayCeldas = [];

        col1 = crearCeldaConTexto(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
        col2 = crearCeldaConTexto(datosEstudiante.cedula);
        col3 = crearCeldaConTexto(datosEstudiante.curso);
        col4 = crearCeldaConTexto(datosEstudiante.seccion);
        col5 = crearCeldaConTexto(arrayMesesSolo[i]);
        col6 = crearCeldaConInput("checkbox", false, "");
        col6.children[0].addEventListener("change", marcarConceptoHabilitar);

        arrayCeldas.push(col1);
        arrayCeldas.push(col2);
        arrayCeldas.push(col3);
        arrayCeldas.push(col4);
        arrayCeldas.push(col5);
        arrayCeldas.push(col6);

        tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

    }
}

function entrarPantallaSeleccionarMesesHabilitar(){

    document.getElementById("mainContainerHabilitarMensualidades").style.display = "none";
    document.getElementById("mainContainerMesesHabilitarEstudiantes").style.display = "block";

}

function noHayEstudiantesSeleccionados(){

    let tabla = document.getElementById("tbodyHabilitarMensualidades");
    let flag = true;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[6].children[0].checked) flag = false;

    }

    return flag;

}

function marcarEstudianteHabilitar(){

    //LA FUNCION EN ESTE EVENT LISTENER TIENE COMO FUNCION
    //CONTAR TODOS LOS CHECKBOXES ACTIVOS, DE FORMA QUE SI
    //TODOS ESTAN ACTIVOS, SE ACTIVA EL CHECKBOX DE LA CABECERA

    let verificador = 0;
    let tablaConsultas = document.getElementById("tbodyHabilitarMensualidades");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        if(tablaConsultas.rows[i].cells[6].children[0].checked == false && document.getElementById("marcarTodosLosEstudiantesHabilitar").checked == true){
            document.getElementById("marcarTodosLosEstudiantesHabilitar").checked = false;
        }
        if(tablaConsultas.rows[i].cells[6].children[0].checked == true && document.getElementById("marcarTodosLosEstudiantesHabilitar").checked == false){
            verificador++;
        }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        document.getElementById("marcarTodosLosEstudiantesHabilitar").checked = true;
    }
}

function marcarConceptoHabilitar(){

    //LA FUNCION EN ESTE EVENT LISTENER TIENE COMO FUNCION
    //CONTAR TODOS LOS CHECKBOXES ACTIVOS, DE FORMA QUE SI
    //TODOS ESTAN ACTIVOS, SE ACTIVA EL CHECKBOX DE LA CABECERA

    let verificador = 0;
    let tablaConsultas = document.getElementById("tbodyMesesSeleccionarHabilitar");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        if(tablaConsultas.rows[i].cells[5].children[0].checked == false && document.getElementById("marcarTodosLosMesesHabilitar").checked == true){
            document.getElementById("marcarTodosLosMesesHabilitar").checked = false;
        }
        if(tablaConsultas.rows[i].cells[5].children[0].checked == true && document.getElementById("marcarTodosLosMesesHabilitar").checked == false){
            verificador++;
        }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        document.getElementById("marcarTodosLosMesesHabilitar").checked = true;
    }
}

function checkboxConsultarTodos(){
    let tabla = document.getElementById("tbodyHabilitarMensualidades");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(this.checked == true){
            tabla.rows[i].cells[6].children[0].checked = true;
        }
        else{
            tabla.rows[i].cells[6].children[0].checked = false;
        }
    }
}

function marcarTodosLosMesesHabilitar(){ //marcar habilitar todos
    let tabla = document.getElementById("tbodyMesesSeleccionarHabilitar");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(this.checked == true){
            tabla.rows[i].cells[5].children[0].checked = true;
        }
        else{
            tabla.rows[i].cells[5].children[0].checked = false;
        }
    }
}

function atrasPantallaConsultaMesesHabilitar(){

    limpiarFilasTabla("tbodyMesesSeleccionarHabilitar", 1);
    document.getElementById("marcarTodosLosMesesHabilitar").checked = false;

    document.getElementById("mainContainerMesesHabilitarEstudiantes").style.display = "none";
    document.getElementById("mainContainerHabilitarMensualidades").style.display = "block";

}

function continuarMesesDesactivarSeleccionados(){

    let tabla = document.getElementById("tbodyMesesSeleccionarHabilitar");

    limpiarFilasTabla("tbodyMesesConfirmarHabilitar", 1);

    let datosEstudiante = {

        nombreCompleto: "",
        cedula: "",
        curso: "",
        seccion: "",
        concepto: ""

    };

    if(noHayMesesSeleccionados()){

        mostrarPantallaError("Seleccione los meses que se van a desactivar");
        return;

    }

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(!(tabla.rows[i].cells[5].children[0].checked)) continue;

        datosEstudiante.nombreCompleto = tabla.rows[i].cells[0].textContent;
        datosEstudiante.cedula = tabla.rows[i].cells[1].textContent;
        datosEstudiante.curso = tabla.rows[i].cells[2].textContent;
        datosEstudiante.seccion = tabla.rows[i].cells[3].textContent;
        datosEstudiante.concepto = tabla.rows[i].cells[4].textContent;

        dibujarFilaEstudianteConfirmar(datosEstudiante);

    }

    entrarPantallaConfirmarMesesDesactivar();

}

function dibujarFilaEstudianteConfirmar(datosEstudiante){

    let col1 = crearCeldaConTexto(datosEstudiante.nombreCompleto);
    let col2 = crearCeldaConTexto(datosEstudiante.cedula);
    let col3 = crearCeldaConTexto(datosEstudiante.curso);
    let col4 = crearCeldaConTexto(datosEstudiante.seccion);
    let col5 = crearCeldaConTexto(datosEstudiante.concepto);

    let arrayCeldas = [];

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);
    arrayCeldas.push(col3);
    arrayCeldas.push(col4);
    arrayCeldas.push(col5);

    let tabla = document.getElementById("tbodyMesesConfirmarHabilitar");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function entrarPantallaConfirmarMesesDesactivar(){

    document.getElementById("mainContainerMesesHabilitarEstudiantes").style.display = "none";
    document.getElementById("mainContainerConfirmarMesesHabilitarEstudiantes").style.display = "block";

}

function noHayMesesSeleccionados(){

    let tabla = document.getElementById("tbodyMesesSeleccionarHabilitar");
    let flag = true;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[5].children[0].checked) flag = false;

    }

    return flag;  

}

function atrasPantallaConfirmarMesesHabilitar(){

    document.getElementById("mainContainerConfirmarMesesHabilitarEstudiantes").style.display = "none";
    document.getElementById("mainContainerMesesHabilitarEstudiantes").style.display = "block";

    limpiarFilasTabla("tbodyMesesConfirmarHabilitar", 1);

}

function obtenerDirectorioEstudiante(fila){

    let tabla = document.getElementById("tbodyMesesConfirmarHabilitar");

    let directorio = "estudiantes/" + annoEnCurso;

    if(tabla.rows[fila].cells[2].textContent.includes("Año")){

        directorio += "/Bachillerato/" + tabla.rows[fila].cells[2].textContent;
        directorio += " " + tabla.rows[fila].cells[3].textContent + "/Estudiantes/";
        directorio += tabla.rows[fila].cells[1].textContent;

    }
    if(tabla.rows[fila].cells[2].textContent.includes("Grado")){

        directorio += "/Primaria/" + tabla.rows[fila].cells[2].textContent;
        directorio += " " + tabla.rows[fila].cells[3].textContent + "/Estudiantes/";
        directorio += tabla.rows[fila].cells[1].textContent;

    }
    if(tabla.rows[fila].cells[2].textContent.includes("Nivel")){
        directorio += "/Preescolar/" + tabla.rows[fila].cells[2].textContent;
        directorio += " " + tabla.rows[fila].cells[3].textContent + "/Estudiantes/";
        directorio += tabla.rows[fila].cells[1].textContent;
    }

    return directorio;

}

function obtenerDirectorioRepresentante(fila, cedulaRepresentante){

    let tabla = document.getElementById("tbodyMesesConfirmarHabilitar");

    let directorio = "representantes/" + cedulaRepresentante + "/estudiantes" + annoEnCurso + "/";

    directorio += tabla.rows[fila].cells[1].textContent;

    return directorio;

}

function limpiarTablaProcesoFinalizado(){

    document.getElementById("tablaHabilitarMensualidades").style.display = "none";
    document.getElementById("nombreRepresentanteHabilitarMensualidades").style.display = "none";
    document.getElementById("botonHabilitarMensualidades").style.display = "none";
    document.getElementById("cedulaRepresentanteHabilitar").value = "";
    document.getElementById("marcarTodosLosEstudiantesHabilitar").checked = false;
    limpiarFilasTabla("tbodyHabilitarMensualidades", 1);

}

function volverPantallaInicioProcesoFinalizado(){

    limpiarTablaProcesoFinalizado();
    document.getElementById("mainContainerConfirmarMesesHabilitarEstudiantes").style.display = "none";
    document.getElementById("mainContainerHabilitarMensualidades").style.display = "block";


}