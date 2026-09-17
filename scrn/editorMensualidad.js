/*global document, console */

import { dibujarTablaEstudiante, guardarEstatusTabla, mesCambiado, mostrarTablaYboton, separarSufijoYprefijoDePropiedadEstudiante, tablaInvalida } from "./controlesEditorMensualidad.js";
import { Base, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "./firebase.js";
import {mostrarPantallaCarga, mostrarPantallaError, 
        ocultarPantallaCarga } from "./modal.js";
import { documentoDePagoExonerado } from "./objetos.js";
import { mostrarDocumentoEdicionMensualidad } from "./recibos.js";
import { eliminadorDeMetodos, fechaDeHoy } from "./utilidades.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

export {consultarEstudiantesEditor,
        actualizarMensualidades};

let arrayDirectorioEstudianteRepresentante = [];
let arrayDirectorioEstudianteSeccion = [];
let annoEscolarConsultado;
let arrayDatosEstudiante = [];

let cedulaRepresentanteEditor;
let nombreRepresentanteEditor;


function representanteInexistente(representante){

    return !representante.exists();

}

function noHayEstudiantes(estudiantes){

    let flag = false;

    estudiantes.forEach(estudiante => {

        flag = true;

    });

    return !flag;

}

//HAY QUE DIBUJAR LO QUE VA A MOSTRAR, YA TENGO LOS DATOS PARA ACTUALIZAR LA BASE DE DATOS

async function consultarEstudiantesEditor(){
    try {

        mostrarPantallaCarga();
        
        limpiarFilasTabla("tbodyMesesEditor", 2);

        arrayDirectorioEstudianteRepresentante = [];
        arrayDirectorioEstudianteSeccion = [];
        arrayDatosEstudiante = [];

        let directorioRepresentante;

        let directorioEstudiante;
        
        let cedulaRepresentante = document.getElementById("cedulaRepresentanteEditorMensualidad").value;

        let representante = await getDoc(doc(Base, "representantes", cedulaRepresentante));

        if(representanteInexistente(representante)){

            ocultarPantallaCarga();
            mostrarPantallaError("El representante no está registrado en la base de datos");
            return;

        }

        cedulaRepresentanteEditor = cedulaRepresentante;
        nombreRepresentanteEditor = representante.data().nombres + " " + representante.data().apellidos;

        let annoEscolarConsulta = document.getElementById("annoEscolarEditorMensualidad").value;

        annoEscolarConsultado = annoEscolarConsulta;

        let estudiantes = await getDocs(collection(Base, "representantes/"+ cedulaRepresentante +"/estudiantes" + annoEscolarConsulta));

        if(noHayEstudiantes(estudiantes)){

            ocultarPantallaCarga();
            mostrarPantallaError("El representante no tiene estudiantes registrados en este año escolar");
            return;            

        }

        let arrayInternoDatos = [];

        estudiantes.forEach(estudiante =>{

            arrayInternoDatos = [];

            dibujarTablaEstudiante(estudiante.data());

            if(annoEscolarConsultado == "2024-2025"){

              directorioEstudiante = "estudiantes/" + estudiante.data().grado + "/" + estudiante.data().curso + " " + estudiante.data().seccion + "/" + estudiante.data().cedula;
              directorioRepresentante = "representantes/" + cedulaRepresentante + "/estudiantes/";

            }
            else{

              directorioEstudiante = "estudiantes/" + annoEscolarConsultado + "/" + estudiante.data().grado + "/" + estudiante.data().curso + " " + estudiante.data().seccion + "/" + "Estudiantes/" + estudiante.data().cedula;
              directorioRepresentante = "representantes/" + cedulaRepresentante + "/estudiantes" + annoEscolarConsultado + "/";

            }

            
            arrayDirectorioEstudianteRepresentante.push(directorioRepresentante);
            arrayDirectorioEstudianteSeccion.push(directorioEstudiante);

            arrayInternoDatos.push(estudiante.data().nombres + " " + estudiante.data().apellidos);
            arrayInternoDatos.push(estudiante.data().curso);
            arrayInternoDatos.push(estudiante.data().cedula);

            arrayDatosEstudiante.push(arrayInternoDatos);

        });
        guardarEstatusTabla();
        mostrarTablaYboton();
        ocultarPantallaCarga();
    } catch (error) {
        console.log(error);
        ocultarPantallaCarga();
        mostrarPantallaError(error);


    }
}

async function actualizarMensualidades() {
    
    mostrarPantallaCarga();

    if(tablaInvalida()){

        ocultarPantallaCarga();
        mostrarPantallaError("No hubo cambios en la tabla");
        return;

    }


    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let IdPago = IdPagoObtener.numero + 1;

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

    let tabla = document.getElementById("tbodyMesesEditor");

    let documentoDePago;

    const recibo = new documentoDePagoExonerado(IdPago, 
                                                nombreRepresentanteEditor, 
                                                cedulaRepresentanteEditor,
                                                fechaDeHoy(),
                                                "Edición de Mensualidad");

    let nombreEstudiante;
    let cursoEstudiante;
    let mesRecibo;
    let nuevoEstado;
    let numeroPropiedad = 1;
    let cedulaEstudiante;

    debugger;

    for(let i = 2; i <= tabla.rows.length - 1; i++){

        for(let j = 0; j <= arrayMeses.length - 1; j++){

            if(mesCambiado(arrayMeses[j], i)){

                nuevoEstado = tabla.rows[i].cells[j+1].children[0].checked;
                
                nombreEstudiante = arrayDatosEstudiante[i-2][0];

                cursoEstudiante = arrayDatosEstudiante[i-2][1];

                cedulaEstudiante = arrayDatosEstudiante[i-2][2];

                mesRecibo = separarSufijoYprefijoDePropiedadEstudiante(arrayMeses[j]);

                recibo.insertarConceptoMensualidadExonerada(nombreEstudiante, mesRecibo, cursoEstudiante, nuevoEstado, numeroPropiedad);

                numeroPropiedad++;

                // i - 2 es el indice del estudiante

                await updateDoc(doc(Base, arrayDirectorioEstudianteRepresentante[i-2] + cedulaEstudiante), {[arrayMeses[j]]: nuevoEstado});
                await updateDoc(doc(Base, arrayDirectorioEstudianteSeccion[i-2]), {[arrayMeses[j]]:nuevoEstado}); 

            }

        }

    }

    documentoDePago = eliminadorDeMetodos(recibo);    
    await setDoc(doc(Base, "pagos/" + IdPago), documentoDePago);
    await updateDoc(obtenerNumeroDePago, {numero: IdPago});
    recibo.dibujarRecibo(document.getElementById("tablaTicketEdicionMensualidad"));
    mostrarDocumentoEdicionMensualidad();
    ocultarPantallaCarga();


}