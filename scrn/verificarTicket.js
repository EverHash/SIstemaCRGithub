/*global document, console*/

import { ocultarPantallaCarga, mostrarPantallaCarga, mostrarPantallaError } from "./modal.js";
import { copiadorDePropiedades, verSiEsNumeroEntero } from "./utilidades.js";
import { getDoc, doc, Base } from "./firebase.js";
import { documentoDePago, documentoDePagoExonerado } from "./objetos.js";
import { mostrarTablaTicket, numeroTicketInvalido, ocultarPantallaTicket } from "./controlesVerificarTicket.js";

export {verificacionTicket};

async function verificacionTicket(){
    try {

      mostrarPantallaCarga();
      ocultarPantallaTicket();

      let numeroTicket = document.getElementById("numeroTicket").value;

      if(numeroTicketInvalido(numeroTicket)) return;

      let datosTicket = await getDoc(doc(Base, "pagos", numeroTicket));


      if(!datosTicket.exists()){ //SI NO EXISTE, TERMINA LA FUNCION
        ocultarPantallaCarga();
        mostrarPantallaError("Número de Ticket Inexistente");
        return 0;
      }

      let tablaTicket = document.getElementById("tablaticketVerificar");

      tablaTicket.removeChild(tablaTicket.children[0]); //REMUEVE LA TABLA SI EL DOCUMENTO EXISTE, DE LO CONTRARIO NO LLEGA AQUI

      let objetoDatosTicket = datosTicket.data();

      let recibo = new documentoDePago();

      recibo = copiadorDePropiedades(objetoDatosTicket, recibo);
  
    if(recibo.tipoDePago == "Edición de Mensualidad"){

      recibo = new documentoDePagoExonerado();
      recibo = copiadorDePropiedades(objetoDatosTicket, recibo);
      recibo.dibujarRecibo(tablaTicket);
      mostrarTablaTicket();
      ocultarPantallaCarga();
      return;

    }

    if(objetoDatosTicket.hasOwnProperty("version")){
      if(objetoDatosTicket.version == 2 || objetoDatosTicket.version == 3 || objetoDatosTicket.version == 4) recibo.escribirReciboVer2(tablaTicket);
      if(objetoDatosTicket.version == 5) recibo.escribirReciboVer5(tablaTicket);
    }
    else recibo.escribirReciboVer1(tablaTicket);

    mostrarTablaTicket();

    ocultarPantallaCarga();
    } catch (error) {
      console.log("ERROR AL VERIFICAR TICKET: ", error);
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
    }  
  }