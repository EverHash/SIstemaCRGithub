/*global document */

import { consultarInputText, limpiarInputText, mostrarBlock, mostrarFlex, mostrarPantalla, ocultar } from "./funcionesHTML.js";
import { mostrarPantallaError } from "./modal.js";
import { verSiEsNumeroEntero } from "./utilidades.js";

export function entrarEliminarRecibo(){

    ocultar("main-container-postLogin");
    mostrarPantalla("mainContainerEliminarRecibo");

}

export function atrasEliminarRecibo(){

    ocultar("mainContainerEliminarRecibo");
    mostrarPantalla("main-container-postLogin");

    ocultarBotonTablaReciboEliminar();
    limpiarInputText("consultarReciboEliminarInput");

}

export function inputInvalidoReciboEliminar(){

    let valor = consultarInputText("consultarReciboEliminarInput");

    if(valor == ""){

        mostrarPantallaError("Introduzca el numero de recibo");
        return true;

    }

    if(verSiEsNumeroEntero(valor)){

        mostrarPantallaError("Introduzca solo numeros en el campo de texto");
        return true;

    }

    return false;

}

export function ocultarBotonTablaReciboEliminar(){

    ocultar("tablaReciboEliminar");
    ocultar("botonEliminarRecibo");

}

export function mostrarBotonTablaReciboEliminar(){

    mostrarBlock("tablaReciboEliminar");
    mostrarFlex("botonEliminarRecibo");

}

export function mostrarPantallaConfirmarBorrarRecibo(){

    mostrarPantalla("pantallaPreguntaConfirmarBorrarRecibo");

}

export function ocultarPantallaConfirmarBorrarRecibo(){

    ocultar("pantallaPreguntaConfirmarBorrarRecibo");
    
}


        // await deleteDoc(doc(Base, "representantes/", objetoRepresentante.cedula));


        // //BUCLE DE ELIMINACION DE LA BASE
      
        // for(let i = 1; i <= formularios.length - 1; i++){
            
        //   j = i - 1;
        

        //   await deleteDoc(doc(Base, "estudiantes/" + arrayEstudiantesActualizar[j].grado + "/" 
        //                       + arrayEstudiantesActualizar[j].curso + " " 
        //                       + arrayEstudiantesActualizar[j].seccion,         
        //                       arrayEstudiantesActualizar[j].cedula));  
          
        //   await deleteDoc(doc(Base, "representantes/" + objetoRepresentante.cedula + "/estudiantes/", arrayEstudiantesActualizar[j].cedula)); 
        
        
        // obtenerDocumentosDePago = await query(coleccionPagos, where("fecha", "==", fecha));
        // documentosDePago = await getDocs(obtenerDocumentosDePago);
        // documentosDePago.forEach((documento) => {
        //   arrayDocumentoPagos.push(documento.data());