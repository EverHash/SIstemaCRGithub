/*global document, console */

import { mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError, mostrarPantallaExito} from "./modal.js";
import {convertirAfechaHTML, eliminadorDeMetodos, 
        fechaDeHoy,
        fechaDeHoyFormatoJS} from "./utilidades.js";
import {precioDolar} from "./obtenerPrecios.js";

import { tablaConsultarBuscarEstudiantes, dibujarTablaConsultar, consultarEstudianteParticular, volverPantallaPagosApantallaConsultarRepresentante, validarFormularioConsultarRepresentante, ocultarElementosInterazConsultarRepresentante, mostrarElementosInterazConsultarRepresentante, validarCheckboxesConsultarEstudiantes, determinarMontoTotalAbonado } from "./controlesMensualidad.js";
import { getDoc, doc, collection, getDocs, updateDoc, setDoc, Base } from "./firebase.js";
import { reciboMensualidad } from "./objetos.js";
import { mostrarDocumentodePagoMensualidad } from "./recibos.js";
import { verificarDolares, verificarTransferencia, verificarZelle } from "./obtenerPrecios.js";
import { setCedulaRepresentante } from "./controlesEfectuarPago.js";
import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";
import { estudianteTieneConvenioPorMes, fechaConvenioVencida } from "./controlesConvenioPagos.js";
import { procesarPagoConvenio } from "./conveniosPagos.js";

export {buscarEstudiantesParaConsultar,
        consultarEstudiantes, 
        efectuarPagoIndividual, 
        tipoRepresentante, 
        contadorHermanos, 
        contenedoresAbonos,
        annoEscolarConsultado,
        obtenerContenedoresAbono};

let tipoRepresentante;
let cedulaRepre;
let nombreRepre;
let contadorHermanos = 0;
let annoEscolarConsultado;

//WARNING: EL SISTEMA PIDE ARITMETICA DECIMAL (NO ME CONTO UN 0,01 Y LE PUSE EL MONTO EXACTO)

let contenedoresAbonos = [];

function obtenerContenedoresAbono(datosRepresentante){
  contenedoresAbonos = [];
  for(let propiedad in datosRepresentante){
    if(propiedad.includes("abonos")){
      contenedoresAbonos.push(datosRepresentante[propiedad]);
    }
  }
  console.log(contenedoresAbonos);
  if(contenedoresAbonos == []) return false;
  else return true;
}

export function reiniciarContenedoresAbono(){

  contenedoresAbonos = [];

}

async function obtenerRepresentante(cedulaRepresentante){

  let nombreRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
  if(!nombreRepresentante.exists()){
    ocultarPantallaCarga();
    mostrarPantallaError("El representante no está registrado en la base");
    return 1;
  }
  else return nombreRepresentante;

}

async function buscarEstudiantesParaConsultar(){
    try {
      mostrarPantallaCarga();
      ocultarElementosInterazConsultarRepresentante();

      let vacio = true; //PARA SABER SI HAY ESTUDIANTES REPRESENTADOS


      let formularioInvalido = validarFormularioConsultarRepresentante();

      if(formularioInvalido){

        ocultarPantallaCarga();
        return 0;

      }

      //SE VALIDA QUE EXISTA EL REPRESENTANTE EN LA BASE DE DATOS
      //SE VALIDA QUE EXISTA EL REPRESENTANTE EN LA BASE DE DATOS
      //SE VALIDA QUE EXISTA EL REPRESENTANTE EN LA BASE DE DATOS

      let cedulaRepresentante = document.getElementById("cedula-representante-consultar").value;
      
      
      cedulaRepre = cedulaRepresentante; //ESTA VARIABLE ES PARA USARSE EN OTRO .JS


      let datosRepresentante = await obtenerRepresentante(cedulaRepresentante);

      if(datosRepresentante == 1) return 0; //REPRESENTANTE NO EXISTE

      document.getElementById("totalAbonosRepresentanteConsultar").value = determinarMontoTotalAbonado(datosRepresentante.data());

      if(datosRepresentante.data().tipoRepresentante == "Empleado") tipoRepresentante = "Empleado";
      else tipoRepresentante = "Regular";

      console.log(datosRepresentante.data());


      //SE ASIGNAN VARIABLES CON LA CEDULA PARA USARSE EN OTROS MODULOS
      //SE ASIGNAN VARIABLES CON LA CEDULA PARA USARSE EN OTROS MODULOS
      //SE ASIGNAN VARIABLES CON LA CEDULA PARA USARSE EN OTROS MODULOS

      
      setCedulaRepresentante(cedulaRepresentante);
      asignarCedulaRepresentanteMetodosPagos(cedulaRepresentante);


      //SE COLOCA EL CONTADOR DE HERMANOS EN 0
      //ESTO ES PARA EVITAR UN BUG EN EL QUE SE LE DA
      //DESCUENTO DE HERMANOS A UN ESTUDIANTES QUE ES SOLO

      contadorHermanos = 0;

      //SE OBTIENEN LOS ABONOS QUE TENGA EL REPRESENTANTE
      //ESTO SE HACE PARA QUE FUNCIONE EL BOTON DE ABONOS DEL REPRESENTANTE
      //SIN HACER UNA NUEVA PETICION A LA BASE DE DATOS

      obtenerContenedoresAbono(datosRepresentante.data());


      document.getElementById("mes-en-curso").selectedIndex = 12;

      
      //LIMPIAR LA TABLA
      //LIMPIAR LA TABLA
      //LIMPIAR LA TABLA


      limpiarFilasTabla("tabla-consultar-estudiante-encabezado", 1);
      
    
      nombreRepre = datosRepresentante.data().nombres + " " + datosRepresentante.data().apellidos;
      document.getElementById("nombre-representante-consultar").value = nombreRepre;

      //AQUI ES DONDE SE PERMITE QUE LA BASE DE DATOS 
      //PUEDA LEER OTROS AÑOS ESCOLARES
      //PARA NO MOVER EL RESTO DE DATOS, SE PUSO
      //UN CONDICIONAL, PARA LUEGO CONSTRUIR LA CADENA
      //DEL DIRECTORIO A ACCEDER EN LA BASE DE DATOS


      annoEscolarConsultado = document.getElementById("annoEscolarMensualidad").value;

      let directorio;

      if(annoEscolarConsultado == "2024-2025"){

        directorio = "representantes/"+ cedulaRepresentante +"/estudiantes";

      }
      else{

        directorio = "representantes/"+ cedulaRepresentante +"/estudiantes" + annoEscolarConsultado;

      }
      
      let estudiantesRepresentados = await getDocs(collection(Base, directorio));
      
      //SE CUENTAN LOS ESTUDIANTES REPRESENTADOS
      //CON EL PROPOSITO DE USARSE ESTA VARIABLE
      //EN EL MODULO DE CONTROLES MENSUALIDAD
      
      estudiantesRepresentados.forEach((documento) => {
        contadorHermanos++;
      });

      //SE HACE LA TABLA DE TODOS LOS ESTUDIANTES REPRESENTADOS
      //SE HACE LA TABLA DE TODOS LOS ESTUDIANTES REPRESENTADOS
      //SE HACE LA TABLA DE TODOS LOS ESTUDIANTES REPRESENTADOS

      estudiantesRepresentados.forEach((documento) => {

        vacio = false;
        console.log(documento.data());
        tablaConsultarBuscarEstudiantes(eliminadorDeMetodos(documento.data()));

      });


      
      if(vacio == true){
        ocultarPantallaCarga();
        mostrarPantallaError("El representante no tiene estudiantes inscritos");
        return 0;
      }
    


      mostrarElementosInterazConsultarRepresentante();
      ocultarPantallaCarga();
    } 
    catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL BUSCAR ESTUDIANTES", error);
      mostrarPantallaError(error);
    }
  }

  async function consultarEstudiantes(){
    try {
      mostrarPantallaCarga();
      let tablaConsultar = document.getElementById("tabla-consultar-estudiante-encabezado");
      let tablaConsultados = document.getElementById("tabla-estudiante-consultado-encabezado");
      let cedulaRepresentante = document.getElementById("cedula-representante-consultar").value;
      let cedula;
      let datosEstudiante;
      let tablaMostrar = document.getElementById("tablaMostrar");
      let nombre, apellidos, grado, curso, nombreCompleto;
      let objeto;
      
      let directorioConsulta;

      //VALIDACION
      
      let formularioInvalido = validarCheckboxesConsultarEstudiantes();

      if(formularioInvalido){

        ocultarPantallaCarga();
        return 0;

      }

      //LIMPIAR


      limpiarFilasTabla("tabla-estudiante-consultado-encabezado", 1);

      for(let i = 1; i <= tablaConsultar.rows.length - 1; i++){

        //OBTENER DATOS PARA LA CONSULTA

        if(tablaConsultar.rows[i].cells[6].children[0].checked == true){
          nombre = tablaConsultar.rows[i].cells[0].textContent;
          apellidos = tablaConsultar.rows[i].cells[1].textContent;
          nombreCompleto = nombre + " " + apellidos;
          cedula = tablaConsultar.rows[i].cells[2].textContent;
          grado = tablaConsultar.rows[i].cells[3].textContent;
          curso = tablaConsultar.rows[i].cells[4].textContent;

          if(annoEscolarConsultado == "2024-2025"){

            directorioConsulta = "representantes/" + cedulaRepresentante +"/estudiantes/";

          }

          else{

            directorioConsulta = "representantes/" + cedulaRepresentante +"/estudiantes" + annoEscolarConsultado + "/";

          }

          datosEstudiante = await getDoc(doc(Base, directorioConsulta, cedula));
          datosEstudiante = datosEstudiante.data();
          objeto = eliminadorDeMetodos(datosEstudiante);
          //SE DIBUJA LA TABLA

          dibujarTablaConsultar(objeto, nombreCompleto, grado, curso, cedula);
          }
        }
      if(tablaConsultados.rows.length == 1){
        ocultarPantallaCarga();
        mostrarPantallaExito("Representante Solvente");
        return 0;
      }
      ocultarPantallaCarga();
      consultarEstudianteParticular();
      tablaMostrar.style.display = "block";
    } 
    catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL CONSULTAR ESTUDIANTE: ", error);
      mostrarPantallaError("Error Inesperado");
    }
  }


  async function efectuarPagoIndividual(total, arrayTabla){
    try {
      mostrarPantallaCarga();
      let cedulaRepresentante = cedulaRepre;
      let cedulaEstudiante;
      let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");
      let nombreEstudiante = "";
      let flagConvenio = false;
      let estudiante;
      let estudianteObtenido;
      let directorioEstudiante;
      let directorioRepresentante;
      let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
      let numeroDePago = await getDoc(obtenerNumeroDePago);
      let IdPagoObtener = numeroDePago.data();
      let IdPago = IdPagoObtener.numero + 1;
      let documentoDePago;
      let arrayEstudiantesConvenio = [];
      let nombresMeses = [
        "pagoInscripcion",
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

      let meses = ["Inscripción",
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


      let fechaProcesada = fechaDeHoy();
      let recibo = new reciboMensualidad(IdPago,
                                         nombreRepre, 
                                         cedulaRepresentante, 
                                         fechaProcesada, 
                                         precioDolar, 
                                         total, 
                                         "Mensualidad", 
                                         false);
      
      recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);
      recibo.rellenarReciboVer5();

      for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(cedulaEstudiante != tabla.rows[i].cells[1].textContent){
          cedulaEstudiante = tabla.rows[i].cells[1].textContent;
          nombreEstudiante = tabla.rows[i].cells[0].textContent;


          if(annoEscolarConsultado == "2024-2025"){

            directorioRepresentante = "representantes/" + cedulaRepresentante + "/estudiantes/";

          }
          else{

            directorioRepresentante = "representantes/" + cedulaRepresentante + "/estudiantes" + annoEscolarConsultado + "/";

          }

          estudiante = await doc(Base, directorioRepresentante, cedulaEstudiante);
          estudianteObtenido = await getDoc(estudiante);
          estudianteObtenido = estudianteObtenido.data();

          arrayEstudiantesConvenio.push(estudianteObtenido); //ESTO ES SOLO PARA PASARLO Y VERIFICAR SI PAGO EL CONVENIO
        }
        

        for(let j = 0; j <= meses.length - 1; j++){

          if(tabla.rows[i].cells[3].textContent.includes(meses[j])){

            if(annoEscolarConsultado == "2024-2025"){

              directorioEstudiante = "estudiantes/" + estudianteObtenido.grado + "/" + estudianteObtenido.curso + " " + estudianteObtenido.seccion + "/" + cedulaEstudiante;

            }
            else{

              directorioEstudiante = "estudiantes/" + annoEscolarConsultado + "/" + estudianteObtenido.grado + "/" + estudianteObtenido.curso + " " + estudianteObtenido.seccion + "/" + "Estudiantes/" + cedulaEstudiante;

            }

            await updateDoc(doc(Base, directorioRepresentante + cedulaEstudiante), {[nombresMeses[j]]: true});
            await updateDoc(doc(Base, directorioEstudiante), {[nombresMeses[j]]:true});
            
            debugger;

            if(estudianteTieneConvenioPorMes(estudianteObtenido, j)){

              flagConvenio = true;
              await procesarPagoConvenio(estudianteObtenido, j, directorioEstudiante, directorioRepresentante);

            }
            
          }
        }
      }

      if(flagConvenio){

        let resultadoReporte = await crearReporteConvenio(arrayEstudiantesConvenio, cedulaRepresentante, nombreRepre, fechaProcesada);

      }


      documentoDePago = eliminadorDeMetodos(recibo);
      console.log(documentoDePago);      
      await setDoc(doc(Base, "pagos/" + IdPago), documentoDePago);
      await updateDoc(obtenerNumeroDePago, {numero: IdPago});
      document.getElementById("pagar-todos-los-meses-estudiante-input").checked = false;
      document.getElementById("tablaConsultar").style.display = "none";
      recibo.escribirReciboVer5(document.getElementById("tablaTicketMensualidad"));
      ocultarPantallaCarga();
      mostrarDocumentodePagoMensualidad();
    } catch (error) {
      ocultarPantallaCarga();
      console.log("ERROR AL PAGAR: ", error);
      mostrarPantallaError(error);
    }
  }

async function crearReporteConvenio(arrayEstudiantes, cedulaRepre, nombreRepre, fechaHoyVzla){

    let obtenerNumeroDeReporte;
    let IdReporte;    
    
    try { //SE OBTIENE EL NUMERO DE REPORTE
        
        obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportes");
        let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
        let IdReporteObtener = numeroDeReporte.data();

        IdReporte = IdReporteObtener.numero + 1;

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

  let fechaHoyJS = fechaDeHoyFormatoJS();

  let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");

  let cedulaTabla;

  let reporte = {

    cedulaRepresentante: cedulaRepre,
    fecha: fechaHoyVzla,
    nombreRepresentante: nombreRepre,
    numeroReporte: IdReporte,
    tipoEdicion: "Convenio"

  };

  let contadorCambios = 1;

  for(let i = 0; i <= arrayEstudiantes.length - 1; i++){

    for(let j = 1; j <= tabla.rows.length - 1; j++){

      cedulaTabla = tabla.rows[j].cells[1].textContent;

      if(cedulaTabla != arrayEstudiantes[i].cedula) continue;

      if(!conceptoElegibleParaReporteConvenio(arrayEstudiantes, i, j)) continue;

      reporte = agregarCambioReporteConvenio(arrayEstudiantes, i, j, fechaHoyJS, contadorCambios, reporte);

      contadorCambios++;

    }

  }

    try { //SE SUBE A LA BASE DE DATOS EL RECIBO
        await setDoc(doc(Base, "reportesEdicion/" + IdReporte), reporte);
        await updateDoc(obtenerNumeroDeReporte, {numero: IdReporte});
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
        return "ERROR";
    }

    return 0;


}

function conceptoElegibleParaReporteConvenio(arrayEstudiantes, indiceEstudiante, indiceTabla){

  let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");

  let mesIndice = tabla.rows[indiceTabla].cells[3].textContent;

  if(mesIndice == "Inscripción") mesIndice = "Inscripcion"; 

  let estudiante = arrayEstudiantes[indiceEstudiante];

  if(estudiante.hasOwnProperty("convenioCumplido" + mesIndice)) return false;

  if(estudiante.hasOwnProperty("convenioFallido" + mesIndice)) return false;

  if(estudiante.hasOwnProperty("convenio" + mesIndice)) return true;

  else return false; //YA ESTO ES SI NO TIENE NINGUNA PROPIEDAD DE CONVENIO

}


function agregarCambioReporteConvenio(arrayEstudiantes, indiceEstudiante, indiceTabla, fechaHoy, contadorCambios, reporte){

  let tabla = document.getElementById("tabla-estudiante-pagado-encabezado");

  let mesIndice = tabla.rows[indiceTabla].cells[3].textContent;

  let mesReporte = mesIndice;

  if(mesIndice == "Inscripción"){

    mesIndice = "Inscripcion";

  }  

  let estudiante = arrayEstudiantes[indiceEstudiante];

  let fechaConvenio = estudiante["convenio" + mesIndice];

  let fechaReporte = fechaConvenio;

  fechaConvenio = convertirAfechaHTML(fechaConvenio);

  if(fechaConvenioVencida(fechaConvenio, fechaHoy)){

    reporte["cambio" + contadorCambios] = [];
    reporte["cambio" + contadorCambios].push(estudiante.nombres + " " + estudiante.apellidos);
    reporte["cambio" + contadorCambios].push("Convenio " + mesReporte + " (" + fechaReporte + ")");
    reporte["cambio" + contadorCambios].push("Convenio Incumplido");

  }

  else{ //NO ESTA VENCIDO

    reporte["cambio" + contadorCambios] = [];
    reporte["cambio" + contadorCambios].push(estudiante.nombres + " " + estudiante.apellidos);
    reporte["cambio" + contadorCambios].push("Convenio " + mesReporte + " (" + fechaReporte + ")");
    reporte["cambio" + contadorCambios].push("Convenio Cumplido");

  }

  return reporte;

}