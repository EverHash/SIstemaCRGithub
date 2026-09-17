/*global document, console */

import { flagAbonoRepreNoRegistrado, flagRepresentanteRegistrado, obtenerAnnoEscolarInscripcion } from "./controlesInscripcion.js";
import { determinarMontoTotalAbonado } from "./controlesMensualidad.js";
import { gestorFormularioPreinscripcion } from "./controlesPreinscripcion.js";
import { Base, doc, getDoc, setDoc, updateDoc } from "./firebase.js";
import { asignarValueInput, consultarInputText, ocultar } from "./funcionesHTML.js";
import { registrarRepresentante, registrarRepresentanteConAbono } from "./inscribir.js";
import { obtenerContenedoresAbono } from "./mensualidad.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { estudiante, estudianteRepresentante, reciboPreinscripcion } from "./objetos.js";
import { precioDolar, verificarDolares, verificarTransferencia, verificarZelle } from "./obtenerPrecios.js";
import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";
//import { precioDolar, verificarDolares, verificarTransferencia, verificarZelle } from "./obtenerPrecios.js";
import { mostrarDocumentodePagoInscripcion, mostrarDocumentoDePagoPreinscripcion } from "./recibos.js";
import { eliminadorDeMetodos, fechaDeHoy } from "./utilidades.js";

export let representantePreinscripcionDatos;

export {conexionBD as conexionBDpreinscripcion};

class conexionBD{

  async consultarRepresentante(){// LA PRIMERA PANTALLA

    try {

      mostrarPantallaCarga();

      let cedula = consultarInputText("cedulaRepresentantePreinscribir");

      if(cedula == ""){

        ocultarPantallaCarga();
        mostrarPantallaError("Ingrese una cédula para consultar, por favor");
        return;

      }
  
      let representante = await getDoc(doc(Base, "representantes", cedula));

      if(!representante.exists()){

        ocultarPantallaCarga();
        mostrarPantallaError("El representante no está registrado");
        return;

      }

      if(!representante.data().hasOwnProperty("nombrePadre")){

        ocultarPantallaCarga();
        mostrarPantallaError("El representante no está registrado con todos sus datos, contacte al desarrollador");
        return;        

      }

      let datos = representante.data();

      asignarValueInput("nombresRepresentantePreinscripcion", datos.nombres);
      asignarValueInput("apellidosRepresentantePreinscripcion", datos.apellidos);

      let totalAbonado = determinarMontoTotalAbonado(datos);

      asignarValueInput("totalAbonadoRepresentantePreinscripcion", totalAbonado);

      obtenerContenedoresAbono(datos);

      ocultarPantallaCarga();

      representantePreinscripcionDatos = datos; //PARA PODER CONSULTARLO EN EL MODULO DE CONTROLESPREINSCRIPCION
      
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

  }

  async estudianteRepresentanteExiste(cedulaEstudiante, annoConsultado){

    try {

      let cedulaRepre = representantePreinscripcionDatos.cedula;
  
      let directorioEstudiante = "representantes/" + cedulaRepre + "/estudiantes" + annoConsultado + "/";
  
      let estudia = await getDoc(doc(Base, directorioEstudiante, cedulaEstudiante));
      
      if(estudia.exists()) return true;

      return false;
      
    } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError(error);
      return "ERROR";
    }


  }

  async estudianteYaExisteSeccion(datosEstudiante, annoConsultado){

    try {

      let directorioEstudiante;

      directorioEstudiante = "estudiantes/" + annoConsultado + "/" + datosEstudiante.grado + "/";
      directorioEstudiante += datosEstudiante.curso + " " + datosEstudiante.seccion + "/Estudiantes/";
      
      let estudia = await getDoc(doc(Base, directorioEstudiante, datosEstudiante.cedula));

      if(estudia.exists()) return true;

      return false;
      
    } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError(error);
      return "ERROR";
    }


  }

  async preinscribir(total, arrayTabla) {

    mostrarPantallaCarga();
    
    let estudiante;

    let repre = representantePreinscripcionDatos;

    asignarCedulaRepresentanteMetodosPagos(repre.cedula);

    let directorioEstudiante;

    let directorioEstudianteRepre;

    let annoPreinscrito = consultarInputText("annoEscolarPreinscripcion");

    //OBTENEMOS Y PREPARAMOS EL OBJETO, SOLO HAY QUE PONERLE LAS PROPIEDADES, PARA ESO EL ARRAY

    let arrayPropiedades = ["pagoInscripcion",
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

    for(let i = 1; i <= gestorFormularioPreinscripcion.arrayListaPaginas.length - 1; i++){

      estudiante = gestorFormularioPreinscripcion.obtenerInformacionFormulario(i);

      for(let j = 0; j <= arrayPropiedades.length - 1; j++) estudiante[arrayPropiedades[j]] = false;

      estudiante["tipoRepresentante"] = ""; //SE LO PONGO SOLO PARA QUE LOS OBJETOS EN LA BASE DE DATOS COINCIDAN CON ESTE
      estudiante["cedulaRepresentante"] = repre.cedula;
      estudiante["nombreRepresentante"] = repre.nombres + " " + repre.apellidos;

          //FORMANDO EL DIRECTORIO AL QUE SE VA A SUBIR EL OBJETO DE ESTUDIANTE

      directorioEstudiante = "estudiantes/" + annoPreinscrito + "/" + estudiante.grado + "/";
      directorioEstudiante += estudiante.curso + " " + estudiante.seccion + "/Estudiantes/";

      //FORMANDO EL DIRECTORIO AL QUE SE VA A SUBIR EL OBJETO DE ESTUDIANTE REPRESENTANTE

      directorioEstudianteRepre = "representantes/" + repre.cedula + "/estudiantes" + annoPreinscrito + "/";
      directorioEstudianteRepre += estudiante.cedula;

      //YA ESTA LISTO PARA SUBIR

      await setDoc(doc(Base, directorioEstudiante, estudiante.cedula), estudiante);    
      await setDoc(doc(Base, directorioEstudianteRepre), estudiante);    

    }

    await this.subirYdibujarRecibo(total, arrayTabla, repre);

    ocultarPantallaCarga();

    mostrarDocumentoDePagoPreinscripcion();

  }

  async subirYdibujarRecibo(total, arrayTabla, repre){
    try {
      let fechaProcesada = fechaDeHoy();
      let documentoDePago;

      let nombreCompletoRepresentante = repre.nombres + " " + repre.apellidos;

      let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
      let numeroDePago = await getDoc(obtenerNumeroDePago);
      let IdPagoObtener = numeroDePago.data();
      let IdPago = IdPagoObtener.numero + 1;

      const recibo = new reciboPreinscripcion(IdPago,
                                              nombreCompletoRepresentante,
                                              repre.cedula,
                                              fechaProcesada,
                                              precioDolar,
                                              total, 
                                              "Preinscripción",
                                              false);

      recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);

      recibo.rellenarReciboVer5();

      documentoDePago = eliminadorDeMetodos(recibo);
      await setDoc(doc(Base, "pagos/" + IdPago), documentoDePago);
      await updateDoc(obtenerNumeroDePago, {numero: IdPago});
      recibo.escribirReciboVer5(document.getElementById("tablaPreinscripcionImprimir"));

    } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError(error);
      return "ERROR";
    }

  }

}

export async function obtenerDatosRepresentantePreinscripcion(){

  let conexion = new conexionBD();

  await conexion.consultarRepresentante();

}

export async function preinscribir(total, arrayTabla){

  let conexion = new conexionBD();

  await conexion.preinscribir(total, arrayTabla);

}
















































function obtenerObjetoEstudiante(formularios, indiceEstudiante){

  const estudia = new estudiante();

  //OBTENER DATOS

  estudia.obtenerDatosRepresentante(formularios[0]);
  estudia.obtenerDatos(formularios[indiceEstudiante]);

  estudia.pagoInscripcion = false;

  return estudia;

}

function obtenerObjetoEstudianteRepresentante(formularios, indiceEstudiante){

  const estudia = new estudianteRepresentante();

  estudia.obtenerDatos(formularios[indiceEstudiante]);

  estudia.pagoInscripcion = false;

  return estudia;

}

export async function preinscribirEstudiante(total, arrayTabla){
    try {


      if(!flagRepresentanteRegistrado && !flagAbonoRepreNoRegistrado) await registrarRepresentante(); //SI NO ESTA REGISTRADO, REGISTRAR
      if(flagAbonoRepreNoRegistrado) await registrarRepresentanteConAbono(); //SI TIENE ABONO Y NO ESTA REGISTRADO, REGISTRAR


      let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
      let estudianteSubir, estudianteRepreSubir;
      let estudia;
      let estudianteRepre;
      let annoEscolar = obtenerAnnoEscolarInscripcion();
      let directorioEstudiante;
      let directorioEstudianteRepre;
      let cedulaRepresentante = formularios[0].children[2].value;



      //BUCLE DE ASIGNACION Y SUBIDA DE DATOS

        for(let i = 1; i <= formularios.length - 1; i++){

          //ASIGNACION DE DATOS REQUERIDOS
          
          estudia = obtenerObjetoEstudiante(formularios, i);
          estudianteRepre = obtenerObjetoEstudianteRepresentante(formularios, i);     

          //CREAR LOS OBJETOS SIN METODOS PARA QUE PUEDAN SER SUBIDOS
          //A FIREBASE

          estudianteSubir = eliminadorDeMetodos(estudia);
          estudianteRepreSubir = eliminadorDeMetodos(estudianteRepre);

          //FORMANDO EL DIRECTORIO AL QUE SE VA A SUBIR EL OBJETO DE ESTUDIANTE

          directorioEstudiante = "estudiantes/" + annoEscolar + "/" + estudianteRepre.grado + "/";
          directorioEstudiante += estudianteRepre.curso + " " + estudianteRepre.seccion + "/Estudiantes/";

          //FORMANDO EL DIRECTORIO AL QUE SE VA A SUBIR EL OBJETO DE ESTUDIANTE REPRESENTANTE

          directorioEstudianteRepre = "representantes/" + cedulaRepresentante + "/estudiantes" + annoEscolar + "/";
          directorioEstudianteRepre += estudia.cedula;

          //SUBIENDO A FIREBASE

          await setDoc(doc(Base, directorioEstudiante, estudia.cedula), estudianteSubir);    
          await setDoc(doc(Base, directorioEstudianteRepre), estudianteRepreSubir);    
        }

        //await subirRecibo(total, arrayTabla);
        ocultarPantallaCarga();
        mostrarDocumentodePagoInscripcion(); 
    } 
    catch (error) {
      console.log("Error al inscribir", error);
      ocultarPantallaCarga();
      mostrarPantallaError(error);
    }
  }

// async function subirRecibo(total, arrayTabla){

//   let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

//   const repre = new representante();
//   repre.obtenerDatosRepresentante(formularios);

//   let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
//   let numeroDePago = await getDoc(obtenerNumeroDePago);
//   let IdPagoObtener = numeroDePago.data();
//   let IdPago = IdPagoObtener.numero + 1;
//   let fechaProcesada = fechaDeHoy();

//   const recibo = new reciboPreinscripcion(IdPago, repre.nombres + " " + repre.apellidos, repre.cedula,
//                                            fechaProcesada, precioDolar, total, "Preinscripción", false);
//   recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);
  
//   recibo.rellenarReciboVer5();

//   recibo.escribirReciboVer5(document.getElementById("tablaInscripcionImprimir"));
  
//   let reciboSubir = eliminadorDeMetodos(recibo);

//   await updateDoc(obtenerNumeroDePago, {numero: IdPago});
//   await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);
// }