/*global document, console */

import { interfazRegistroRepresentante } from "./controlesRegistrarRepresentante.js";
import { setDoc, getDoc, doc, Base } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, mostrarPantallaExito, ocultarPantallaCarga } from "./modal.js";

class conexionBD{

    async registrarRepresentante(){

        try {

            mostrarPantallaCarga();

            let interfaz = new interfazRegistroRepresentante();

            if(interfaz.formularioInvalido()){

                ocultarPantallaCarga();
                return;

            }

            let datosRepresentante = interfaz.obtenerObjetoRepresentante();

            let repreExistente = await this.representanteExistente(datosRepresentante.cedula);

            if(repreExistente == "ERROR") return;

            if(repreExistente){

                ocultarPantallaCarga();
                mostrarPantallaError("El representante ya está registrado");
                return;

            }

            await setDoc(doc(Base, "representantes/" + datosRepresentante.cedula), datosRepresentante);

            ocultarPantallaCarga();

            mostrarPantallaExito("Representante Registrado");

            interfaz.limpiarFormulario();
            
        } catch (error) {
            ocultarPantallaCarga();
            mostrarPantallaError(error);
            return "ERROR";
        }

    }

    async representanteExistente(cedula){

        try {

            let representante = await getDoc(doc(Base, "representantes", cedula));

            if(representante.exists()) return true;

            return false;    

        } catch (error) {
            ocultarPantallaCarga();
            mostrarPantallaError(error);
            return "ERROR";
        }

    }

}

export async function registrarRepresentanteNuevoModulo(){

    let conexion = new conexionBD();

    await conexion.registrarRepresentante();

}

