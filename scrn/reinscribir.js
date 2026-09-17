/*global document, console */

import { getDoc, doc, Base, getDocs, collection, deleteDoc } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import {acomodarArrayListaEstudiantes, 
        escribirFormularioDigitalEstudiante, 
        escribirFormularioDigitalRepresentante, 
        limpiarFormulariosReinscripcionBuscar, 
        tipoDescuentoDeterminado} from "./controlesReinscripcion.js";
import { mostrarDocumentodePagoReinscripcion } from "./recibos.js";
import { truncarDecimales, eliminadorDeMetodos, fechaDeHoy, productoPrecision2, divisionPrecision2, numberAformatoMontos, formatoMontosAnumber, sumaDecimal, restaDecimal, subcadenaDesdeIndice, agregarPagoAlRegistroDeRepresentante } from "./utilidades.js";
import { setDoc, updateDoc } from "./firebase.js";
import {representante, 
        estudiante, 
        estudianteRepresentante, 
        reciboInscripcion} from "./objetos.js";

import {precioInscripcionBachillerato, 
        precioInscripcionPrimaria, 
        precioInscripcionPreescolar, 
        precioDolar as precioDolarInscripcion, 
        verificarDolares, 
        verificarTransferencia, 
        verificarZelle} from "./obtenerPrecios.js";

export {buscarRepresentanteReinscribir, 
        verificarSolvenciaReinscripcion, 
        reinscribir};

let arrayEstudiantesReinscribir = [];
let cedulaRepresentanteReinscribir;

async function buscarRepresentanteReinscribir(){
  limpiarFormulariosReinscripcionBuscar();
try {
  mostrarPantallaCarga();
  let cedulaRepresentante = document.getElementById("cedulaRepresentanteReinscribir").value;
  let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
  cedulaRepresentanteReinscribir = cedulaRepresentante;
  if(!datosRepresentante.exists()){
    ocultarPantallaCarga();
    mostrarPantallaError("El representante no está registrado en la base de datos");
    return 0;
  }
  let estudiantesRepresentados = await getDocs(collection(Base, "representantes/"+ cedulaRepresentante +"/estudiantes"));
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
  cedulaRepresentanteReinscribir = cedulaRepresentante;
  let objetoEstudiante = {
    nombres: "",
    apellidos: "",
    sexo: "",
    cedula: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estado: "",
    direccion: ""
  };
  let arrayDatosEstudiante = [];
  let datosEstudiante;
  let i = 1;
  let flag = true;
  escribirFormularioDigitalRepresentante(objetoRepresentante);
  estudiantesRepresentados.forEach(estudiante =>{
    i++;
  });
  if(i == 1){
    ocultarPantallaCarga();
    mostrarPantallaError("El representante no tiene estudiantes inscritos...");
    return 0;
  }
  i = 1;
  document.getElementById("contenedorReinscripcion").removeChild(document.getElementById("contenedorReinscripcion").children[1]);
  estudiantesRepresentados.forEach(estudiante =>{
    datosEstudiante = estudiante.data();
    arrayDatosEstudiante.push(datosEstudiante.nombres + " " + datosEstudiante.apellidos);
    arrayDatosEstudiante.push(datosEstudiante.grado);
    arrayDatosEstudiante.push(datosEstudiante.curso + " " + datosEstudiante.seccion);
    arrayEstudiantesReinscribir.push(arrayDatosEstudiante);
    objetoEstudiante.nombres = datosEstudiante.nombres;
    objetoEstudiante.apellidos = datosEstudiante.apellidos;
    objetoEstudiante.cedula = datosEstudiante.cedula;
    objetoEstudiante.sexo = datosEstudiante.sexo;
    objetoEstudiante.fechaNacimiento = datosEstudiante.fechaNacimiento;
    objetoEstudiante.lugarNacimiento = datosEstudiante.lugarNacimiento;
    objetoEstudiante.estado = datosEstudiante.estado;
    objetoEstudiante.direccion = datosEstudiante.direccion;
    escribirFormularioDigitalEstudiante(objetoEstudiante, i, flag);
    flag = false;
    i++;
  });
  acomodarArrayListaEstudiantes();
  ocultarPantallaCarga();
} 
catch(error) {
  ocultarPantallaCarga();
  console.log("ERROR AL BUSCAR: ", error);
  mostrarPantallaError("Error Inesperado");
}
}

async function eliminarEstudiantesReinscripcion(){
  try {
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    const estudi = new estudiante();
    const repre = new representante();
    repre.obtenerDatosRepresentante(formularios);
    let estudianteBorrar;

    //BUCLE DE ELIMINACION

    for(let i = 1; i <= formularios.length - 1; i++){
      estudi.obtenerDatos(formularios[i], i);
      estudianteBorrar = await getDoc(doc(Base, "representantes/" + repre.cedula + "/estudiantes/" + estudi.cedula));
      estudianteBorrar = estudianteBorrar.data();
      await deleteDoc(doc(Base, "estudiantes/" + estudianteBorrar.grado + "/" + estudianteBorrar.curso + " " + estudianteBorrar.seccion, estudianteBorrar.cedula));
      await deleteDoc(doc(Base, "representantes/" + repre.cedula + "/estudiantes/", estudi.cedula));
    } 


  } catch (error) {
    console.log("Error al inscribir", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error Inesperado...");
  }
}

async function verificarSolvenciaReinscripcion(){
  try {
    let meses = ["pago09Septiembre", "pago10Octubre", "pago11Noviembre", "pago12Diciembre",
      "pago13Enero", "pago14Febrero", "pago15Marzo", "pago16Abril", "pago17Mayo", "pago18Junio", 
      "pago19Julio", "pago20Agosto"];
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    let estudianteVerificacion;
    const estudi = new estudiante();
    const repre = new representante();
    repre.obtenerDatosRepresentante(formularios);

    //BUCLE DE VERIFICACION

    for(let i = 1; i <= formularios.length - 1; i++){
      estudi.obtenerDatos(formularios[i], i);
      estudianteVerificacion = await getDoc(doc(Base, "representantes/" + repre.cedula + "/estudiantes/" + estudi.nombres + " " + estudi.apellidos));
      estudianteVerificacion = estudianteVerificacion.data();
      for(let j = 0; j <= meses.length - 1; j++){
        if(!estudianteVerificacion[meses[j]]){
          return 1;
        }
      }
    }
    return 0;
  } catch (error) {
    ocultarPantallaCarga();
    console.log("ERROR AL BUSCAR: ", error);
    mostrarPantallaError("Error Inesperado");
    return 2;
  }
}

async function reinscribir(total){
  try {
    let formularios = document.getElementsByClassName("subcajaFormularioReinscripcionDerecha");
    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let IdPago = IdPagoObtener.numero + 1;
    let precioInscripcion = 0;
    let montoPago;
    let montoAbono;
    let montoPoner;
    let totalPago = total;
    let fechaProcesada = fechaDeHoy();
    let estudianteSubir, estudianteRepreSubir, repreSubir;
    let reciboSubir;
    let curso;
    let mesDeInscripcion;
    let propiedadInscripcion;
    let mesEnCuestion;
    let verificador;

    await eliminarEstudiantesReinscripcion();

    //CREACIÓN DE OBJETOS

    const estudia = new estudiante();
    const estudianteRepre = new estudianteRepresentante();
    const repre = new representante();
    repre.obtenerDatosRepresentante(formularios);
    const recibo = new reciboInscripcion(IdPago, repre.nombres + " " + repre.apellidos, repre.cedula,
                                         fechaProcesada, precioDolarInscripcion, total, "Inscripción", false);

    recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle);

    if(tipoDescuentoDeterminado == "Pronto Pago") verificador = "SI";
    else verificador = "NO";

    //BUCLE DE ASIGNACION Y SUBIDA DE DATOS

    
      for(let i = 1; i <= formularios.length - 1; i++){

        //ASIGNACION DE DATOS REQUERIDOS
        mesDeInscripcion = formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent;
        estudia.obtenerDatosRepresentante(formularios[0]);
        estudia.obtenerDatos(formularios[i], i);
        estudianteRepre.obtenerDatos(formularios[i], i);
        propiedadInscripcion = estudianteRepre.mesDeInscripcion(mesDeInscripcion);
        estudia.solvenciaDeInscripcion(formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent);
        estudianteRepre.solvenciaDeInscripcion(formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent);
        precioInscripcion = estudianteRepre.obtenerPrecioInscripcion(precioInscripcionPreescolar, 
                                                                     precioInscripcionPrimaria, 
                                                                     precioInscripcionBachillerato, 
                                                                     tipoDescuentoDeterminado);   
        
        //INSCRIPCION EN CASO DE QUE HAYA QUE HACER VERIFICACION DE PAGO

        curso = formularios[i].children[5].options[formularios[i].children[5].selectedIndex].textContent;

        montoPago = productoPrecision2(precioInscripcion, precioDolarInscripcion);
        montoPago = numberAformatoMontos(montoPago);
        totalPago = restaDecimal(numberAformatoMontos(totalPago), montoPago);

        if(recibo.flagVerificar == true){
          mesEnCuestion = subcadenaDesdeIndice(propiedadInscripcion, 6);
          recibo.rellenarParaVerificar(i, ["representantes/" + repre.cedula + "/estudiantes/" + estudia.cedula,
                                          "estudiantes/" + estudianteRepre.grado + "/" + estudianteRepre.curso + " " + estudianteRepre.seccion + "/" + estudia.cedula,
                                          mesEnCuestion + "-" + numberAformatoMontos(productoPrecision2(precioInscripcion, precioDolarInscripcion)) + "-" + verificador]);                    
          estudia.abonoInscripcion(propiedadInscripcion);
          estudianteRepre.abonoInscripcion(precioInscripcion, propiedadInscripcion, verificador);
          estudianteSubir = eliminadorDeMetodos(estudia);
          estudianteRepreSubir = eliminadorDeMetodos(estudianteRepre);
          if(totalPago < 0){
            recibo.indicarSiHuboAbono(true);
            montoPoner = sumaDecimal(numberAformatoMontos(totalPago), montoPago);
            recibo.rellenarRecibo(curso, estudianteRepre, i, montoPoner);
          }
          else{
            recibo.rellenarRecibo(curso, estudianteRepre, i, numberAformatoMontos(productoPrecision2(precioInscripcion, precioDolarInscripcion)));
          }
          await setDoc(doc(Base, "estudiantes/"+ estudianteRepre.grado +"/" + estudianteRepre.curso + " " + estudianteRepre.seccion, estudia.cedula), estudianteSubir);    
          await setDoc(doc(Base, "representantes/"+ repre.cedula +"/estudiantes/" + estudia.cedula), estudianteRepreSubir);    
          continue;
        }

        //RELLENAR EL RECIBO

        //curso = formularios[i].children[5].options[formularios[i].children[5].selectedIndex].textContent;

        //INSCRIPCION EN CASO CONTRARIO
        //INCLUYE ABONOS + PAGOS COMPLETOS

        if(totalPago < 0){
          recibo.indicarSiHuboAbono(true);
          montoAbono = totalPago * (-1);
          montoAbono = montoAbono / precioDolarInscripcion;
          montoPoner = sumaDecimal(numberAformatoMontos(totalPago), montoPago);
          estudianteRepre.abonoInscripcion(montoAbono, propiedadInscripcion, verificador);
          estudia.abonoInscripcion(propiedadInscripcion);
          totalPago = 0;
          recibo.rellenarRecibo(curso, estudianteRepre, i, montoPoner);
          estudianteSubir = eliminadorDeMetodos(estudia);
          estudianteRepreSubir = eliminadorDeMetodos(estudianteRepre);
          await setDoc(doc(Base, "estudiantes/"+ estudianteRepre.grado +"/" + estudianteRepre.curso + " " + estudianteRepre.seccion, estudia.cedula), estudianteSubir);    
          await setDoc(doc(Base, "representantes/"+ repre.cedula +"/estudiantes/" + estudia.cedula), estudianteRepreSubir);  
          continue; 
        }
        recibo.rellenarRecibo(curso, estudianteRepre, i, montoPago);
        estudianteSubir = eliminadorDeMetodos(estudia);
        estudianteRepreSubir = eliminadorDeMetodos(estudianteRepre);
        await setDoc(doc(Base, "estudiantes/"+ estudianteRepre.grado +"/" + estudianteRepre.curso + " " + estudianteRepre.seccion, estudia.cedula), estudianteSubir);    
        await setDoc(doc(Base, "representantes/"+ repre.cedula +"/estudiantes/" + estudia.cedula), estudianteRepreSubir);    
      }
      repreSubir = eliminadorDeMetodos(repre);
      reciboSubir = eliminadorDeMetodos(recibo);
      await setDoc(doc(Base, "representantes/"+ repre.cedula), repreSubir);  
      await updateDoc(obtenerNumeroDePago, {numero: IdPago});
      await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);
      console.log(recibo);
      recibo.escribirRecibo(document.getElementById("tablaReinscripcionImprimir"));
      
      //escribirDocumentodePagoInscripcion(recibo.fecha, IdPago, recibo.total, recibo, estudianteRepre);
      ocultarPantallaCarga();
      mostrarDocumentodePagoReinscripcion(); 
  } 
  catch (error) {
    console.log("Error al inscribir", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error Inesperado...");
  }
}