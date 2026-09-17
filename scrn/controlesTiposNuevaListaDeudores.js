/*global document */

import { gestorGUIannoListaDeudores } from "./controlesNuevaListaDeudoresAnno.js";
import { gestorGUIseccionListaDeudores } from "./controlesNuevaListaDeudoresSeccion.js";
import { mostrarPantalla, ocultar } from "./funcionesHTML.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { obtenerPreciosMensualidad } from "./obtenerPrecios.js";

export class gestorGUI{

    async entrarTodasLasSecciones(){

        mostrarPantallaCarga();
        await obtenerPreciosMensualidad();

        ocultar("mainContainerNuevaListaDeudores");

        mostrarPantalla("mainContainerNuevaListaDeudoresAnno");

        let gestorGUIpantalla = new gestorGUIannoListaDeudores();

        gestorGUIpantalla.limpiarInterfaz();

        ocultarPantallaCarga();


    }

    async entrarUnaSeccion(){

        mostrarPantallaCarga();
        await obtenerPreciosMensualidad();

        ocultar("mainContainerNuevaListaDeudores");

        let gestorGUIpantalla = new gestorGUIseccionListaDeudores();

        gestorGUIpantalla.limpiarInterfaz();

        mostrarPantalla("mainContainerNuevaListaDeudoresSeccion");

        ocultarPantallaCarga();

    }

    salir(){

        ocultar("mainContainerNuevaListaDeudores");
        mostrarPantalla("main-container-postLogin");

    }

    entrarPantallaSeleccion(){

        ocultar("main-container-postLogin");
        mostrarPantalla("mainContainerNuevaListaDeudores");

    }

    

}

class mediador{

    salir(){

        let gestor = new gestorGUI();

        gestor.salir();

    }

    entrarPantallaSeleccion(){

        let gestor = new gestorGUI();

        gestor.entrarPantallaSeleccion();        

    }

    async entrarTodasLasSecciones(){

        let gestor = new gestorGUI();

        await gestor.entrarTodasLasSecciones();

    }

    async entrarUnaSeccion(){

        let gestor = new gestorGUI();

        await gestor.entrarUnaSeccion();

    }

}

export function salirTiposNuevaListaDeudores(){

    let media = new mediador();

    media.salir();

}

export function entrarPantallaSeleccionNuevaListaDeudores(){

    let mediar = new mediador();

    mediar.entrarPantallaSeleccion();

}

export async function entrarTodasLasSeccionesDeudores(){

    let mediar = new mediador();

    await mediar.entrarTodasLasSecciones();

}

export async function entrarUnaSeccionListaDeudoresNueva(){

    let mediar = new mediador();

    await mediar.entrarUnaSeccion();

}

export function obtenerIntervaloDeuda(estudiante, limite){

    let arrayConceptos = ["pagoInscripcion",
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

    let arrayMeses =       ["Inscripción",
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

    let objetoDeuda = {

        inicio: "",
        fin: ""

    };

    let resultado = "";

    if(estudiante.hasOwnProperty("pagoInscripcion") && !estudiante["pagoInscripcion"]) resultado = "Inscripción + ";    

    //SI EL ESTUDIANTE NO TIENE PAGO EL CONCEPTO, MIRA A VER SI EL OBJETO DEUDA INICIO ES VACIO
    //SI ES VACIO GUARDA EL MES AHI, SI NO ES VACIO, LO GUARDA EN OBJETO DEUDA FIN

    debugger;

    for(let i = 1; i <= arrayConceptos.length - 1; i++){

        if(estudiante[arrayConceptos[i]]) continue; //SI ESTA PAGO CONTINUA
        
        if(i > limite) break;

        if(objetoDeuda.inicio == "") objetoDeuda.inicio = arrayMeses[i];
        else objetoDeuda.fin = arrayMeses[i];



    }

    if(objetoDeuda.inicio != "" && objetoDeuda.fin != "") resultado += objetoDeuda.inicio + " - " + objetoDeuda.fin;

    if(objetoDeuda.inicio != "" && objetoDeuda.fin == "") resultado += objetoDeuda.inicio;

    if(objetoDeuda.inicio == "" && objetoDeuda.fin == "" && resultado == "") resultado = "SIN DEUDA";

    if(resultado == "Inscripción + ") return "Inscripción";

    return resultado;

}