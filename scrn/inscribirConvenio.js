/* global document, console */


import {armarDirectorioEstudiante, 
        armarDirectorioRepresentante, 
        arrayObjetosEstudiantesRepresentante, 
        arrayObjetosEstudiantesSeccion } from "./controlesInscripcionConvenio.js";
import {Base, doc, 
        setDoc} from "./firebase.js";

import {mostrarPantallaCarga, mostrarPantallaError,
        ocultarPantallaCarga} from "./modal.js";

export async function inscribirConConvenio(){

    mostrarPantallaCarga();

    let directorioRepresentante;
    let directorioEstudiante;

    let estudianteRepreSubir;
    let estudianteSubir;

    try {
        
      //if(tipoInscripcion == "Nuevo Ingreso"){

        //if(!flagRepresentanteRegistrado && !flagAbonoRepreNoRegistrado) await registrarRepresentante(); //SI NO ESTA REGISTRADO, REGISTRAR
        //if(flagAbonoRepreNoRegistrado) await registrarRepresentanteConAbono(); //SI TIENE ABONO Y NO ESTA REGISTRADO, REGISTRAR

      //}

      for(let i = 0; i <= arrayObjetosEstudiantesSeccion.length - 1; i++){

        estudianteRepreSubir = arrayObjetosEstudiantesRepresentante[i];
        estudianteSubir = arrayObjetosEstudiantesSeccion[i];

        estudianteRepreSubir.pagoInscripcion = false;
        estudianteSubir.pagoInscripcion = false;

        directorioEstudiante = armarDirectorioEstudiante(arrayObjetosEstudiantesRepresentante[i]);
        directorioRepresentante = armarDirectorioRepresentante(estudianteSubir.cedula, estudianteSubir.cedulaRepresentante);

        //AHORA LOS REGISTRO

        await setDoc(doc(Base, directorioEstudiante, estudianteSubir.cedula), estudianteSubir);    
        await setDoc(doc(Base, directorioRepresentante), estudianteRepreSubir);  

      }

      //AQUI PONEMOS ESA LLAMADA


    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError();
        console.log(error);
        return "ERROR";
    }

    
    
    ocultarPantallaCarga();

}
