/*global document, console */

import { mostrarPantallaCarga, ocultarPantallaCarga, mostrarPantallaError } from "./modal.js";
import { getDoc, setDoc, doc, updateDoc, Base } from "./firebase.js";
import { fechaDeHoy, eliminadorDeMetodos, determinarSiTieneAbonos, verSiEsNumeroEntero } from "./utilidades.js";
import { reciboAdministrativo } from "./objetos.js";
import { mostrarDocumentodePagoAdministrativo } from "./recibos.js";

import { precioDolar, verificarDolares, verificarTransferencia, verificarZelle } from "./obtenerPrecios.js";
import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";
import { asignarValueInput, consultarInputText } from "./funcionesHTML.js";
import { obtenerContenedoresAbono } from "./mensualidad.js";
import { determinarMontoTotalAbonadoAdministrativo } from "./controlesAdministrativo.js";
import { setCedulaRepresentante } from "./controlesEfectuarPago.js";

export { realizarPagoAdministrativo };

export class gestorBDadministrativo{

  async consultarRepresentante(){

    mostrarPantallaCarga();

    let cedula = consultarInputText("cedulaRepresentanteAdministrativo");

    if(verSiEsNumeroEntero(cedula)){

      ocultarPantallaCarga();
      mostrarPantallaError("Introduzca solo numeros en el campo de cédula");
      return;

    }

    let representante = await getDoc(doc(Base, "representantes", cedula));

    if(!representante.exists()){

      ocultarPantallaCarga();
      mostrarPantallaError("El representante no está registrado en la base de datos");
      return;

    }

    setCedulaRepresentante(cedula);

    let datos = representante.data();

    asignarValueInput("nombresRepresentanteAdministrativo", datos.nombres);
    asignarValueInput("apellidosRepresentanteAdministrativo", datos.apellidos);

    let determinarMontoAbonado = determinarMontoTotalAbonadoAdministrativo(datos);

    obtenerContenedoresAbono(datos);

    asignarValueInput("totalAbonadoRepresentanteAdministrativo", determinarMontoAbonado);

    ocultarPantallaCarga();

  }

}

export async function consultarRepresentanteAdministrativo(){

  let gestor = new gestorBDadministrativo();

  await gestor.consultarRepresentante();
  
}


async function subirReciboYdibujar(total, arrayTabla){
  
    let fechaProcesada = fechaDeHoy();
    let documentoDePago;

    let nombreRepresentante = document.getElementById("nombresRepresentanteAdministrativo").value + " " + document.getElementById("apellidosRepresentanteAdministrativo").value;
    let cedulaRepresentante = document.getElementById("cedulaRepresentanteAdministrativo").value;

    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let IdPago = IdPagoObtener.numero + 1;

    const recibo = new reciboAdministrativo(IdPago,
                                        nombreRepresentante,
                                        cedulaRepresentante,
                                        fechaProcesada,
                                        precioDolar,
                                        total, 
                                        "Administrativo",
                                        false);

    recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);

    recibo.rellenarReciboVer5();

    documentoDePago = eliminadorDeMetodos(recibo);
    await setDoc(doc(Base, "pagos/" + IdPago), documentoDePago);
    await updateDoc(obtenerNumeroDePago, {numero: IdPago});
    recibo.escribirReciboVer5(document.getElementById("tablaAdministrativoImprimir"));

}

async function realizarPagoAdministrativo(total, arrayTabla){
    try {
      mostrarPantallaCarga();

      let cedulaRepresentante = document.getElementById("cedulaRepresentanteAdministrativo").value;
      asignarCedulaRepresentanteMetodosPagos(cedulaRepresentante);

      await subirReciboYdibujar(total, arrayTabla);

      ocultarPantallaCarga();
      mostrarDocumentodePagoAdministrativo();
    } catch (error) {
      console.log("ERROR AL REALIZAR PAGO: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }         
  }