/*global document */

//ESTE DOCUMENTO CONTIENE LOS LISTENERS DE LA PARTE INTERNA DEL MODULO DE RETIRAR
//LA NAVEGACION PARA ENTRAR Y SALIR ESTA EN EL ARCHIVO eventListenersGestionEstudiantes.js

import { BuscarEstudiantesParaRetirar, continuarRetirarEstudiantes, retirarEstudiantes } from "./retirar.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";
import { atrasPantallaConfirmarMesesDesactivar, atrasPantallaConsultaMesesRetirar, atrasRetirarEstudiantes, cabeceraTablaCheckbox, continuarMesesDesactivarSeleccionados, entrarRetirarEstudiante, marcarTodosLosMesesDesactivar } from "./controlesRetirarEstudiantes.js";

//NAVEGACION

document.getElementById("retirarEstudiante").addEventListener("click", entrarRetirarEstudiante);
document.getElementById("atrasRetirarEstudiantes").addEventListener("click", atrasRetirarEstudiantes);

//BOTONES

document.getElementById("BuscarEstudiantesRetirar").addEventListener("click", BuscarEstudiantesParaRetirar);
document.getElementById("retirarEstudiantes").addEventListener("click", continuarRetirarEstudiantes);

//PANTALLA MARCAR MESES DESACTIVAR

document.getElementById("atrasSeleccionarMesesDesactivar").addEventListener("click", atrasPantallaConsultaMesesRetirar);
document.getElementById("continuarDesactivarMeses").addEventListener("click", continuarMesesDesactivarSeleccionados);
document.getElementById("marcarTodosLosMesesDesactivar").addEventListener("change", marcarTodosLosMesesDesactivar);

//PANTALLA CONFIRMAR MESES

document.getElementById("atrasConfirmarMesesDesactivar").addEventListener("click", atrasPantallaConfirmarMesesDesactivar);
document.getElementById("desactivarMeses").addEventListener("click", retirarEstudiantes);

//CABECERA DE LA PRIMERA TABLA

document.getElementById("marcarTodosLosEstudiantesRetirar").addEventListener("change", cabeceraTablaCheckbox);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaRetirarEstudiantes").addEventListener("click", pegarContenidoPortapapeles);