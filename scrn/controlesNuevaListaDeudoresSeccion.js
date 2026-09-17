/*global document */

import { obtenerIntervaloDeuda } from "./controlesTiposNuevaListaDeudores.js";
import { mostrarBlock, mostrarBlockHTML, mostrarPantalla, ocultar, ocultarHTML } from "./funcionesHTML.js";
import { mostrarPantallaError, mostrarPantallaExito, ocultarPantallaCarga } from "./modal.js";
import { mediadorNuevaListaDeudoresSeccion } from "./nuevaListaDeudores.js";
import { annoEnCurso } from "./obtenerPrecios.js";
import { crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

export class gestorGUIseccionListaDeudores{

    limpiarInterfaz(){

        this.limpiarTabla();

        this.ocultarTabla();

        this.resetearSelects();

        document.getElementById("annoEscolarListaDeudoresSeccion").value = annoEnCurso;

    }

    formularioInvalido(){

        let selectGrado = document.getElementById("gradoDeInstruccionNuevaListaDeudores");

        let selectCurso = document.getElementById("cursoNuevaListaDeudores");

        let selectSeccion = document.getElementById("seccionNuevaListaDeudores");

        let selectMes = document.getElementById("mesConsultaNuevaListaDeudoresSeccion");

        if(selectGrado.selectedIndex == 0){

            ocultarPantallaCarga();
            mostrarPantallaError("Seleccione el grado de instrucción, por favor");
            return true;

        }

        if(selectCurso.selectedIndex == 0){

            ocultarPantallaCarga();
            mostrarPantallaError("Seleccione el curso, por favor");
            return true;

        }

        if(selectSeccion.selectedIndex == 0){

            ocultarPantallaCarga();
            mostrarPantallaError("Seleccione la sección, por favor");
            return true;

        }

        if(selectMes.selectedIndex == 0){

            ocultarPantallaCarga();
            mostrarPantallaError("Seleccione el mes hasta el que se va a consultar, por favor");
            return true;

        }

        return false;

    }

    limpiarTabla(){

        limpiarFilasTabla("tablaListaDeudoresSeccionNuevaLista", 1);

    }

    ocultarTabla(){

        ocultar("contenedorTablaListaDeudoresSeccionNuevaLista");
        ocultar("imprimirNuevaListaDeudoresSeccion");

    }

    mostrarTabla(){

        document.getElementById("contenedorTablaListaDeudoresSeccionNuevaLista").style.display = "block";
        mostrarBlock("imprimirNuevaListaDeudoresSeccion");

    }

    salir(){

        ocultar("mainContainerNuevaListaDeudoresSeccion");
        mostrarPantalla("mainContainerNuevaListaDeudores");
        this.limpiarInterfaz();

    }

    dibujarTabla(arrayEstudiantes, mesLimite, datos){

        let tabla = document.getElementById("tablaListaDeudoresSeccionNuevaLista");

        let deudaEstudiante;

        let nombreEstudiante;

        let seccion;

        let arrayCeldas = [];

        for(let i = 0; i <= arrayEstudiantes.length - 1; i++){

            arrayCeldas = [];

            deudaEstudiante = obtenerIntervaloDeuda(arrayEstudiantes[i], mesLimite);

            if(deudaEstudiante == "SIN DEUDA") continue;

            nombreEstudiante = arrayEstudiantes[i].nombres + " " + arrayEstudiantes[i].apellidos;

            seccion = datos.curso + " " + datos.seccion;

            arrayCeldas.push(crearCeldaConTexto(arrayEstudiantes[i].nombreRepresentante));
            arrayCeldas.push(crearCeldaConTexto(arrayEstudiantes[i].cedulaRepresentante));

            arrayCeldas.push(crearCeldaConTexto(nombreEstudiante));

            arrayCeldas.push(crearCeldaConTexto(seccion));

            arrayCeldas.push(crearCeldaConTexto(deudaEstudiante));

            tabla.appendChild(crearTRconCeldasApendadas(arrayCeldas));


        }

    }

    obtenerDatosConsulta(){


        let datosConsulta = {};

        let selectGrado = document.getElementById("gradoDeInstruccionNuevaListaDeudores");

        let selectCurso = document.getElementById("cursoNuevaListaDeudores");

        let selectSeccion = document.getElementById("seccionNuevaListaDeudores");

        let annoConsulta = document.getElementById("annoEscolarListaDeudoresSeccion").value;

        datosConsulta["grado"] = selectGrado.options[selectGrado.selectedIndex].textContent;

        datosConsulta["curso"] = selectCurso.options[selectCurso.selectedIndex].textContent;

        datosConsulta["seccion"] = selectSeccion.options[selectSeccion.selectedIndex].textContent;
        
        datosConsulta["annoEscolar"] = annoConsulta;

        return datosConsulta;



    }

    obtenerMesLimite(){

        let mesLimite = document.getElementById("mesConsultaNuevaListaDeudoresSeccion").selectedIndex;

        return mesLimite;


    }

    determinarSelectCurso(){

        let selectGrado = document.getElementById("gradoDeInstruccionNuevaListaDeudores");

        let selectCurso = document.getElementById("cursoNuevaListaDeudores");

        let cursos;

        let indice = selectGrado.selectedIndex;

        let arrayClases = ["NINGUNO",
                           "curso-preescolar",
                           "curso-primaria",
                           "curso-bachillerato"];

        selectCurso.selectedIndex = 0; 

        for(let i = 1; i <= 14; i++) ocultarHTML(selectCurso.children[i]);
        
        if(indice == 0) return;
        
        cursos = selectCurso.getElementsByClassName(arrayClases[indice]);

        for(let i = 0; i <= cursos.length - 1; i++) mostrarBlockHTML(cursos[i]);

    }

    resetearSelects(){

        let selectGrado = document.getElementById("gradoDeInstruccionNuevaListaDeudores");

        let selectCurso = document.getElementById("cursoNuevaListaDeudores");

        let selectSeccion = document.getElementById("seccionNuevaListaDeudores");

        let selectMes = document.getElementById("mesConsultaNuevaListaDeudoresSeccion");

        selectMes.selectedIndex = 0;

        selectGrado.selectedIndex = 0;

        selectCurso.selectedIndex = 0;

        selectSeccion.selectedIndex = 0;

        for(let i = 1; i <= 14; i++) ocultarHTML(selectCurso.children[i]);

    }

    noHayDeudores(){

        let tabla = document.getElementById("tablaListaDeudoresSeccionNuevaLista");

        return tabla.rows.length == 1;

    }

    pantallaNoHayDeudores(){

        mostrarPantallaExito("No hay deudores para el mes consultado");

    }

}

export function determinarSelectCurso(){

    let media = new mediadorNuevaListaDeudoresSeccion();

    media.determinarSelectCurso();

}

export function salir(){

    let media = new mediadorNuevaListaDeudoresSeccion();

    media.salir();

}