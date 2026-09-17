/*global document */

import { mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso } from "./obtenerPrecios.js";
import { verSiEsNumeroEntero } from "./utilidades.js";
import {crearCeldaConInput,
        crearCeldaConTexto, 
        crearTRconCeldasApendadas, 
        limpiarFilasTabla} from "./utilidadesTablas.js";

export {dibujarFilaEstudiante, 
        formularioInvalido, 
        cabeceraTablaCheckbox,
        rellenarFormularioRepresentante,
        noHayEstudiantes,
        dibujarFilaTablaPrevioConfirmar, 
        entrarPantallaConsultaMesesRetirar,
        atrasPantallaConsultaMesesRetirar, 
        continuarMesesDesactivarSeleccionados, 
        atrasPantallaConfirmarMesesDesactivar,
        marcarTodosLosMesesDesactivar, 
        obtenerDirectorioEstudiante, 
        obtenerDirectorioRepresentante,
        volverPantallaInicioProcesoFinalizado};

export function entrarRetirarEstudiante(){
    let mainContainerGestionEstudiantes = document.getElementById("mainContainerTipoEdicion");
    let mainContainerRetirarEstudiante = document.getElementById("main-container-RetirarEstudiante");
    mainContainerGestionEstudiantes.style.display = "none";
    mainContainerRetirarEstudiante.style.display = "block";
}

export function atrasRetirarEstudiantes(){
    document.getElementById("main-container-RetirarEstudiante").style.display = "none";
    document.getElementById("mainContainerTipoEdicion").style.display = "block";
    document.getElementById("tablaRetirar").style.display = "none";
    document.getElementById("nombre-representante-retirar").style.display = "none";
    document.getElementById("retirarEstudiantes").style.display = "none";
    document.getElementById("cedula-representante-retirar").value = "";
}

function formularioInvalido(){

    debugger;

    if(document.getElementById("cedula-representante-retirar").value == ""){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el número de cédula del representante, por favor...");
        return 1;
    }

    if(verSiEsNumeroEntero(document.getElementById("cedula-representante-retirar").value) == 1){
        ocultarPantallaCarga();
        mostrarPantallaError("Introduzca el número de cédula del representante sin separaciones, por favor...");
        return 1;
    }

}

function cabeceraTablaCheckbox(){ //marcar retirar todos
    let tabla = document.getElementById("tabla-retirar-estudiante-encabezado");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(this.checked == true){
            tabla.rows[i].cells[6].children[0].checked = true;
        }
        else{
            tabla.rows[i].cells[6].children[0].checked = false;
        }
    }
}

function marcarTodosLosMesesDesactivar(){ //marcar retirar todos
    let tabla = document.getElementById("tbodyMesesSeleccionarDesactivar");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(this.checked == true){
            tabla.rows[i].cells[5].children[0].checked = true;
        }
        else{
            tabla.rows[i].cells[5].children[0].checked = false;
        }
    }
}

function dibujarFilaEstudiante(datosEstudiante){

    let col1 = crearCeldaConTexto(datosEstudiante.nombres);
    let col2 = crearCeldaConTexto(datosEstudiante.apellidos);
    let col3 = crearCeldaConTexto(datosEstudiante.cedula);
    let col4 = crearCeldaConTexto(datosEstudiante.grado);
    let col5 = crearCeldaConTexto(datosEstudiante.curso);
    let col6 = crearCeldaConTexto(datosEstudiante.seccion);
    let col7 = crearCeldaConInput("checkbox", false, "");
    col7.children[0].addEventListener("change", marcarEstudianteRetirar);

    let arrayCeldas = [];

    let tabla = document.getElementById("tabla-retirar-estudiante-encabezado");

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);
    arrayCeldas.push(col3);
    arrayCeldas.push(col4);
    arrayCeldas.push(col5);
    arrayCeldas.push(col6);
    arrayCeldas.push(col7);

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function rellenarFormularioRepresentante(datosRepresentante){

      let nombreRepresentante = datosRepresentante.nombres + " " + datosRepresentante.apellidos;
      document.getElementById("nombre-representante-retirar").value = nombreRepresentante;
      document.getElementById("nombre-representante-retirar").style.display = "block";

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

function marcarEstudianteRetirar(){

    //LA FUNCION EN ESTE EVENT LISTENER TIENE COMO FUNCION
    //CONTAR TODOS LOS CHECKBOXES ACTIVOS, DE FORMA QUE SI
    //TODOS ESTAN ACTIVOS, SE ACTIVA EL CHECKBOX DE LA CABECERA

    let verificador = 0;
    let tablaConsultas = document.getElementById("tabla-retirar-estudiante-encabezado");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        if(tablaConsultas.rows[i].cells[6].children[0].checked == false && document.getElementById("marcarTodosLosEstudiantesRetirar").checked == true){
            document.getElementById("marcarTodosLosEstudiantesRetirar").checked = false;
        }
        if(tablaConsultas.rows[i].cells[6].children[0].checked == true && document.getElementById("marcarTodosLosEstudiantesRetirar").checked == false){
            verificador++;
        }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        document.getElementById("marcarTodosLosEstudiantesRetirar").checked = true;
    }
}

function marcarConceptoRetirar(){

    //LA FUNCION EN ESTE EVENT LISTENER TIENE COMO FUNCION
    //CONTAR TODOS LOS CHECKBOXES ACTIVOS, DE FORMA QUE SI
    //TODOS ESTAN ACTIVOS, SE ACTIVA EL CHECKBOX DE LA CABECERA

    let verificador = 0;
    let tablaConsultas = document.getElementById("tbodyMesesSeleccionarDesactivar");
    for(let i = 1; i <= tablaConsultas.rows.length - 1; i++){
        if(tablaConsultas.rows[i].cells[5].children[0].checked == false && document.getElementById("marcarTodosLosMesesDesactivar").checked == true){
            document.getElementById("marcarTodosLosMesesDesactivar").checked = false;
        }
        if(tablaConsultas.rows[i].cells[5].children[0].checked == true && document.getElementById("marcarTodosLosMesesDesactivar").checked == false){
            verificador++;
        }
    }
    if(verificador == (tablaConsultas.rows.length - 1)){
        document.getElementById("marcarTodosLosMesesDesactivar").checked = true;
    }
}

function dibujarFilaTablaPrevioConfirmar(datosEstudiante){

    let tabla = document.getElementById("tbodyMesesSeleccionarDesactivar");

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

        if(datosEstudiante[arrayMeses[i]]) continue;

        arrayCeldas = [];

        col1 = crearCeldaConTexto(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
        col2 = crearCeldaConTexto(datosEstudiante.cedula);
        col3 = crearCeldaConTexto(datosEstudiante.curso);
        col4 = crearCeldaConTexto(datosEstudiante.seccion);
        col5 = crearCeldaConTexto(arrayMesesSolo[i]);
        col6 = crearCeldaConInput("checkbox", false, "");
        col6.children[0].addEventListener("change", marcarConceptoRetirar);

        arrayCeldas.push(col1);
        arrayCeldas.push(col2);
        arrayCeldas.push(col3);
        arrayCeldas.push(col4);
        arrayCeldas.push(col5);
        arrayCeldas.push(col6);

        tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

    }
}

function entrarPantallaConsultaMesesRetirar(){

    if(noHayEstudiantesSeleccionados()){

        mostrarPantallaError("Seleccione uno o más estudiantes, por favor");
        return;

    }
    document.getElementById("main-container-RetirarEstudiante").style.display = "none";
    document.getElementById("mainContainerMesesDesactivarEstudiantes").style.display = "block";
    document.getElementById("marcarTodosLosMesesDesactivar").checked = false;

}

function atrasPantallaConsultaMesesRetirar(){

    document.getElementById("mainContainerMesesDesactivarEstudiantes").style.display = "none";
    document.getElementById("main-container-RetirarEstudiante").style.display = "block";
    limpiarFilasTabla("tbodyMesesSeleccionarDesactivar", 1);

}

function continuarMesesDesactivarSeleccionados(){

    let tabla = document.getElementById("tbodyMesesSeleccionarDesactivar");

    limpiarFilasTabla("tbodyMesesConfirmarDesactivar", 1);

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

    let tabla = document.getElementById("tbodyMesesConfirmarDesactivar");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function entrarPantallaConfirmarMesesDesactivar(){

    document.getElementById("mainContainerMesesDesactivarEstudiantes").style.display = "none";
    document.getElementById("mainContainerConfirmarMesesDesactivarEstudiantes").style.display = "block";

}

function atrasPantallaConfirmarMesesDesactivar(){

    document.getElementById("mainContainerConfirmarMesesDesactivarEstudiantes").style.display = "none";
    document.getElementById("mainContainerMesesDesactivarEstudiantes").style.display = "block";

    limpiarFilasTabla("tbodyMesesConfirmarDesactivar", 1);

}

function noHayEstudiantesSeleccionados(){

    let tabla = document.getElementById("tabla-retirar-estudiante-encabezado");
    let flag = true;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[6].children[0].checked) flag = false;

    }

    return flag;

}

function noHayMesesSeleccionados(){

    let tabla = document.getElementById("tbodyMesesSeleccionarDesactivar");
    let flag = true;

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[5].children[0].checked) flag = false;

    }

    return flag;  

}

function obtenerDirectorioEstudiante(fila){

    let tabla = document.getElementById("tbodyMesesConfirmarDesactivar");

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

    let tabla = document.getElementById("tbodyMesesConfirmarDesactivar");

    let directorio = "representantes/" + cedulaRepresentante + "/estudiantes" + annoEnCurso + "/";

    directorio += tabla.rows[fila].cells[1].textContent;

    return directorio;

}

function limpiarTablaProcesoFinalizado(){

    document.getElementById("tablaRetirar").style.display = "none";
    document.getElementById("nombre-representante-retirar").style.display = "none";
    document.getElementById("retirarEstudiantes").style.display = "none";
    document.getElementById("cedula-representante-retirar").value = "";
    document.getElementById("marcarTodosLosEstudiantesRetirar").checked = false;
    limpiarFilasTabla("tabla-retirar-estudiante-encabezado", 1);

}

function volverPantallaInicioProcesoFinalizado(){

    limpiarTablaProcesoFinalizado();
    document.getElementById("mainContainerConfirmarMesesDesactivarEstudiantes").style.display = "none";
    document.getElementById("main-container-RetirarEstudiante").style.display = "block";


}

export function limpiarInterfazBuscar(){

    document.getElementById("tablaRetirar").style.display = "none";
    document.getElementById("nombre-representante-retirar").style.display = "none";
    document.getElementById("retirarEstudiantes").style.display = "none";
    document.getElementById("marcarTodosLosEstudiantesRetirar").checked = false;    

}

export function tablaPrimeraConsultaMesesVacia(){

    let tabla = document.getElementById("tbodyMesesSeleccionarDesactivar");

    return tabla.rows.length == 1; //SI ES 1 RETORNA TRUE, DE LO CONTRARIO, FALSE 

}