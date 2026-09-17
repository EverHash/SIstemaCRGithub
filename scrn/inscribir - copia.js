/* global document, console */ 

export {inscribirEstudiante,
        botonBuscarRepresentante,
        buscarRepresentanteAbono,
        verificarRepresentanteTipoInscripcion};

import {representante,
        estudiante,
        estudianteRepresentante,
        reciboInscripcion} from "./objetos.js";

import {fechaDeHoy,
        truncarDecimales,
        eliminadorDeMetodos,
        numberAformatoMontos,
        formatoMontosAnumber,
        productoPrecision2,
        restaDecimal,
        sumaDecimal, 
        subcadenaDesdeIndice,
        divisionPrecision2,
        agregarPagoAlRegistroDeRepresentante,
        verSiEsNumeroEntero} from "./utilidades.js";

import {mostrarPantallaCarga,
        ocultarPantallaCarga,
        mostrarPantallaError,
        mostrarPantallaNotificacion} from "./modal.js";

import {Base, getDoc, setDoc, doc, updateDoc, getDocs, collection} from "./firebase.js";

import {precioDolar as precioDolarInscripcion, 
        verificarDolares, 
        verificarTransferencia, 
        verificarZelle, 
        precioInscripcionBachillerato, 
        precioInscripcionPreescolar, 
        precioInscripcionPrimaria,
        annoEnCurso}  from "./obtenerPrecios.js";

import { mostrarDocumentodePagoInscripcion } from "./recibos.js";
import { arrayPaginasInscribir, escribirFormularioDigitalEstudiante, escribirFormularioDigitalRepresentante, inicializarArrayPaginasInscribirConsulta, obtenerAnnoEscolarInscripcion, tipoDescuentoDeterminado } from "./controlesInscripcion.js";
import { setCedulaRepresentante, tipoDePago } from "./controlesEfectuarPago.js";
import { obtenerContenedoresAbono } from "./mensualidad.js";
import { mostrarModalProsecucion, escribirEstudianteTablaProsecucion, buscarEstudiantesSeleccionadosModalProsecucion } from "./modalProsecucion.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

async function verificarRepresentanteTipoInscripcion() {

  mostrarPantallaCarga();
  
  let formulario = document.getElementsByClassName("subcajaFormularioInscripcionDerecha")[0];

  let cedula = formulario.children[2].value;

  let representante = await getDoc(doc(Base, "representantes", cedula));

  if(!representante.exists()){

    ocultarPantallaCarga();
    return false;

  }

  let datos = representante.data();

  if(datos.hasOwnProperty("nombrePadre")){

    ocultarPantallaCarga();
    return true;

  }

}

async function buscarRepresentante(){
  try {
    let cedulaRepresentante = document.getElementById("cedulaConsultarRepresentanteInscripcion").value;
    let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
    if(!datosRepresentante.exists()){
      mostrarPantallaError("El representante no está registrado en la base de datos");
      return 0;
    }
    let objetoRepresentante = {
      nombres: datosRepresentante.data().nombres,
      apellidos: datosRepresentante.data().apellidos,
      cedula: datosRepresentante.data().cedula,
      telefono: datosRepresentante.data().telefono,
      tipoRepresentante: datosRepresentante.data().tipoRepresentante,
      direccionRepresentante: datosRepresentante.data().direccionRepresentante,
      nombrePadre: datosRepresentante.data().nombrePadre,
      cedulaPadre: datosRepresentante.data().cedulaPadre,
      nombreMadre: datosRepresentante.data().nombreMadre,
      cedulaMadre: datosRepresentante.data().cedulaMadre
    };
    console.log(datosRepresentante.data());
    escribirFormularioDigitalRepresentante(objetoRepresentante);
    await realizarConsultaAbonos();
  } 
  catch(error) {
    ocultarPantallaCarga();
    console.log("ERROR AL BUSCAR: ", error);
    mostrarPantallaError("Error Inesperado");
  }
}

async function realizarConsultaAbonos(){

  let cedula;

  if(tipoDePago == "Inscripcion"){

    cedula = document.getElementById("cedulaConsultarAbonoInscripcion").value;
    
  }
  else{
    
    cedula = document.getElementById("cedulaConsultarRepresentanteInscripcion").value;

  }

  setCedulaRepresentante(cedula);

  let representante = await getDoc(doc(Base, "representantes", cedula));

  if(!representante.exists()){

    return 1;

  }

  let resultadoAbonos = obtenerContenedoresAbono(representante.data());

}

async function buscarRepresentanteAbono(){

  //ESTO ES UNA FORMA DE EVITAR QUE ME QUITE LA PANTALLA DE CARGA
  //EN LAS CONSULTAS DE REPRESENTANTES EN AGREGAR Y EN PROSECUCION
  //LA PANTALLA DE CARGA LA NECESITO PARA QUE EL USUARIO NO ROMPA
  //LA INTERFAZ SI ES LO SUFICIENTEMENTE RAPIDO PARA DAR CLIC A
  //SIGUIENTE ANTES DE QUE EL SISTEMA OBTENGA LOS DATOS DE LOS
  //ESTUDIANTES Y CREE LOS FORMULARIOS

  mostrarPantallaCarga();

  await realizarConsultaAbonos();

  ocultarPantallaCarga();

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

async function botonBuscarRepresentante(){

  mostrarPantallaCarga();

  let cedulaConsulta = document.getElementById("cedulaConsultarRepresentanteInscripcion").value;

  if(cedulaInvalida(cedulaConsulta)){

    ocultarPantallaCarga();
    return;

  }

  let annoEscolar = annoEnCurso;

  let flag = false;

  let directorio;

  let representante = await getDoc(doc(Base, "representantes", cedulaConsulta));

  let annoEscolarConsultaInscripcion = document.getElementById("annoEscolarConsultaInscripcion").value;

  if(!representante.exists()){

    ocultarPantallaCarga();
    mostrarPantallaError("El representante no está registrado en la base de datos");
    return;

  }

  if(tipoDePago == "Reinscripcion"){

    limpiarFilasTabla("tablaDetallesEstudiantesProsecucion", 1);

    await buscarRepresentante();

    if(annoEscolarConsultaInscripcion == "2024-2025"){

      directorio = "representantes/" + cedulaConsulta + "/estudiantes";

    }
    else{

      directorio = "representantes/" + cedulaConsulta + "/estudiantes" + annoEscolar;

    }

    let estudiantes = await getDocs(collection(Base, directorio));

    estudiantes.forEach(estudiant => {
      

      flag = true;
      console.log(estudiant.data());
      escribirEstudianteTablaProsecucion(estudiant.data());
      //escribirFormularioDigitalEstudiante(estudiant.data(), numero, true);
      //numero++;

    });

    mostrarModalProsecucion();

  }

  ocultarPantallaCarga();

  return;

}

function separarElementosDeUnArrayConUnaComa(array){
  let resultado = "";
  for(let i = 0; i <= array.length - 1; i++){
    if(i == array.length - 1){
      resultado += ", " + array[i];
      break;
    }
    if(i == 0){
      resultado += array[i] + ", ";
      continue;
    }
    resultado += ", " + array[i];
  }
  return resultado;
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

async function registrarRepresentante(){

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


async function inscribirEstudiante(total, arrayTabla){
    try {

      debugger;

      if(tipoDePago == "Inscripcion"){

        await registrarRepresentante();

      }

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