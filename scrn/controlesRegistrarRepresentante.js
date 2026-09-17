/*global document */

import { mostrarPantalla, obtenerElementoHTML, ocultar } from "./funcionesHTML.js";
import { mostrarPantallaError } from "./modal.js";

export class interfazRegistroRepresentante{

    entrar(){

        ocultar("main-container-postLogin");
        mostrarPantalla("mainContainerRegistrarRepresentante");

    }

    atras(){

        ocultar("mainContainerRegistrarRepresentante");
        mostrarPantalla("main-container-postLogin");

    }

    limpiarFormulario(){

        let formulario = obtenerElementoHTML("formularioRepresentanteRegistrar");

        formulario.children[0].value = "";
        formulario.children[1].value = "";
        formulario.children[2].value = "";
        formulario.children[3].value = "";
        formulario.children[4].selectedIndex = 0;
        formulario.children[5].value = "";
        formulario.children[6].value = "";
        formulario.children[7].value = "";
        formulario.children[8].value = "";
        formulario.children[9].value = "";

    }

    obtenerObjetoRepresentante(){

        let formulario = obtenerElementoHTML("formularioRepresentanteRegistrar");

        let representante = formulario.children[4].options[formulario.children[4].selectedIndex].textContent;

        let objetoRepresentante = {

            nombres: formulario.children[0].value,
            apellidos: formulario.children[1].value,
            cedula: formulario.children[2].value,
            telefono: formulario.children[3].value,
            tipoRepresentante: representante,
            direccionRepresentante: formulario.children[5].value,
            nombrePadre: formulario.children[6].value,
            cedulaPadre: formulario.children[7].value,
            nombreMadre: formulario.children[8].value,
            cedulaMadre: formulario.children[9].value,
            registroPagos: [],
            hermanos: ""


        };

        return objetoRepresentante;

    }

    formularioInvalido(){

        let datos = this.obtenerObjetoRepresentante();

        if(datos.nombres == ""){

            mostrarPantallaError("Introduzca el nombre del representante");
            return true;

        }

        if(datos.apellidos == ""){

            mostrarPantallaError("Introduzca el apellido del representante");
            return true;

        }

        if(datos.cedula == ""){

            mostrarPantallaError("Introduzca la cédula del representante");
            return true;

        }

        if(datos.telefono == ""){

            mostrarPantallaError("Introduzca el número de télefono del representante");
            return true;

        }

        if(datos.tipoRepresentante == "Tipo"){

            mostrarPantallaError("Introduzca el tipo de representante");
            return true;

        }

        if(datos.direccionRepresentante == ""){

            mostrarPantallaError("Introduzca la dirección del representante");
            return true;

        }

        if(datos.nombrePadre == ""){

            mostrarPantallaError("Introduzca el nombre del padre del o los representados");
            return true;

        }

        if(datos.cedulaPadre == ""){

            mostrarPantallaError("Introduzca la cédula del padre del o los representados");
            return true;

        }

        if(datos.nombreMadre == ""){

            mostrarPantallaError("Introduzca el nombre de la madre del o los representados");
            return true;

        }

        if(datos.cedulaMadre == ""){

            mostrarPantallaError("Introduzca la cédula de la madre del o los representados");
            return true;

        }

        return false;

    }

}

export function entrarRegistrarRepresentante(){

    let interfaz = new interfazRegistroRepresentante();

    interfaz.entrar();

}

export function atrasRegistrarRepresentante(){

    let interfaz = new interfazRegistroRepresentante();

    interfaz.atras();
    interfaz.limpiarFormulario();

}