/* global console, document */


import {dibujarTablaPagosRepresentante, 
        mostrarTablaPagosRepresentante, 
        ocultarTablaPagosRepresentante, 
        limpiarListaPagosRepresentantes,
        formularioInvalido,
        escribirPagoVer5,
        escribirPagoExonerado} from "./controlesPagosRepresentante.js";
import { Base, collection, getDocs, orderBy, query, where } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

export{buscarPagosRepresentante};


async function buscarPagosRepresentante(){
    try{
        mostrarPantallaCarga();
        ocultarTablaPagosRepresentante();
        if(formularioInvalido()){
            ocultarPantallaCarga();
            return;
        } 
        limpiarListaPagosRepresentantes();
        let cedulaRepresentante = document.getElementById("cedulaPagosRepresentante").value;
        let directorioPagos = await collection(Base, "pagos");
        let solicitud = await query(directorioPagos, orderBy("IdPago", "desc"), where("cedulaRepresentante", "==", cedulaRepresentante));
        let pagos = await getDocs(solicitud);
        let hayPagos = false;
        pagos.forEach(datosPago => {
            hayPagos = true;
        });
        if(hayPagos){
            pagos.forEach(datosPago => {

                datosPago = datosPago.data();

                if(datosPago.tipoDePago == "Edición de Mensualidad"){

                    escribirPagoExonerado(datosPago);

                }
                else{

                    if(datosPago.version == 5) escribirPagoVer5(datosPago);
                    else dibujarTablaPagosRepresentante(datosPago);

                }


            });
            mostrarTablaPagosRepresentante();
        }
        else{
            mostrarPantallaError("El representante no tiene pagos registrados en el sistema");
        }
        ocultarPantallaCarga();
    } 
    catch (error) {
        ocultarPantallaCarga();
        console.log("ERROR AL PAGAR: ", error);
        mostrarPantallaError("Error Inesperado");
    }
}