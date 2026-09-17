/* global document, console */ 

export {inscribirEstudiante,
        verificarRepresentanteTipoInscripcion,
        estudiantesYaInscritos,
        estudiantesYaInscritosRepresentante,
        cedulaRepre};

import {representante,
        estudiante,
        estudianteRepresentante,
        reciboInscripcion} from "./objetos.js";

import {fechaDeHoy,
        eliminadorDeMetodos,
        verSiEsNumeroEntero} from "./utilidades.js";

import {mostrarPantallaCarga,
        ocultarPantallaCarga,
        mostrarPantallaError} from "./modal.js";

import {Base, getDoc, setDoc, doc, getDocs, collection, updateDoc} from "./firebase.js";

import {precioDolar as precioDolarInscripcion, 
        verificarDolares, 
        verificarTransferencia, 
        verificarZelle, 
        annoEnCurso}  from "./obtenerPrecios.js";

import { mostrarDocumentodePagoInscripcion } from "./recibos.js";
import { introducirDatosRepresentanteNoRegistradoAbono, escribirFormularioDigitalRepresentante, extraerPropiedadesAbono, obtenerAnnoEscolarInscripcion, llenarDatosRepresentanteNuevoIngreso, formularioInvalidoConsultaDatosNuevoIngreso, entrarPantallaFormularioInscripcion, llenarDatosRepresentanteProsecucion, formularioInvalidoConsultaDatosProsecucion, entrarPantallaSeleccionarEstudiantesProsecucion, flagRepresentanteRegistrado, flagAbonoRepreNoRegistrado } from "./controlesInscripcion.js";
import { setCedulaRepresentante, tipoDePago } from "./controlesEfectuarPago.js";
import { obtenerContenedoresAbono } from "./mensualidad.js";
import { mostrarModalProsecucion, escribirEstudianteTablaProsecucion } from "./modalProsecucion.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";
import { tipoInscripcion } from "./controlesGestionEstudiantes.js";
import { mostrarVariable } from "./debugWIndow.js";

let abonosRepreNoRegistrado = {};

let cedulaRepre;

async function verificarRepresentanteTipoInscripcion() {
  
  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0];

  let cedula = formulario.children[2].value;

  let representante = await getDoc(doc(Base, "representantes", cedula));

  if(!representante.exists()){

    return false;

  }

  return true;

}

export async function buscarRepresentanteNuevoIngreso(){

    mostrarPantallaCarga();

    let cedulaRepresentante = document.getElementById("cedulaRepresentanteNuevoIngreso").value;

    if(verSiEsNumeroEntero(cedulaRepresentante)){

      ocultarPantallaCarga();
      mostrarPantallaError("Inserte el número de cedula sin separaciones por favor");
      return;

    }

    let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
    if(!datosRepresentante.exists()){
      ocultarPantallaCarga();
      mostrarPantallaError("El representante no está registrado en la base de datos");
      return 0;
    }

    if(flagRepresentanteRegistrado && !datosRepresentante.data().hasOwnProperty("nombrePadre")){

      ocultarPantallaCarga();
      mostrarPantallaError("El representante no tiene todos los datos correspondientes, indique que no está registrado");
      return 0;

    }

    if(flagAbonoRepreNoRegistrado && datosRepresentante.data().hasOwnProperty("nombrePadre")){

      ocultarPantallaCarga();
      mostrarPantallaError("El representante ya está registrado en la base de datos, indique que ya está registrado en las cajas de selección");
      return 0;

    }

    cedulaRepre = cedulaRepresentante;

    mostrarVariable(cedulaRepre, "cedulaRepre", 4);

    llenarDatosRepresentanteNuevoIngreso(datosRepresentante.data());

    await realizarConsultaAbonos();

    ocultarPantallaCarga();

}

export async function continuarRepresentanteNuevoIngreso(){

    mostrarPantallaCarga();

    if(formularioInvalidoConsultaDatosNuevoIngreso()) return;

    let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepre));

    datosRepresentante = datosRepresentante.data();

    let objetoRepresentante;

    if(datosRepresentante.hasOwnProperty("nombrePadre")){

      objetoRepresentante = {
        nombres: datosRepresentante.nombres,
        apellidos: datosRepresentante.apellidos,
        cedula: datosRepresentante.cedula,
        telefono: datosRepresentante.telefono,
        tipoRepresentante: datosRepresentante.tipoRepresentante,
        direccionRepresentante: datosRepresentante.direccionRepresentante,
        nombrePadre: datosRepresentante.nombrePadre,
        cedulaPadre: datosRepresentante.cedulaPadre,
        nombreMadre: datosRepresentante.nombreMadre,
        cedulaMadre: datosRepresentante.cedulaMadre
      };

    }
    else{ //SI EL REPRESENTANTE NO ESTA REGISTRADO Y TIENE ABONO

      objetoRepresentante = {
        nombres: datosRepresentante.nombres,
        apellidos: datosRepresentante.apellidos,
        cedula: datosRepresentante.cedula,
        telefono: "",
        tipoRepresentante: "N/A",
        direccionRepresentante: "",
        nombrePadre: "",
        cedulaPadre: "",
        nombreMadre: "",
        cedulaMadre: "",
      };

    }

    escribirFormularioDigitalRepresentante(objetoRepresentante);

    entrarPantallaFormularioInscripcion();

    ocultarPantallaCarga();
  
}

export async function buscarRepresentanteProsecucion(){

  try {
    mostrarPantallaCarga();

    let cedulaRepresentante = document.getElementById("cedulaRepresentanteProsecucion").value;

    if(verSiEsNumeroEntero(cedulaRepresentante)){

      ocultarPantallaCarga();
      mostrarPantallaError("Inserte el número de cedula sin separaciones por favor");
      return;

    }

    let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
    if(!datosRepresentante.exists()){
      ocultarPantallaCarga();
      mostrarPantallaError("El representante no está registrado en la base de datos");
      return 0;
    }

    if(!datosRepresentante.data().hasOwnProperty("nombrePadre")){
      ocultarPantallaCarga();
      mostrarPantallaError("El representante no tiene estudiantes inscritos");
      return 0;
    }

    cedulaRepre = cedulaRepresentante;

    mostrarVariable(cedulaRepre, "cedulaRepre", 4);

    llenarDatosRepresentanteProsecucion(datosRepresentante.data());

    await realizarConsultaAbonos();

    ocultarPantallaCarga();
  } catch (error) {
    
    ocultarPantallaCarga();
    mostrarPantallaError(error);

  }

}

function obtenerDirectorioEstudiantesRepresentante(annoConsultado, cedula){

    let directorio;

    if(annoConsultado == "2024-2025"){

      directorio = "representantes/" + cedula + "/estudiantes";

    }
    else{

      directorio = "representantes/" + cedula + "/estudiantes" + annoConsultado;

    }

    return directorio;

}

export function continuarRepresentanteProsecucion(){

    if(formularioInvalidoConsultaDatosProsecucion()) return;

    document.getElementById("annoEscolarConsultaEstudiantesProsecucion").value = annoEnCurso;

    entrarPantallaSeleccionarEstudiantesProsecucion();
  
}

export async function buscarEstudiantesProsecucion(){

  mostrarPantallaCarga();

  let flag = false;

  limpiarFilasTabla("tablaDetallesEstudiantesProsecucion", 1);

  let anno = document.getElementById("annoEscolarConsultaEstudiantesProsecucion").value;

  let annoInscribir = document.getElementById("AnnoEscolarProsecucion").value;

  if(anno == annoInscribir){ //NO SE PUEDE REALIZAR UNA PROSECUCION DE UN AÑO A ESE MISMO AÑO

    ocultarPantallaCarga();
    mostrarPantallaError("Se está intentando una prosecución desde " + anno + " a " + annoInscribir);
    return;

  }

  let directorio = obtenerDirectorioEstudiantesRepresentante(anno, cedulaRepre);

  let estudiantes = await getDocs(collection(Base, directorio));

  let contenedorPantalla = document.getElementById("pantallaProsecucion");

  estudiantes.forEach(estudiant => {
      
    flag = true;
    escribirEstudianteTablaProsecucion(estudiant.data());

  });

  if(!flag){

    ocultarPantallaCarga();
    mostrarPantallaError("No hay estudiantes inscritos en dicho año escolar");
    return;

  }

  contenedorPantalla.style.display = "block";

  ocultarPantallaCarga();

  
}

async function realizarConsultaAbonos(){

  setCedulaRepresentante(cedulaRepre); //EN CONTROLES EFECTUAR PAGOS JS

  let representante = await getDoc(doc(Base, "representantes", cedulaRepre));

  obtenerContenedoresAbono(representante.data());

}

function cedulaInvalida(cedula){

  if(verSiEsNumeroEntero(cedula)){

    mostrarPantallaError("Inserte el número de cedula sin separaciones por favor");
    return 1;

  }

  if(cedula == ""){

    mostrarPantallaError("Inserte un numero de cédula para consultar por favor");
    return 1;

  }

  return 0;

}

async function verificarSiEstudianteEstaRegistrado(){
  try {
    let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
    let cedulaEstudiante;
    let gradoEstudiante;
    let cursoEstudiante;
    let seccionEstudiante;
    let directorio;
    let pruebaEstudiante;
    let contadorEstudiantes = 0;
    let arrayEstudiantes = [];
    for(let i = 1; i <= formularios.length - 1; i++){
      cedulaEstudiante = formularios[i].children[2].value;
      gradoEstudiante = formularios[i].children[4].value;
      cursoEstudiante = formularios[i].children[5].value;
      seccionEstudiante = formularios[i].children[6].value;
      directorio = "estudiantes/" + gradoEstudiante + "/" + cursoEstudiante + " " + seccionEstudiante;
      pruebaEstudiante = await getDoc(doc(Base, directorio, cedulaEstudiante));
      if(pruebaEstudiante.exists()){
        contadorEstudiantes++;
        arrayEstudiantes.push(cedulaEstudiante);
      }
    }

    if(contadorEstudiantes > 0){
      ocultarPantallaCarga();
      if(contadorEstudiantes == 1){
        mostrarPantallaError("El estudiante " + arrayEstudiantes[0] + " ya está registrado");
        return true;
      }
      else{
        mostrarPantallaError("Hay " + contadorEstudiantes + " estudiante(s) cuya cédula ya está registrada");
      }
    }
    else return false;
  } catch (error) {
    
  }
}

function obtenerObjetoEstudiante(formularios, indiceEstudiante){

  const estudia = new estudiante();

  //OBTENER DATOS

  estudia.obtenerDatosRepresentante(formularios[0]);
  estudia.obtenerDatos(formularios[indiceEstudiante]);
  estudia.solvenciaDeInscripcion();
  estudia.mesesPagadosInscripcion();

  return estudia;

}

function obtenerObjetoEstudianteRepresentante(formularios, indiceEstudiante){

  const estudia = new estudianteRepresentante();

  estudia.obtenerDatos(formularios[indiceEstudiante]);
  estudia.solvenciaDeInscripcion();
  estudia.mesesPagadosInscripcion();

  return estudia;

}

export async function registrarRepresentante(){

  let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

  //AQUI SE OBTIENEN LOS DATOS DEL REPRESENTANTE, LUEGO SE
  //PROCEDE A PREPARAR EL OBJETO PARA SUBIRLO

  const repre = new representante();

  repre.obtenerDatosRepresentante(formularios);
  let repreSubir = eliminadorDeMetodos(repre);
  

  await setDoc(doc(Base, "representantes/"+ repre.cedula), repreSubir);

}

async function subirRecibo(total, arrayTabla){

  let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

  const repre = new representante();
  repre.obtenerDatosRepresentante(formularios);

  let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
  let numeroDePago = await getDoc(obtenerNumeroDePago);
  let IdPagoObtener = numeroDePago.data();
  let IdPago = IdPagoObtener.numero + 1;
  let fechaProcesada = fechaDeHoy();

  const recibo = new reciboInscripcion(IdPago, repre.nombres + " " + repre.apellidos, repre.cedula,
                                           fechaProcesada, precioDolarInscripcion, total, "Inscripción", false);
  recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);
  
  recibo.rellenarReciboVer5();

  recibo.escribirReciboVer5(document.getElementById("tablaInscripcionImprimir"));
  
  let reciboSubir = eliminadorDeMetodos(recibo);

  await updateDoc(obtenerNumeroDePago, {numero: IdPago});
  await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);
}


export async function registrarRepresentanteConAbono(){

  let formularios = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");

  let represen = await getDoc(doc(Base, "representantes", cedulaRepre));

  let resultadoAbonos = obtenerContenedoresAbono(represen.data());

  if(resultadoAbonos) abonosRepreNoRegistrado = extraerPropiedadesAbono(represen.data());

  const repre = new representante();

  repre.introducirAbonoPrevio(abonosRepreNoRegistrado);
  abonosRepreNoRegistrado = {};


  repre.obtenerDatosRepresentante(formularios);
  let repreSubir = eliminadorDeMetodos(repre);
  

  await setDoc(doc(Base, "representantes/"+ repre.cedula), repreSubir);
}

async function inscribirEstudiante(total, arrayTabla){
    try {

      //if(tipoInscripcion == "Nuevo Ingreso"){

        //if(!flagRepresentanteRegistrado && !flagAbonoRepreNoRegistrado) await registrarRepresentante(); //SI NO ESTA REGISTRADO, REGISTRAR
        //if(flagAbonoRepreNoRegistrado) await registrarRepresentanteConAbono(); //SI TIENE ABONO Y NO ESTA REGISTRADO, REGISTRAR

        //AHORA EL SISTEMA NO REGISTRA A NADIE POR AQUI


      //}

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

        await subirRecibo(total, arrayTabla);
        ocultarPantallaCarga();
        mostrarDocumentodePagoInscripcion(); 
    } 
    catch (error) {
      console.log("Error al inscribir", error);
      ocultarPantallaCarga();
      mostrarPantallaError(error);
    }
  }

async function estudiantesYaInscritosRepresentante() {
  

  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
  let cedula;
  let cedulaRepresent = formulario[0].children[2].value;
  let estudiante;

  let idAnnoEscolar;

  if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
  if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

  let annoEscolar = document.getElementById(idAnnoEscolar).value;
  let directorioEstudiante;

  for(let i = 1; i <= formulario.length - 1; i++){

    cedula = formulario[i].children[2].value;
    
    directorioEstudiante = "representantes/" + cedulaRepresent + "/estudiantes" + annoEscolar + "/";
    
    estudiante = await getDoc(doc(Base, directorioEstudiante, cedula));

    if(estudiante.exists()){

      mostrarPantallaError("El estudiante con la cédula " + cedula + " ya está registrado en el mismo año escolar");
      return 1;

    }
    
  }

  return 0;

}


async function estudiantesYaInscritos(){ //SOLO PARA LA SECCION EN LA QUE ESTABA
                                         //FALTA HACER LO MISMO PERO PARA LA QUE SIGUE
                                         //USANDO AL DIRECTORIO DEL REPRESENTANTE PARA ESO
  
  mostrarPantallaCarga();

  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha");
  let cedula;
  let estudiante;

  let idAnnoEscolar;

  if(tipoInscripcion == "Nuevo Ingreso") idAnnoEscolar = "AnnoEscolarNuevoIngreso";
  if(tipoInscripcion == "Prosecucion") idAnnoEscolar = "AnnoEscolarProsecucion";

  let annoEscolar = document.getElementById(idAnnoEscolar).value;
  let directorioEstudiante;
  let gradoEstudiante;
  let cursoEstudiante;
  let seccionEstudiante;

  for(let i = 1; i <= formulario.length - 1; i++){

    cedula = formulario[i].children[2].value;
    gradoEstudiante = formulario[i].children[4].options[formulario[i].children[4].selectedIndex].textContent;
    cursoEstudiante = formulario[i].children[5].options[formulario[i].children[5].selectedIndex].textContent;
    seccionEstudiante = formulario[i].children[6].options[formulario[i].children[6].selectedIndex].textContent;
    
    directorioEstudiante = "estudiantes/" + annoEscolar + "/" + gradoEstudiante + "/";
    directorioEstudiante += cursoEstudiante + " " + seccionEstudiante+ "/Estudiantes/";
    
    estudiante = await getDoc(doc(Base, directorioEstudiante, cedula));

    if(estudiante.exists()){

      ocultarPantallaCarga();
      mostrarPantallaError("El estudiante con la cédula " + cedula + " ya está registrado en la sección que se le asignó");
      return 1;

    }
    
  }
  return 0;

}