/*global document, console, TextEncoder */

import { doc, Base, updateDoc, getDoc, setDoc } from "./firebase.js";
import {mostrarPantallaCarga,
        ocultarPantallaCarga,
        mostrarPantallaError} from "./modal.js";

import{formularioInvalido,
       dibujarAbonosTablaConsultar,
       limpiarTablaAbonos,
       
} from "./controlesAbonos.js";

import { reciboAbono } from "./objetos.js";
import { eliminadorDeMetodos, fechaDeHoy, formatoMontosAnumber, numberAformatoMontos, reemplazarCaracteres, restaDecimal, sumaDecimal } from "./utilidades.js";
import {setCedulaRepresentante} from "./controlesEfectuarPago.js";
import { precioDolar,
    verificarDolares,
    verificarTransferencia,
    verificarZelle
 } from "./obtenerPrecios.js";
import { mostrarDocumentodePagoAbono } from "./recibos.js";
export {consultarAbonos,
        subirAbono,
        descontarAbono
};

import { asignarCedulaRepresentanteMetodosPagos } from "./pagosMetodos.js";

//CONTENEDOR ABONOS: ARRAY [N ,N]

//ARRAY[0]: DOLARES
//ARRAY[1]: BS
//ARRAY[2]: NOMBRE CONTENEDOR

let cedulaRepresentante;
let nombreRepresentante;

async function consultarAbonos(){
    try {
        mostrarPantallaCarga();
        if(formularioInvalido()){
            ocultarPantallaCarga();
            mostrarPantallaError("Introduzca solo números en el formulario");
            return;
        }

        limpiarTablaAbonos();

        cedulaRepresentante = document.getElementById("cedulaRepresentanteAbonos").value;

        let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentante));

        console.log(datosRepresentante.data());

        if(!datosRepresentante.exists()){
            ocultarPantallaCarga();
            mostrarPantallaError("El representante no esta registrado en la base de datos");
            return;
        }

        setCedulaRepresentante(cedulaRepresentante);
        asignarCedulaRepresentanteMetodosPagos(cedulaRepresentante);
        nombreRepresentante = datosRepresentante.data().nombres + " " + datosRepresentante.data().apellidos;

        document.getElementById("nombreRepresentanteAbonos").value = datosRepresentante.data().nombres + " " + datosRepresentante.data().apellidos; 

        console.log(datosRepresentante.data());

        dibujarAbonosTablaConsultar(datosRepresentante.data());

        ocultarPantallaCarga();

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al consultar: ", error);
    }
}

// await subirAbono();

function obtenerArrayTabla(){
    let objeto = {};
    let tabla = document.getElementById("tabla-consultar-abonosRepresentante");
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
        objeto["abonos" + nombreContenedor][2] = montoIntroducirContenedor;
    }
    return objeto;
}

function acomodarObjetoSubir(datosRepre, objetoSubir){
    let suma;
    let valorObjeto;
    let valorRepre;

    for(let propiedad in objetoSubir){
        if(datosRepre.hasOwnProperty(propiedad)){
            valorRepre = datosRepre[propiedad][2];
            valorRepre = numberAformatoMontos(valorRepre);
            valorObjeto = objetoSubir[propiedad][2];
            suma = sumaDecimal(valorObjeto, valorRepre);
            objetoSubir[propiedad][2] = suma;
        }
        else objetoSubir[propiedad][2] = formatoMontosAnumber(objetoSubir[propiedad][2]);
    }

    return objetoSubir;
}

async function subirYescribirRecibo(totalPagado, arrayTabla){

    let obtenerNumeroDePago = await doc(Base, "variables", "numero_de_transacciones");
    let numeroDePago = await getDoc(obtenerNumeroDePago);
    let IdPagoObtener = numeroDePago.data();
    let IdPago = IdPagoObtener.numero + 1;

    let fechaActual = fechaDeHoy();

    const recibo = new reciboAbono(IdPago, nombreRepresentante, cedulaRepresentante, 
                                fechaActual, precioDolar, totalPagado, "Abono", false);


    recibo.obtenerMetodosPago(verificarDolares, verificarTransferencia, verificarZelle, arrayTabla);

    recibo.rellenarReciboVer5();

    let reciboSubir = eliminadorDeMetodos(recibo);

    
    await updateDoc(obtenerNumeroDePago, {numero: IdPago});
    await setDoc(doc(Base, "pagos/" + IdPago), reciboSubir);
    
    recibo.escribirReciboVer5(document.getElementById("tablaTicketAbono"));
}


async function subirAbono(totalPagado, arrayTabla){
    try {
        mostrarPantallaCarga();

        let representante = await doc(Base, "representantes", cedulaRepresentante);
        let datosRepre = await getDoc(representante);
        datosRepre = datosRepre.data();


        let objetoSubir = obtenerArrayTabla();
        objetoSubir = acomodarObjetoSubir(datosRepre, objetoSubir);

        for(let propiedad in objetoSubir){
            await updateDoc(representante, {["abonos" + objetoSubir[propiedad][0]]: objetoSubir[propiedad]});
        }

        await subirYescribirRecibo(totalPagado, arrayTabla);

        ocultarPantallaCarga();

        mostrarDocumentodePagoAbono();

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al abonar: ", error);
    }
}

async function descontarAbono(cedulaRepre, contenedor, monto){
    try {
        let representante = await doc(Base, "representantes", cedulaRepre);
        let datosRepre = await getDoc(representante);
        datosRepre = datosRepre.data();

        let resta = datosRepre["abonos" + contenedor][2];
        resta = numberAformatoMontos(resta);
        resta = restaDecimal(resta, monto);

        let nuevaActualizada = datosRepre["abonos" + contenedor];
        nuevaActualizada[2] = resta;

        await updateDoc(representante, {["abonos" + contenedor]: nuevaActualizada});

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error: " + error);
        console.log("Error al abonar: ", error);
    }

}

