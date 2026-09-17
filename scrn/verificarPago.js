/*global document, console */

//WARNING: AL VOLVER A ABRIR DESPUES DE HABER ACEPTADO EL PAGO, PERMITE MARCAR LAS CASILLAS DE LOS 
//         PAGOS QUE NO NECESITAN VERIFICACION 

import {divisionPrecision2, extraerNumerosPuntosComasDeUnaCadena, formatoMontosAnumber, numberAformatoMontos, restaDecimal, sumaDecimal} from "./utilidades.js";
import { doc, getDoc, Base, updateDoc } from "./firebase.js";
import {ocultarPantallaCarga, mostrarPantallaError, mostrarPantallaExito} from "./modal.js";
import { colocarIconoPalomitaCierre } from "./cierreCaja.js";
import { colocarIconoPalomitaLista } from "./listaPagos.js";
import { verificarGrises } from "./controlesVerificarPago.js";
import { colocarIconoPalomitaRepresentante } from "./controlesPagosRepresentante.js";
export {verificarPago, establecerModoVerificarPago, establecerNumeroDePago, numeroPago};


let modoVerificarPago;
let numeroPago;

function establecerModoVerificarPago(cadena){
  modoVerificarPago = cadena;
}

function establecerNumeroDePago(numero){
  numeroPago = numero;
}

function cambiarIconoVerificacion(){
  if(modoVerificarPago == "Cierre") colocarIconoPalomitaCierre();
  if(modoVerificarPago == "Lista") colocarIconoPalomitaLista();
  if(modoVerificarPago == "Representante") colocarIconoPalomitaRepresentante();
}

async function ponerPropiedadAfalseVerificarPago(tipoPago, referencia, recibo, estatus){
  let cadenaTransferencia = "pagoTransferencia";
  let cadenaDolares = "pagoDolares";
  let cadenaZelle = "pagoZelle";
  let array = [];
  let contador = 1;
  if(tipoPago == "Transferencia"){
    while(true){
      if(recibo.hasOwnProperty(cadenaTransferencia + contador)){
        if(recibo[cadenaTransferencia + contador][2] == referencia){
          array.push(recibo[cadenaTransferencia + contador][0]);
          array.push(recibo[cadenaTransferencia + contador][1]);
          array.push(recibo[cadenaTransferencia + contador][2]);
          array.push(recibo[cadenaTransferencia + contador][3]);
          array.push(estatus);
          array.push(false);
          await updateDoc(doc(Base, "pagos", (recibo.IdPago).toString()), {[cadenaTransferencia + contador]: array});
          return 0;
        }
        contador++;
      }
      else break;
    }
  }
  if(tipoPago == "Dolares"){
    while(true){
      if(recibo.hasOwnProperty(cadenaDolares + contador)){
        if(recibo[cadenaDolares + contador][1] == referencia){
          array.push(recibo[cadenaDolares + contador][0]);
          array.push(recibo[cadenaDolares + contador][1]);
          array.push(recibo[cadenaDolares + contador][2]);
          array.push(estatus);
          array.push(false);
          await updateDoc(doc(Base, "pagos", (recibo.IdPago).toString()), {[cadenaDolares + contador]: array});
          return 0;
        }
        contador++;
      }
      else break;
    }
  }
  if(tipoPago == "Zelle"){
    while(true){
      if(recibo.hasOwnProperty(cadenaZelle + contador)){
        if(recibo[cadenaZelle + contador][0] == referencia){
          array.push(recibo[cadenaZelle + contador][0]);
          array.push(recibo[cadenaZelle + contador][1]);
          array.push(estatus);
          array.push(false);
          await updateDoc(doc(Base, "pagos", (recibo.IdPago).toString()), {[cadenaZelle + contador]: array});
          return 0;
        }
        contador++;
      }
      else break;
    }
  }
}


async function verificarPago(){
    try {
      if(verificarGrises() == 1){
        mostrarPantallaError("El pago no tiene métodos que requieran verificación");
        return 0;
      }
      debugger;
      let numeroTicket = extraerNumerosPuntosComasDeUnaCadena(document.getElementById("idPagoPantallaDatosPago").textContent);
      let documentoDePago = await getDoc(doc(Base, "pagos", numeroTicket));
      documentoDePago = documentoDePago.data();
      let tabla = document.getElementById("tablaDetallesPagoUnico");
      let total = 0;
      let tablaPagos = document.getElementById("tablaDetallesPagoUnico");;
      let cadenaVerificarEstudiante = "verificarEstudiante";
      let numero = 1;
      let copiaTotal;
      let verificacion;
      let direccionRepresentante;
      let direccionEstudiante;
      let mes;
      let montoPago = 0;
      let montoPoner = 0;
      let montoAbono = 0;
      let verificador;
      let precioDolar = documentoDePago.precioDolar;
      let referencia;
      let estatus; //VARIABLE PARA PONER CUAL ESTA ACEPTADA Y CUAL NO
      for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(tabla.rows[i].cells[6].children[0].checked == true){
          total = sumaDecimal(numberAformatoMontos(total), tabla.rows[i].cells[4].textContent);
        }
      }
      for(let i = 1; i <= tablaPagos.rows.length - 1; i++){
        if(tablaPagos.rows[i].cells[0].textContent == "Transferencia"){
          estatus = !(tablaPagos.rows[i].cells[6].children[0].checked); 
          referencia = tablaPagos.rows[i].cells[3].textContent;
          await ponerPropiedadAfalseVerificarPago("Transferencia", referencia, documentoDePago, estatus);
        }
        if(tablaPagos.rows[i].cells[0].textContent == "Efectivo Dolares"){
          estatus = !(tablaPagos.rows[i].cells[6].children[0].checked); 
          referencia = tablaPagos.rows[i].cells[3].textContent;
          await ponerPropiedadAfalseVerificarPago("Dolares", referencia, documentoDePago, estatus);
        }
        if(tablaPagos.rows[i].cells[0].textContent == "Zelle"){
          estatus = !(tablaPagos.rows[i].cells[6].children[0].checked); 
          referencia = tablaPagos.rows[i].cells[3].textContent;
          await ponerPropiedadAfalseVerificarPago("Zelle", referencia, documentoDePago, estatus);
        }
      }
      copiaTotal = total;
      do{
        direccionEstudiante = documentoDePago[cadenaVerificarEstudiante + numero][1];
        direccionRepresentante = documentoDePago[cadenaVerificarEstudiante + numero][0];
        verificacion = await getDoc(doc(Base, direccionRepresentante));
        if(!verificacion.exists()){
          await updateDoc(doc(Base, "pagos/" + numeroTicket), {flagVerificar: false});
          ocultarPantallaCarga();
          mostrarPantallaError("El estudiante no está registrado en la base");
          return 0;
        }
        mes = documentoDePago[cadenaVerificarEstudiante + numero][2];
        mes = mes.split("-");
        montoPago = formatoMontosAnumber(mes[1]);
        debugger;
        copiaTotal = restaDecimal(numberAformatoMontos(copiaTotal), mes[1]);
        if(copiaTotal < 0){
          montoAbono = copiaTotal * (-1);
          montoAbono = montoAbono / precioDolar;
        }
        if(mes[2] == "SI"){
          verificador = true;
        } 
        else{
          verificador = false;
        }
        if(mes[0].includes("Septiembre")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono09Septiembre: [montoAbono, verificador], 
                                                                pago09Septiembre: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago09Septiembre: false});     
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono09Septiembre: [0, false],
                                                                pago09Septiembre: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago09Septiembre: true});               
          }
        }
        if(mes[0].includes("Octubre")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono10Octubre: [montoAbono, verificador], 
                                                                pago10Octubre: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago10Octubre: false});   
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono10Octubre: [0, false],
                                                                pago10Octubre: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago10Octubre: true});               
          }
        }
        if(mes[0].includes("Noviembre")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono11Noviembre: [montoAbono, verificador],
                                                                pago11Noviembre: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago11Noviembre: false});    
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono11Noviembre: [0, false],
                                                                pago11Noviembre: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago11Noviembre: true});               
          }
        }
        if(mes[0].includes("Diciembre")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono12Diciembre: [montoAbono, verificador], 
                                                                pago12Diciembre: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago12Diciembre: false}); 
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono12Diciembre: [0, false],
                                                                pago12Diciembre: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago12Diciembre: true});               
          }
        }
        if(mes[0].includes("Enero")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono13Enero: [montoAbono, verificador],
                                                                pago13Enero: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago13Enero: false});   
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono13Enero: [0, false],
                                                                pago13Enero: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago13Enero: true});               
          }
        }
        if(mes[0].includes("Febrero")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono14Febrero: [montoAbono, verificador], 
                                                                pago14Febrero: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago14Febrero: false});   
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono14Febrero: [0, false],
                                                                pago14Febrero: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago14Febrero: true});               
          }
        }
        if(mes[0].includes("Marzo")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono15Marzo: [montoAbono, verificador],
                                                                pago15Marzo: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago15Marzo: false});    
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono15Marzo: [0, false],
                                                                pago15Marzo: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago15Marzo: true});               
          }
        }
        if(mes[0].includes("Abril")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono16Abril: [montoAbono, verificador], 
                                                                pago16Abril: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago16Abril: false});    
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono16Abril: [0, false],
                                                                pago16Abril: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago16Abril: true});               
          }
        }
        if(mes[0].includes("Mayo")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono17Mayo: [montoAbono, verificador], 
                                                                pago17Mayo: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago17Mayo: false});  
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono17Mayo: [0, false],
                                                                pago17Mayo: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago17Mayo: true});               
          }
        }
        if(mes[0].includes("Junio")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono18Junio: [montoAbono, verificador], 
                                                                pago18Junio: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago18Junio: false}); 
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono18Junio: [0, false],
                                                                pago18Junio: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago18Junio: true});               
          }
        }
        if(mes[0].includes("Julio")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono19Julio: [montoAbono, verificador], 
                                                                pago19Julio: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago19Julio: false}); 
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono19Julio: [0, false],
                                                                pago19Julio: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago19Julio: true});               
          }
        }
        if(mes[0].includes("Agosto")){
          if(copiaTotal < 0){
            await updateDoc(doc(Base, direccionRepresentante), {abono20Agosto: [montoAbono, verificador], 
                                                                pago20Agosto: false});
            await updateDoc(doc(Base, direccionEstudiante), {pago20Agosto: false}); 
          }
          else{
            await updateDoc(doc(Base, direccionRepresentante), {abono20Agosto: [0, false],
                                                                pago20Agosto: true});
            await updateDoc(doc(Base, direccionEstudiante), {pago20Agosto: true});               
          }
        }
        numero++;
        if(copiaTotal < 0) break;
      }
      while(documentoDePago.hasOwnProperty(cadenaVerificarEstudiante + numero));
      await updateDoc(doc(Base, "pagos/" + numeroTicket), {flagVerificar: false});
      document.getElementById("necesitaVerificacion").textContent = "El pago ya fue verificado";
      ocultarPantallaCarga();
      mostrarPantallaExito("EXITO!");
      cambiarIconoVerificacion();
    } catch (error) {
      ocultarPantallaCarga();
      mostrarPantallaError("Error Inesperado");
      console.log("ERROR: ", error);
    }
  }