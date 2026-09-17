/*global document, console */

import { obtenerSHA512 } from "./controlesEfectuarPago.js";
import { inputInvalidoReciboEliminar, mostrarBotonTablaReciboEliminar, ocultarBotonTablaReciboEliminar, ocultarPantallaConfirmarBorrarRecibo } from "./controlesEliminarRecibos.js";
import { Base, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "./firebase.js";
import { consultarInputText, limpiarInputText } from "./funcionesHTML.js";
import { mostrarPantallaCarga, mostrarPantallaError, mostrarPantallaExito, ocultarPantallaCarga } from "./modal.js";
import { documentoDePago, documentoDePagoExonerado } from "./objetos.js";
import { copiadorDePropiedades, fechaDeHoy } from "./utilidades.js";

let numeroRecibo;
let reciboAborrar;

export async function verTicketEliminar(){
    try {

      mostrarPantallaCarga();
      ocultarBotonTablaReciboEliminar();

      let numeroTicket = consultarInputText("consultarReciboEliminarInput");

      if(inputInvalidoReciboEliminar()) return;

      numeroRecibo = numeroTicket;

      let datosTicket = await getDoc(doc(Base, "pagos", numeroTicket));


      if(!datosTicket.exists()){ //SI NO EXISTE, TERMINA LA FUNCION
        ocultarPantallaCarga();
        mostrarPantallaError("Número de Ticket Inexistente");
        return 0;
      }

      let tablaTicket = document.getElementById("tablaTicketEliminar");

      tablaTicket.removeChild(tablaTicket.children[0]); //REMUEVE LA TABLA SI EL DOCUMENTO EXISTE, DE LO CONTRARIO NO LLEGA AQUI

      let objetoDatosTicket = datosTicket.data();

      reciboAborrar = objetoDatosTicket;

      let recibo = new documentoDePago();

      recibo = copiadorDePropiedades(objetoDatosTicket, recibo);
  
    if(recibo.tipoDePago == "Edición de Mensualidad"){

      recibo = new documentoDePagoExonerado();
      recibo = copiadorDePropiedades(objetoDatosTicket, recibo);
      recibo.dibujarRecibo(tablaTicket);
      mostrarBotonTablaReciboEliminar();
      ocultarPantallaCarga();
      return;

    }

    if(objetoDatosTicket.hasOwnProperty("version")){
      if(objetoDatosTicket.version == 2 || objetoDatosTicket.version == 3 || objetoDatosTicket.version == 4) recibo.escribirReciboVer2(tablaTicket);
      if(objetoDatosTicket.version == 5) recibo.escribirReciboVer5(tablaTicket);
    }
    else recibo.escribirReciboVer1(tablaTicket);

    mostrarBotonTablaReciboEliminar();

    ocultarPantallaCarga();
    } catch (error) {
      console.log("ERROR AL VERIFICAR TICKET: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }  
  }

async function subirReporteEdicionEliminarRecibo(){

  let obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportes");
  let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
  let IdReporteObtener = numeroDeReporte.data();
  let IdReporte = IdReporteObtener.numero + 1;

  let fechaHoy = fechaDeHoy();

  let objetoReporte = {

    fecha: fechaHoy,
    nombreRepresentante: reciboAborrar.nombreRepresentante,
    cedulaRepresentante: reciboAborrar.cedulaRepresentante,
    tipoEdicion: "Recibo Eliminado",
    cambio1: ["Datos sin respaldar", "Datos respaldados"],
    cambio2: ["Recibo " + numeroRecibo + " existente", "Recibo " + numeroRecibo + " eliminado"],
    cambio3: ["Datos adicionales de pago sin eliminar", "Datos adicionales de pago eliminados"],
    cambio4: ["Referencias bloqueada para reuso", "Referencias disponibles para un reuso"],
    numeroReporte: IdReporte

  };

  await setDoc(doc(Base, "reportesEdicion/" + IdReporte), objetoReporte);
  await updateDoc(obtenerNumeroDeReporte, {numero: IdReporte});

}

export async function eliminarDatosPago(){

  //VAMOS A PROCEDER PRIMERO OBTENIENDO LOS DATOS
  //LUEGOS PROCEDEREMOS A HACER UN RESPALDO
  //Y FINALMENTE ELIMINAMOS LOS DATOS, TOME
  //LA DECISION DE HACER UN RESPALDO COMO UNA
  //MEDIDA PREVENTIVA EN CASO DE QUE SE REQUIERA
  //EN ALGUNA OCASION VERIFICAR ESOS DATOS

  ocultarPantallaConfirmarBorrarRecibo();

  mostrarPantallaCarga();

  try {

    let arrayPagosMetodos = await obtenerArrayPagosMetodos(numeroRecibo);

    let arrayHashes = await obtenerArrayHashes(arrayPagosMetodos);

    let identificador;

    for(let i = 0; i <= arrayPagosMetodos.length - 1; i++){

      //PROCEDEMOS AQUI A RESPALDAR LOS METODOS PAGOS

      await setDoc(doc(Base, "respaldosPagosEliminados/metodosPagos/metodosPagos/" + arrayPagosMetodos[i].id), arrayPagosMetodos[i]);

    }

    //PROCEDO AQUI A RESPALDAR EL RECIBO EN SI

    await setDoc(doc(Base, "respaldosPagosEliminados/recibos/recibos/" + reciboAborrar.IdPago), reciboAborrar);    

    //AHORA SI PODEMOS BORRAR EL RECIBO, LOS HASHES Y LOS METODOS PAGO

    await deleteDoc(doc(Base, "pagos/", numeroRecibo)); //EL RECIBO EN SI

    for(let i = 0; i <= arrayHashes.length - 1; i++){ //LOS HASHES DE LOS METODOS DE PAGO

        await deleteDoc(doc(Base, "hashesPagos/", arrayHashes[i]));

    }

    for(let i = 0; i <= arrayPagosMetodos.length - 1; i++){ //LOS METODOS PAGOS QUE MUESTRAN LA FECHA REAL DEL PAGO

        identificador = arrayPagosMetodos[i].id;

        identificador = identificador.toString();

        await deleteDoc(doc(Base, "pagosMetodos/", identificador));        

    }    

    await subirReporteEdicionEliminarRecibo();

    limpiarInputText("consultarReciboEliminarInput");

    ocultarBotonTablaReciboEliminar();

    ocultarPantallaCarga();

    mostrarPantallaExito("Recibo eliminado");

    
  } catch (error) {
    mostrarPantallaError(error);
    ocultarPantallaCarga();
    return;
  }

}


  async function obtenerArrayPagosMetodos(nRecibo){

    let numeroRecibo = parseInt(nRecibo);

    let coleccion = await collection(Base, "pagosMetodos/");

    let obtenerPagosMetodos = await query(coleccion, where("nRecibo", "==", numeroRecibo));

    let documentos = await getDocs(obtenerPagosMetodos);
    
    let pagos = [];

    let datosPago;

    documentos.forEach(pago => {

        datosPago = pago.data();

        pagos.push(datosPago);

    });

    return pagos;

  }

  async function obtenerArrayHashes(arrayPagos){ //RECIBE PAGOS METODOS

    let hashes = [];

    let codigoIdentificacion;

    let referencia;

    for(let i = 0; i <= arrayPagos.length - 1; i++){

        referencia = arrayPagos[i].codigo;

        codigoIdentificacion = await obtenerSHA512(referencia);

        hashes.push(codigoIdentificacion);

    }

    return hashes;

  }