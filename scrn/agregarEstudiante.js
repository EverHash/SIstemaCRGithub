/*global document, console */

import {ocultarPantallaCarga, mostrarPantallaCarga, mostrarPantallaError} from "./modal.js";
import { getDoc, doc, Base, setDoc, updateDoc } from "./firebase.js";
import { calcularCostosAgregar, escribirFormularioDigitalRepresentanteAgregar, tipoDescuentoDeterminado } from "./controlesAgregarEstudiante.js";
import { fechaDeHoy, eliminadorDeMetodos, subcadenaDesdeIndice, productoPrecision2, numberAformatoMontos, divisionPrecision2, formatoMontosAnumber, restaDecimal, sumaDecimal, agregarPagoAlRegistroDeRepresentante } from "./utilidades.js";
import { mostrarDocumentodePagoAgregar } from "./recibos.js";
import { estudiante, estudianteRepresentante, representante, reciboInscripcion } from "./objetos.js";

import {precioDolar as precioDolarInscripcion, 
        verificarDolares, 
        verificarTransferencia, 
        verificarZelle, 
        precioInscripcionBachillerato, 
        precioInscripcionPreescolar, 
        precioInscripcionPrimaria} from "./obtenerPrecios.js";

export {buscarRepresentanteAgregar, 
        agregarEstudiante};

let cedulaRepresentanteAgregar;

async function buscarRepresentanteAgregar(){
try {
  mostrarPantallaCarga();
  let cedulaRepresentante = document.getElementById("cedulaRepresentanteAgregar").value;
  let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));
  if(!datosRepresentante.exists()){
    ocultarPantallaCarga();
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
  cedulaRepresentanteAgregar = cedulaRepresentante;
  escribirFormularioDigitalRepresentanteAgregar(objetoRepresentante);
  ocultarPantallaCarga();
  calcularCostosAgregar();
} 
catch(error) {
  ocultarPantallaCarga();
  console.log("ERROR AL BUSCAR: ", error);
  mostrarPantallaError("Error Inesperado");
}
}

async function agregarEstudiante(total){
  try {
    let formularios = document.getElementsByClassName("subcajaFormularioAgregarDerecha");
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
    let estudianteSubir, estudianteRepreSubir;
    let reciboSubir;
    let curso;
    let mesdeInscrip;
    let propiedadInscripcion;
    let mesEnCuestion;
    let verificador;

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
        mesdeInscrip = formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent;
        estudia.obtenerDatosRepresentante(formularios[0]);
        estudia.obtenerDatos(formularios[i], i);
        estudianteRepre.obtenerDatos(formularios[i], i);
        propiedadInscripcion = estudianteRepre.mesDeInscripcion(mesdeInscrip);
        estudia.solvenciaDeInscripcion(formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent);
        estudianteRepre.solvenciaDeInscripcion(formularios[i].children[11].options[formularios[i].children[11].selectedIndex].textContent);
        precioInscripcion = estudianteRepre.obtenerPrecioInscripcion(precioInscripcionPreescolar, 
                                                                     precioInscripcionPrimaria, 
                                                                     precioInscripcionBachillerato, 
                                                                     tipoDescuentoDeterminado);   
        
        //INSCRIPCION EN CASO DE QUE HAYA QUE HACER VERIFICACION DE PAGO

        montoPago = productoPrecision2(precioInscripcion, precioDolarInscripcion);
        montoPago = numberAformatoMontos(montoPago);
        totalPago = restaDecimal(numberAformatoMontos(totalPago), montoPago);

        curso = formularios[i].children[5].options[formularios[i].children[5].selectedIndex].textContent;

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
      reciboSubir = eliminadorDeMetodos(recibo); 
      await updateDoc(obtenerNumeroDePago, {numero: IdPago});
      await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);
      console.log(recibo);
      recibo.escribirRecibo(document.getElementById("tablaAgregarImprimir"));
      ocultarPantallaCarga();
      mostrarDocumentodePagoAgregar(); 
  } 
  catch (error) {
    console.log("Error al inscribir", error);
    ocultarPantallaCarga();
    mostrarPantallaError("Error Inesperado");
  }
}