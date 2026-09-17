/*global document */

//ESTE DOCUMENTO CONTIENE TODA LA NEVGACION INCLUSO PARA ENTRAR Y SALIR DE LOS MODULOS

import { entrarGestionEstudiantes, 
         atrasGestionEstudiantes, 
         entrarTiposInscripcion, 
         atrasTiposInscripcion,
         entrarInscribirEstudiante,
         atrasInscribirEstudiantes,
         entrarProsecucion,
         entrarPantallaNuevoIngreso,
         atrasPantallaNuevoIngreso,
         atrasEstudiantesProsecucion,
         atrasRepresentanteProsecucion,
         atrasRepresentanteNuevoIngreso,
         entrarInscripcionConvenio} from "./controlesGestionEstudiantes.js";

//ENTRAR A GESTION Y SALIR DE GESTION 

document.getElementById("GestionEstudiantes").addEventListener("click", entrarGestionEstudiantes);
document.getElementById("atrasGestionEstudiantes").addEventListener("click", atrasGestionEstudiantes);

//ENTRAR Y SALIR DE LOS TIPOS DE INSCRIPCION

document.getElementById("tiposInscripcion").addEventListener("click", entrarTiposInscripcion);
document.getElementById("atrasTiposInscripcion").addEventListener("click", atrasTiposInscripcion);

//INSCRIPCION CONVENIO

document.getElementById("inscripcionConvenio").addEventListener("click", entrarInscripcionConvenio);

//ENTRAR Y SALIR DE INSCRIPCION NUEVO INGRESO

document.getElementById("atrasIntroducirDatosRepresentanteRegistradoInscripcion").addEventListener("click", atrasRepresentanteNuevoIngreso);

//ENTRAR Y SALIR PANTALLA CONSULTA 1 NUEVO INGRESO

document.getElementById("inscribirEstudiante").addEventListener("click", entrarPantallaNuevoIngreso);
document.getElementById("atrasIntroducirDatosNuevoIngreso").addEventListener("click", atrasPantallaNuevoIngreso);

//PROSECUCION

document.getElementById("atrasEstudiantesProsecucion").addEventListener("click", atrasEstudiantesProsecucion);
document.getElementById("atrasRepresentanteProsecucion").addEventListener("click", atrasRepresentanteProsecucion);
document.getElementById("reinscribirEstudiante").addEventListener("click", entrarProsecucion);




document.getElementById("atrasInscribirEstudiantes").addEventListener("click", atrasInscribirEstudiantes);

// //ENTRAR Y SALIR DE REINSCRIBIR ESTUDIANTES

//ENTRAR Y SALIR DE RETIRAR ESTUDIANTES
