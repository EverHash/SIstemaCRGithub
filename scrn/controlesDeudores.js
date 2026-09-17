/*global document */

import { fechaConvenioVencida } from "./controlesConvenioPagos.js";
import { listaGeneralDeudores } from "./listaDeudores.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso, descuentoProntoPagoInscripcion, fechaMaximaDescuentoProntoPago, obtenerPreciosMensualidad } from "./obtenerPrecios.js";
import { convertirAfechaHTML, fechaDeHoyFormatoJS, verificarProntoPagoPorFecha } from "./utilidades.js";
import { crearCeldaConTexto, crearTHconIcono, crearTHconTexto, crearTRconCeldasApendadas } from "./utilidadesTablas.js";
export {entrarListaGeneralDeudores,
        gradoDeInstruccionDeudores,
        entrarListaDeudoresSeccion, 
        entrarListaDeDeudores, 
        atrasTiposListaDeudores, 
        atrasListaGeneralDeudores, 
        atrasListaDeudores, 
        formularioInvalido,
        dibujarFilaDeudaEstudianteSeccionIndividual,
        dibujarFilaDeudaEstudianteDeudoresGeneral,
        obtenerDirectorioSeccion};

function gradoDeInstruccionDeudores(){
    let preescolar = document.getElementById("Seleccionar-cursoDeudores").getElementsByClassName("curso-preescolar");
    let primaria = document.getElementById("Seleccionar-cursoDeudores").getElementsByClassName("curso-primaria");
    let bachillerato = document.getElementById("Seleccionar-cursoDeudores").getElementsByClassName("curso-bachillerato");
    if(this.selectedIndex == 0){
        document.getElementById("Seleccionar-cursoDeudores").selectedIndex = 0;
        return 0;
    }
    if(this.selectedIndex == 1){
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "block";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
    }
    if(this.selectedIndex == 2){
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "none";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "block";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
    }
    if(this.selectedIndex == 3){
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "none";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "block";
        }
    }
    document.getElementById("Seleccionar-cursoDeudores").selectedIndex = 0;
}

function entrarListaDeDeudores(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-TipoDeudores").style.display = "block";
}

function atrasListaDeudores(){
    document.getElementById("main-container-Lista-Deudores").style.display = "none";
    document.getElementById("main-container-TipoDeudores").style.display = "block";
    document.getElementById("cajaTablaDeudores").style.display = "none";
    document.getElementById("Grado-De-Instruccion-Deudores").selectedIndex = 0;
    document.getElementById("Seleccionar-cursoDeudores").selectedIndex = 0;
    document.getElementById("Seleccionar-SeccionDeudores").selectedIndex = 0;
    document.getElementById("imprimirListaDeudores").style.display = "none";
    let curso = document.getElementById("Seleccionar-cursoDeudores");
    for(let i = 1; i <= curso.children.length - 1; i++){
        curso.children[i].style.display = "none";
    }
}

function atrasTiposListaDeudores(){
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("main-container-TipoDeudores").style.display = "none";
}


async function entrarListaDeudoresSeccion(){
    mostrarPantallaCarga();
    await obtenerPreciosMensualidad();
    document.getElementById("annoEscolarDeudores").value = annoEnCurso;
    document.getElementById("main-container-TipoDeudores").style.display = "none";
    document.getElementById("main-container-Lista-Deudores").style.display = "block";
    ocultarPantallaCarga();
}

async function entrarListaGeneralDeudores(){
    try {
        let respuesta = await listaGeneralDeudores();
        if(respuesta == 1){
            mostrarPantallaError("No hay estudiantes registrados");
            return 0;
        }
        document.getElementById("main-container-TipoDeudores").style.display = "none";
        document.getElementById("main-container-ListaGeneralDeudores").style.display = "block";   
    } catch (error) {
        mostrarPantallaError(error);
    }
}

function atrasListaGeneralDeudores(){
    let tabla = document.getElementById("tabla-ListaGeneralDeudores");
    for(let i = tabla.rows.length - 1; i > 0; i--){
        if((tabla.rows[i].className == "deudores")){
            tabla.removeChild(tabla.lastChild);
        }
    }
    document.getElementById("main-container-TipoDeudores").style.display = "block";
    document.getElementById("main-container-ListaGeneralDeudores").style.display = "none";
}

function formularioInvalido(){

    if(document.getElementById("Grado-De-Instruccion-Deudores").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione el Grado de Instrucción");
        return 1;
    }
    if(document.getElementById("Seleccionar-cursoDeudores").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione el Curso");
        return 1;
    }
    if(document.getElementById("Seleccionar-SeccionDeudores").selectedIndex == 0){
        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione la Sección");
        return 1;
    }
}

function obtenerDirectorioSeccion(curso, seccion, annoConsultado){

    let grado;

    if(curso.includes("Nivel")){

        grado = "Preescolar";

    }

    if(curso.includes("Grado")){

        grado = "Primaria";

    }

    if(curso.includes("Año")){

        grado = "Bachillerato";

    }

    let directorioConsulta = "estudiantes/" + annoConsultado + "/" + grado + "/" + curso + " " + seccion + "/Estudiantes";
    
    return directorioConsulta;

}

function estudianteTieneConvenioActivo(estudiante, indice){

    let array = ["Inscripcion",
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

                 
    if(estudiante.hasOwnProperty("convenio" + array[indice])){
                     
        let fechaHoy = fechaDeHoyFormatoJS();

        let fechaConvenio = estudiante["convenio" + array[indice]];

        fechaConvenio = convertirAfechaHTML(fechaConvenio);

        if(!(fechaConvenioVencida(fechaConvenio, fechaHoy))) return true; //DEVUELVE FALSO SI EL DIA YA PASO
        
        return false;

    }

    return false;

}

function dibujarFilaDeudaEstudianteSeccionIndividual(estudiante){

    let col1 = crearTHconTexto(estudiante.nombres + " " + estudiante.apellidos);
    let col2 = crearTHconTexto(estudiante.nombreRepresentante);

    col1.style.fontWeight = "normal";
    col2.style.fontWeight = "normal";

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

    arrayCeldas.push(col1);
    arrayCeldas.push(col2);

    for(let i = 0; i <= arrayMeses.length - 1; i++){

        if(estudiante[arrayMeses[i]] == "N/A") arrayCeldas.push(crearTHconIcono("rsrcs/noAplica.png"));
        if(estudiante[arrayMeses[i]] == true) arrayCeldas.push(crearTHconIcono("rsrcs/check.png"));
        if(estudiante[arrayMeses[i]] == false){

            if(estudianteTieneConvenioActivo(estudiante, i)){

                arrayCeldas.push(crearTHconIcono("rsrcs/hourglass.png"));                

            }

            else arrayCeldas.push(crearTHconIcono("rsrcs/cross.png"));

        } 

    }

    let tabla = document.getElementById("tbodyListaDeudoresSeccion");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}

function dibujarFilaDeudaEstudianteDeudoresGeneral(estudiante, curso){

    let col1 = crearCeldaConTexto(estudiante.nombres + " " + estudiante.apellidos);
    let col2 = crearCeldaConTexto(estudiante.nombreRepresentante);
    let col3 = crearCeldaConTexto(curso);

    col2.style.border = "1px solid black";
    col1.style.border = "1px solid black";
    col3.style.border = "1px solid black";

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

    arrayCeldas.push(col2);
    arrayCeldas.push(col1);
    arrayCeldas.push(col3);

    for(let i = 0; i <= arrayMeses.length - 1; i++){

        if(estudiante[arrayMeses[i]] == "N/A") arrayCeldas.push(crearTHconIcono("rsrcs/noAplica.png"));
        if(estudiante[arrayMeses[i]] == true) arrayCeldas.push(crearTHconIcono("rsrcs/check.png"));
        if(estudiante[arrayMeses[i]] == false){

            if(estudianteTieneConvenioActivo(estudiante, i)){

                arrayCeldas.push(crearTHconIcono("rsrcs/hourglass.png"));                

            }

            else arrayCeldas.push(crearTHconIcono("rsrcs/cross.png"));

        }

    }

    let tabla = document.getElementById("tabla-ListaGeneralDeudores");

    tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));

}