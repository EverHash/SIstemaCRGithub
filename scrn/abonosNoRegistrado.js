/*global document, console */

import { doc, Base, updateDoc, getDoc, setDoc } from "./firebase.js";
import {mostrarPantallaCarga,
        ocultarPantallaCarga,
        mostrarPantallaError} from "./modal.js";


import { reciboAbonoNoRegistrado } from "./objetos.js";
import { eliminadorDeMetodos, fechaDeHoy, formatoMontosAnumber} from "./utilidades.js";
import {setCedulaRepresentante} from "./controlesEfectuarPago.js";
import { precioDolar,
    verificarDolares,
    verificarTransferencia,
    verificarZelle
 } from "./obtenerPrecios.js";
import { mostrarDocumentodePagoAbonoNoRegistrado } from "./recibos.js";
export {subirAbonoNoRegistrado, 
        representanteYaRegistrado
};

import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";

//CONTENEDOR ABONOS: ARRAY [N ,N]

//ARRAY[0]: DOLARES
//ARRAY[1]: BS
//ARRAY[2]: NOMBRE CONTENEDOR

let cedulaRepresentante;
let nombreRepresentante;

async function representanteYaRegistrado(){

    try {
    
        mostrarPantallaCarga();

        cedulaRepresentante = document.getElementById("cedulaRepresentanteAbonoNoRegistrado").value;

        let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));

        if(datosRepresentante.exists()){
            console.log(datosRepresentante.data());
            ocultarPantallaCarga();
            return true;
        } 
        else{
            setCedulaRepresentante(cedulaRepresentante); //CONTROLES EFECTUAR PAGO
            asignarCedulaRepresentanteMetodosPagos(cedulaRepresentante); //PAGOS METODOS.JS
            ocultarPantallaCarga();
            return false;

        } 
    
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al consultar: ", error);
    }


}

function obtenerArrayTabla(){
    let objeto = {};
    let tabla = document.getElementById("tablaConsultarAbonosRepresentanteNoRegistrado");
    let nombreContenedor;
    let monedaContenedor;
    let montoIntroducirContenedor;

    for(let i = 1; i <= tabla.rows.length - 1; i++){
        nombreContenedor = tabla.rows[i].cells[0].children[0].value;

        monedaContenedor = tabla.rows[i].cells[1].children[0].options[tabla.rows[i].cells[1].children[0].selectedIndex].textContent;
        montoIntroducirContenedor = tabla.rows[i].cells[3].children[0].value;
        objeto["abonos" + nombreContenedor] = [];
        objeto["abonos" + nombreContenedor][0] = nombreContenedor;
        objeto["abonos" + nombreContenedor][1] = monedaContenedor;
        objeto["abonos" + nombreContenedor][2] = formatoMontosAnumber(montoIntroducirContenedor);
    }
    return objeto;
}



async function registrarRepresentanteAbonos(){

    try {
        
    let representante = {

        cedula: cedulaRepresentante,
        nombres: document.getElementById("nombresRepresentanteAbonoNoRegistrado").value,
        apellidos: document.getElementById("apellidosRepresentanteAbonoNoRegistrado").value

    };

    nombreRepresentante = representante.nombres + " " + representante.apellidos;

    let objetoSubir = obtenerArrayTabla();

    for(let propiedad in objetoSubir){

        representante[propiedad] = objetoSubir[propiedad];

    }


    await setDoc(doc(Base, "representantes/" + cedulaRepresentante), representante);

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al abonar: ", error);
    }

}

async function subirYescribirRecibo(totalPagado, arrayTabla){

    try {
        
        let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
        let numeroDePago = await getDoc(obtenerNumeroDePago);
        let IdPagoObtener = numeroDePago.data();
        let IdPago = IdPagoObtener.numero + 1;

        let fechaActual = fechaDeHoy();

        const recibo = new reciboAbonoNoRegistrado(IdPago, nombreRepresentante, cedulaRepresentante, 
                                       fechaActual, precioDolar, totalPagado, "Abono", false);

        recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);

        recibo.rellenarReciboVer5();

        recibo.escribirReciboVer5(document.getElementById("tablaTicketAbonoNoRegistrado"));

        let reciboSubir = eliminadorDeMetodos(recibo);

        await updateDoc(obtenerNumeroDePago, {numero: IdPago});
        await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al abonar: ", error);
    }

}


async function subirAbonoNoRegistrado(totalPagado, arrayTabla){
    try {

        mostrarPantallaCarga();

        await registrarRepresentanteAbonos();

        await subirYescribirRecibo(totalPagado, arrayTabla);

        ocultarPantallaCarga();

        mostrarDocumentodePagoAbonoNoRegistrado();

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al abonar: ", error);
    }
}