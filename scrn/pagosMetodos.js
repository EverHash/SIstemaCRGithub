/*global document, console */

import { getDoc, doc, setDoc, updateDoc, Base } from "./firebase.js";
import { mostrarPantallaError } from "./modal.js";
import { formatoMontosAnumber } from "./utilidades.js";

export {registrarMetodosPagos,
        asignarCedulaRepresentanteMetodosPagos};

let cedulaRepre;

function asignarCedulaRepresentanteMetodosPagos(cedula){
    cedulaRepre = cedula;
}

async function ObtenerNrecibo(){
    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let IdPago = IdPagoObtener.numero + 1;
    return IdPago;
  }

  async function registrarMetodosPagos(emisorPago, fechaPago, metodoDePago, codigoPago, bancoProcedencia, bancoDestino, montoPago, costoDolar){
    try {

      //INICIALIZACION
      let obtenerNumeroDePago = await doc(Base, "variables", "numerosPagosMetodos");
      let numeroDePago = await getDoc(obtenerNumeroDePago);
      let IdPagoObtener = numeroDePago.data();
      let IdPago = IdPagoObtener.numero + 1;

      let numeroRecibo = await ObtenerNrecibo();
      numeroRecibo--;

      costoDolar = formatoMontosAnumber(costoDolar);

      //OBJETO DEL PAGO

      let pago = {
        cedulaRepresentante: cedulaRepre,
        metodoPago: metodoDePago,
        bancoProcedencia: "",
        bancoDestino: "",
        codigo: "",
        monto: "",
        fecha: fechaPago,
        id: IdPago,
        precioDolar: costoDolar,
        nombreEmisorPago: emisorPago,
        nRecibo: numeroRecibo,
        version: 2
      };

      console.log(pago);

      //VARIABLES Y ASIGNACIONES REQUERIDAS

      if(metodoDePago == "Punto") metodoDePago = 1;
      if(metodoDePago == "Transferencia") metodoDePago = 2;
      if(metodoDePago == "Efectivo Bolívares") metodoDePago = 3;
      if(metodoDePago == "Efectivo Dólares") metodoDePago = 4;
      if(metodoDePago == "Zelle") metodoDePago = 5;
      if(metodoDePago == "Abono") metodoDePago = 6;

      if(metodoDePago == 1){ //PUNTO
        pago.metodoPago = 1;
        pago.bancoProcedencia = "N/A";
        pago.bancoDestino = "N/A";
        pago.codigo = codigoPago;
        pago.monto = montoPago;
      }

      if(metodoDePago == 2){ //TRANSFERENCIA
        pago.metodoPago = 2;
        pago.bancoProcedencia = bancoProcedencia;
        pago.bancoDestino = bancoDestino;
        pago.codigo = codigoPago;
        pago.monto = montoPago;
      }

      if(metodoDePago == 3){ //EFECTIVO BS
        pago.metodoPago = 3;
        pago.bancoProcedencia = "N/A";
        pago.bancoDestino = "N/A";
        pago.codigo = "N/A";
        pago.monto = montoPago;
      }

      if(metodoDePago == 4){ //DOLARES
        pago.metodoPago = 4;
        pago.bancoProcedencia = "N/A";
        pago.bancoDestino = "N/A";
        pago.codigo = codigoPago;
        pago.monto = montoPago;
          
          //ESTOS DE MONTO DE DEBAJO ES PARA LOS BILLETES, ES PARA CUANDO HAGA LA UPDATE
          //DE LOS VUELTOS DE LOS BILLETES DE DOLARES
          // pago.monto = tablaMetodosPago.rows[i].cells[1].children[2].options[tablaMetodosPago.rows[i].cells[1].children[2].selectedIndex].textContent;
          // pago.monto = eliminarTodasLasOcurrenciasDeUnCaracter(pago.monto, "$");
          //WARNING: FALTA PONER LOS VUELTOS
        }
        
      if(metodoDePago == 5){ //ZELLE
        pago.metodoPago = 5;
        pago.bancoProcedencia = "N/A";
        pago.bancoDestino = "N/A";
        pago.codigo = codigoPago;
        pago.monto = montoPago;
      }

      if(metodoDePago == 6){ //ABONO
        return;
      }

      await setDoc(doc(Base, "pagosMetodos/" + IdPago), pago);
      await updateDoc(obtenerNumeroDePago, {numero: IdPago});

    } catch (error) {
      mostrarPantallaError("Error al subir el metodo de pago: ", error);
      console.log("Error al subir el pago: ", error); 
    }
  }