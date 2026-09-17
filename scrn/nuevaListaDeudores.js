/*global document */

import { gestorGUIannoListaDeudores } from "./controlesNuevaListaDeudoresAnno.js";
import { gestorGUIseccionListaDeudores } from "./controlesNuevaListaDeudoresSeccion.js";
import { Base, collection, getDocs, orderBy, query } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

export class consultorBDnuevaListaDeudores{

    async consultarTodasLasSecciones(annoEscolarConsulta){

        let arrayEstudiantes = [];

        let cursos = [
                    "Primer Nivel",
                    "Segundo Nivel",
                    "Tercer Nivel",
                    "Primer Grado",
                    "Segundo Grado",
                    "Tercer Grado",
                    "Cuarto Grado",
                    "Quinto Grado",
                    "Sexto Grado",
                    "Primer Año",
                    "Segundo Año",
                    "Tercer Año",
                    "Cuarto Año",
                    "Quinto Año"
                    ];

        let estudianteArray;

        let secciones = ["Sección A", "Sección B"];

        let objConsulta = {

            annoEscolar: annoEscolarConsulta,
            grado: "",
            curso: "",
            seccion: ""

        };

        let retorno;

        for(let i = 0; i <= cursos.length - 1; i++){

            objConsulta.curso = cursos[i];

            if(cursos[i].includes("Nivel")) objConsulta.grado = "Preescolar"; 
            if(cursos[i].includes("Grado")) objConsulta.grado = "Primaria"; 
            if(cursos[i].includes("Año")) objConsulta.grado = "Bachillerato";

            //SOLO FALTA LA SECCION
            
            for(let j = 0; j <= secciones.length - 1; j++){

                objConsulta.seccion = secciones[j];

                retorno = await this.consultarSeccion(objConsulta);

                retorno.forEach(estudiante => {

                    estudianteArray = estudiante.data();

                    estudianteArray["curso"] = cursos[i];

                    estudianteArray["seccion"] = secciones[j];

                    arrayEstudiantes.push(estudianteArray);
                    
                });

            }

        }

        return arrayEstudiantes;

    }

    async consultarSeccion(objConsulta){

        let directorioConsulta;

        if(objConsulta.annoEscolar != "2024-2025"){

            directorioConsulta = "estudiantes/" + objConsulta.annoEscolar + "/";
            directorioConsulta += objConsulta.grado + "/";
            directorioConsulta += objConsulta.curso + " " + objConsulta.seccion;
            directorioConsulta += "/Estudiantes";

        }

        else{

            directorioConsulta = "estudiantes/";
            directorioConsulta += objConsulta.grado + "/";
            directorioConsulta += objConsulta.curso + " " + objConsulta.seccion;            

        }

        let estudiantes = await getDocs(query(collection(Base, directorioConsulta), orderBy("nombres")));

        return estudiantes;

    }

}

export class mediadorAnnoNuevaListaDeudores{

    obtenerDatosConsulta(){

        let gestor = new gestorGUIannoListaDeudores();

        return gestor.obtenerDatosConsulta();

    }

    formularioInvalido(){

        let gestor = new gestorGUIannoListaDeudores();

        return gestor.formularioInvalido();

    }

    dibujarTabla(arrayEstudiantes, mesLimite){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.dibujarTabla(arrayEstudiantes, mesLimite);

    }

    limpiarInterfaz(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.limpiarInterfaz();

    }

    limpiarTabla(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.limpiarTabla();

    }

    salir(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.salir();

    }

    ocultarTabla(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.ocultarTabla();

    }

    mostrarTabla(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.mostrarTabla();

    }

    obtenerMesLimite(){

        let gestor = new gestorGUIannoListaDeudores();

        return gestor.obtenerMesLimite();

    }

    async consultarTodasLasSecciones(annoEscolar){

        let consultor = new consultorBDnuevaListaDeudores();

        let array = await consultor.consultarTodasLasSecciones(annoEscolar);

        return array;

    }

    noHayDeudores(){

        let gestor = new gestorGUIannoListaDeudores();

        return gestor.noHayDeudores();

    }

    pantallaNoHayDeudores(){

        let gestor = new gestorGUIannoListaDeudores();

        gestor.pantallaNoHayDeudores();

    }

}

export class mediadorNuevaListaDeudoresSeccion{

    limpiarInterfaz(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.limpiarInterfaz();

    }

    formularioInvalido(){

        let gestor = new gestorGUIseccionListaDeudores();

        return gestor.formularioInvalido();

    }

    limpiarTabla(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.limpiarTabla();


    }

    ocultarTabla(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.ocultarTabla();


    }

    mostrarTabla(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.mostrarTabla();


    }

    salir(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.salir();


    }

    dibujarTabla(arrayEstudiantes, mesLimite, datos){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.dibujarTabla(arrayEstudiantes, mesLimite, datos);

    }

    obtenerDatosConsulta(){

        let gestor = new gestorGUIseccionListaDeudores();

        return gestor.obtenerDatosConsulta();

    }

    obtenerMesLimite(){

        let gestor = new gestorGUIseccionListaDeudores();

        return gestor.obtenerMesLimite();

    }

    determinarSelectCurso(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.determinarSelectCurso();

    }

    async consultarSeccion(objConsulta){

        let consultor = new consultorBDnuevaListaDeudores();

        let resultado = await consultor.consultarSeccion(objConsulta);

        let array = [];

        resultado.forEach(estudiante => {

            let estudianteArray = estudiante.data();

            array.push(estudianteArray);

        });

        return array;

    }

    noHayDeudores(){

        let gestor = new gestorGUIseccionListaDeudores();

        return gestor.noHayDeudores();

    }

    pantallaNoHayDeudores(){

        let gestor = new gestorGUIseccionListaDeudores();

        gestor.pantallaNoHayDeudores();

    }

}


export async function consultarDeudoresAnnoCompletoNuevaLista(){

    mostrarPantallaCarga();
    
    let media = new mediadorAnnoNuevaListaDeudores();
    
    if(media.formularioInvalido()){

        ocultarPantallaCarga();
        mostrarPantallaError("Seleccione el mes a consultar");
        return;

    }

    media.ocultarTabla();

    media.limpiarTabla();
    
    let datos = media.obtenerDatosConsulta();

    let estudiantes = await media.consultarTodasLasSecciones(datos);

    let mesLimite = media.obtenerMesLimite();

    media.dibujarTabla(estudiantes, mesLimite);

    media.mostrarTabla();

    ocultarPantallaCarga();

    if(media.noHayDeudores()){

        media.pantallaNoHayDeudores();
        media.ocultarTabla();

    };

}

export async function consultarDeudoresSeccionNuevaLista(){

    mostrarPantallaCarga();

    let media = new mediadorNuevaListaDeudoresSeccion();

    if(media.formularioInvalido()){

        return;

    }

    media.ocultarTabla();

    media.limpiarTabla();

    let datos = media.obtenerDatosConsulta();

    let estudiantes = await media.consultarSeccion(datos);

    let mesLimite = media.obtenerMesLimite();

    media.dibujarTabla(estudiantes, mesLimite, datos);

    media.mostrarTabla();

    ocultarPantallaCarga();

    if(media.noHayDeudores()){

        media.pantallaNoHayDeudores();
        media.ocultarTabla();

    };

}