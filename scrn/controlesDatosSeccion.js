/*global document */

import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { annoEnCurso, obtenerPreciosMensualidad } from "./obtenerPrecios.js";

export {gradoDeInstruccionDatosSeccion, 
        atrasDatosSeccion, 
        entrarDatosSeccion,
        limpiarTablaDatosSeccion};

function gradoDeInstruccionDatosSeccion(){
    let preescolar = document.getElementById("Seleccionar-cursoDatosSeccion").getElementsByClassName("curso-preescolar");
    let primaria = document.getElementById("Seleccionar-cursoDatosSeccion").getElementsByClassName("curso-primaria");
    let bachillerato = document.getElementById("Seleccionar-cursoDatosSeccion").getElementsByClassName("curso-bachillerato");
    if(this.selectedIndex == 0){
        mostrarPantallaError("Seleccione un grado de instrucción por favor...");
        for(let i = 0; i <= 2; i++){
            preescolar[i].style.display = "block";
        }
        for(let i = 0; i <= 5; i++){
            primaria[i].style.display = "none";
        }
        for(let i = 0; i <= 4; i++){
            bachillerato[i].style.display = "none";
        }
        document.getElementById("Seleccionar-cursoDatosSeccion").selectedIndex = 0;
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
    document.getElementById("Seleccionar-cursoDatosSeccion").selectedIndex = 0;
}

async function entrarDatosSeccion(){
    mostrarPantallaCarga();
    await obtenerPreciosMensualidad();
    document.getElementById("annoEscolarDatosSeccion").value = annoEnCurso;
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-DatosSeccion").style.display = "block";
    ocultarPantallaCarga();
}

function atrasDatosSeccion(){
    document.getElementById("main-container-postLogin").style.display = "block";
    document.getElementById("main-container-DatosSeccion").style.display = "none";
    document.getElementById("cajaTablaDatosSeccion").style.display = "none";
    document.getElementById("Grado-De-Instruccion-DatosSeccion").selectedIndex = 0;
    document.getElementById("Seleccionar-cursoDatosSeccion").selectedIndex = 0;
    document.getElementById("Seleccionar-SeccionDatosSeccion").selectedIndex = 0;
    let curso = document.getElementById("Seleccionar-cursoDatosSeccion");
    for(let i = 1; i <= curso.children.length - 1; i++){
        curso.children[i].style.display = "none";
    }
    limpiarTablaDatosSeccion();
}

function limpiarTablaDatosSeccion(){
    let tabla = document.getElementById("tabla-Lista-DatosSeccion");

    while(tabla.rows.length >= 2){
        tabla.lastChild.remove();
    }
}