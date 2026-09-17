/*global document, console */

export {precioDolar, 
        precioInscripcionPreescolar, 
        precioInscripcionPrimaria, 
        precioInscripcionBachillerato,
        verificarDolares, 
        verificarZelle, 
        verificarTransferencia, 
        annoEnCurso,
        precioMensualidadPreescolar,
        precioMensualidadPrimaria,
        precioMensualidadBachillerato,
        mensualidadPreescolarProntoPagoHermanos,
        mensualidadPrimariaProntoPagoHermanos,
        mensualidadBachilleratoProntoPagoHermanos,
        descuentoEmpleado,
        descuentoHermanos,
        descuentoProntoPagoInscripcion, 
        descuentoProntoPagoMensualidad, 
        precioCertificacionFondoNegro, 
        precioRetiroPapeles, 
        precioRetiroTitulo, 
        precioNotasCertificadas,
        precioMensualidadBachilleratoBasicoNoAlterado,
        precioMensualidadPrimariaNoAlterado,
        precioMensualidadPreescolarBasicoNoAlterado,
        precioPreinscripcionPreescolar,
        precioPreinscripcionPrimaria,
        precioPreinscripcionBachillerato,
        fechaMaximaDescuentoProntoPago,
};

import { ocultarPantallaCarga, mostrarPantallaCarga, mostrarPantallaError } from "./modal.js";

import { doc, getDoc, Base } from "./firebase.js";

import {atrasInscribirEstudiantes} from "./controlesGestionEstudiantes.js";

import { atrasPagosNuevosAdministrativos } from "./controlesAdministrativo.js";
import { numberAformatoMontos } from "./utilidades.js";

export {obtenerPrecioInscripcion, 
        obtenerPreciosMensualidad, 
        obtenerPrecioAdministrativo,
        obtenerPreciosPreinscripcion, 
        ajustarPreciosDescuentoEmpleado};

//INSCRIPCION

let precioInscripcionPreescolar = 0;
let precioInscripcionPrimaria = 0;
let precioInscripcionBachillerato = 0;
let fechaMaximaDescuentoProntoPago = "";

//MENSUALIDAD

let precioMensualidadPreescolar = 0;
let precioMensualidadPrimaria = 0;
let precioMensualidadBachillerato = 0;
let mensualidadPreescolarProntoPagoHermanos = 0;
let mensualidadPrimariaProntoPagoHermanos = 0;
let mensualidadBachilleratoProntoPagoHermanos = 0;

let precioMensualidadBachilleratoBasicoNoAlterado = 0;
let precioMensualidadPrimariaNoAlterado = 0;
let precioMensualidadPreescolarBasicoNoAlterado = 0;

//ADMINISTRATIVO

let precioCertificacionFondoNegro;
let precioRetiroPapeles;
let precioRetiroTitulo;
let precioNotasCertificadas;

//PREINSCRIPCION

let precioPreinscripcionPreescolar;
let precioPreinscripcionPrimaria;
let precioPreinscripcionBachillerato;


//DESCUENTOS

let descuentoHermanos = 0;
let descuentoEmpleado = 0;

let descuentoProntoPagoInscripcion = 0;
let descuentoProntoPagoMensualidad = 0;

//VARIABLES

let verificarDolares;
let verificarZelle;
let verificarTransferencia;
let precioDolar = 0;
let annoEnCurso = "";


async function obtenerPreciosPreinscripcion(){

    try {
    mostrarPantallaCarga();
    let obtenerPrecioInscripcion = doc(Base, "constantes", "precioPreinscripcion");
    let obtenidoPrecioInscripcion = await getDoc(obtenerPrecioInscripcion);
    let precioPreinscripcion = obtenidoPrecioInscripcion.data();

    //ESTABLECER PRECIOS Y VARIABLES

    precioPreinscripcionPreescolar = precioPreinscripcion.preescolar;
    precioPreinscripcionPrimaria = precioPreinscripcion.primaria;
    precioPreinscripcionBachillerato = precioPreinscripcion.bachillerato;
    precioDolar = precioPreinscripcion.dolar;
    annoEnCurso = precioPreinscripcion.AnnoEscolarEnCurso;
    
    //ESTABLECER VERIFICADORES
    
    if(precioPreinscripcion.requerirVerificarDolares == true){
      verificarDolares = "SI";
    }
    else{
      verificarDolares = "NO";
    }
    if(precioPreinscripcion.requerirVerificarTransferencia == true){
      verificarTransferencia = "SI";
    }
    else{
      verificarTransferencia = "NO";
    }
    if(precioPreinscripcion.requerirVerificarZelle == true){
      verificarZelle = "SI";
    }
    else{
      verificarZelle = "NO";
    }

    //ESTABLECER PRECIO DEL DOLAR EN LA PANTALLA DE PAGOS

    document.getElementById("precioDolarPantallaPagar").textContent = numberAformatoMontos(precioPreinscripcion.dolar);

    ocultarPantallaCarga();             
  } catch (error) {
    console.log("Error en la solicitud", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error de conexión. Verifique su conexión a Internet");
    return "ERROR";
  }

}

async function obtenerPrecioInscripcion(){
    try {
      mostrarPantallaCarga();
      let obtenerPrecioInscripcion = doc(Base, "constantes", "PrecioInscripcion");
      let obtenidoPrecioInscripcion = await getDoc(obtenerPrecioInscripcion);
      let PrecioInscripcion = obtenidoPrecioInscripcion.data();

      //ESTABLECER PRECIOS Y VARIABLES

      precioInscripcionPreescolar = PrecioInscripcion.inscripcionPreescolar;
      precioInscripcionPrimaria = PrecioInscripcion.inscripcionPrimaria;
      precioInscripcionBachillerato = PrecioInscripcion.inscripcionBachillerato;
      precioDolar = PrecioInscripcion.dolar;
      annoEnCurso = PrecioInscripcion.AnnoEscolarEnCurso;
      descuentoHermanos = PrecioInscripcion.DescuentoHermanos;
      descuentoEmpleado = PrecioInscripcion.DescuentoEmpleado;
      descuentoEmpleado = descuentoEmpleado / 100;
      descuentoProntoPagoInscripcion = PrecioInscripcion.DescuentoProntoPago;
      fechaMaximaDescuentoProntoPago = PrecioInscripcion.fechaMaximaProntoPago;

      
      //ESTABLECER VERIFICADORES
      
      if(PrecioInscripcion.requerirVerificarDolares == true){
        verificarDolares = "SI";
      }
      else{
        verificarDolares = "NO";
      }
      if(PrecioInscripcion.requerirVerificarTransferencia == true){
        verificarTransferencia = "SI";
      }
      else{
        verificarTransferencia = "NO";
      }
      if(PrecioInscripcion.requerirVerificarZelle == true){
        verificarZelle = "SI";
      }
      else{
        verificarZelle = "NO";
      }

      //ESTABLECER PRECIO DEL DOLAR EN LA PANTALLA DE PAGOS

      document.getElementById("precioDolarPantallaPagar").textContent = numberAformatoMontos(PrecioInscripcion.dolar);

      ocultarPantallaCarga();             
    } catch (error) {
      console.log("Error en la solicitud", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error de conexión. Verifique su conexión a Internet");
      atrasInscribirEstudiantes();
    }
  }

async function obtenerPreciosMensualidad(){
  try {
    let obtenerPrecioMensualidad = doc(Base, "constantes", "precioMensualidad");
    let obtenidoPrecioMensualidad = await getDoc(obtenerPrecioMensualidad);
    
    annoEnCurso = obtenidoPrecioMensualidad.data().AnnoEscolarEnCurso;

    //ASIGNAR COSTOS

    precioDolar = obtenidoPrecioMensualidad.data().dolar;
    console.log(obtenidoPrecioMensualidad.data());
    descuentoProntoPagoMensualidad = obtenidoPrecioMensualidad.data().DescuentoProntoPago;
    descuentoHermanos = obtenidoPrecioMensualidad.data().DescuentoHermanos;


    precioMensualidadBachillerato = obtenidoPrecioMensualidad.data().Bachillerato;
    precioMensualidadPrimaria = obtenidoPrecioMensualidad.data().Primaria;
    precioMensualidadPreescolar = obtenidoPrecioMensualidad.data().Preescolar;


    precioMensualidadBachilleratoBasicoNoAlterado = obtenidoPrecioMensualidad.data().Bachillerato;
    precioMensualidadPrimariaNoAlterado = obtenidoPrecioMensualidad.data().Primaria;
    precioMensualidadPreescolarBasicoNoAlterado = obtenidoPrecioMensualidad.data().Preescolar;


    mensualidadPreescolarProntoPagoHermanos = obtenidoPrecioMensualidad.data().preescolarHermanoProntoPago;
    mensualidadPrimariaProntoPagoHermanos = obtenidoPrecioMensualidad.data().primariaHermanoProntoPago;
    mensualidadBachilleratoProntoPagoHermanos = obtenidoPrecioMensualidad.data().bachilleratoHermanoProntoPago;
    descuentoEmpleado = obtenidoPrecioMensualidad.data().DescuentoEmpleado;
    descuentoEmpleado = descuentoEmpleado / 100;

    //VERIFICADORES

    if(obtenidoPrecioMensualidad.data().requerirVerificarDolares == true){
      verificarDolares = "SI";
    }
    else{
      verificarDolares = "NO";
    }
    if(obtenidoPrecioMensualidad.data().requerirVerificarTransferencia == true){
      verificarTransferencia = "SI";
    }
    else{
      verificarTransferencia = "NO";
    }
    if(obtenidoPrecioMensualidad.data().requerirVerificarZelle == true){
      verificarZelle = "SI";
    }
    else{
      verificarZelle = "NO";
    }

    //ESTABLECER PRECIO DEL DOLAR EN LA PANTALLA DE PAGOS

    document.getElementById("precioDolarPantallaPagar").textContent = numberAformatoMontos(obtenidoPrecioMensualidad.data().dolar);
    document.getElementById("annoEscolarMensualidad").value = annoEnCurso;

    return 0;
  } catch (error) {
    console.log("Error en la solicitud", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error Inesperado");
  }
}

async function obtenerPrecioAdministrativo(){
  try {
    mostrarPantallaCarga();
    let obtenerPrecioAdministrativo = doc(Base, "constantes", "precioAdministrativo");
    let obtenidoPrecioAdministrativo = await getDoc(obtenerPrecioAdministrativo);
    let PrecioAdministrativo = obtenidoPrecioAdministrativo.data();
    precioDolar = PrecioAdministrativo.dolar;
    precioCertificacionFondoNegro = PrecioAdministrativo.certificacionFondoNegro;
    precioRetiroPapeles = PrecioAdministrativo.retiroPapeles;
    precioRetiroTitulo = PrecioAdministrativo.retiroTitulo;
    precioNotasCertificadas = PrecioAdministrativo.notasCertificadas;
    if(PrecioAdministrativo.requerirVerificarDolares == true){
      verificarDolares = "SI";
    }
    else{
      verificarDolares = "NO";
    }
    if(PrecioAdministrativo.requerirVerificarTransferencia == true){
      verificarTransferencia = "SI";
    }
    else{
      verificarTransferencia = "NO";
    }
    if(PrecioAdministrativo.requerirVerificarZelle == true){
      verificarZelle = "SI";
    }
    else{
      verificarZelle = "NO";
    }

    //ESTABLECER PRECIO DEL DOLAR EN LA PANTALLA DE PAGOS

    document.getElementById("precioDolarPantallaPagar").textContent = numberAformatoMontos(PrecioAdministrativo.dolar);

    ocultarPantallaCarga();              
  } catch (error) {
    console.log("Error en la solicitud", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error de conexión. Verifique su conexión a Internet");
    atrasPagosNuevosAdministrativos();
  }
}


function ajustarPreciosDescuentoEmpleado(){
  precioMensualidadBachillerato = precioMensualidadBachillerato * descuentoEmpleado;
  precioMensualidadPrimaria = precioMensualidadPrimaria * descuentoEmpleado;
  precioMensualidadPreescolar = precioMensualidadPreescolar * descuentoEmpleado;
}