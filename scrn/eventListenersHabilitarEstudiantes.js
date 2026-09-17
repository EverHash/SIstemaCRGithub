/*global document */

import {atrasHabilitarMensualidades, 
        atrasPantallaConfirmarMesesHabilitar, 
        atrasPantallaConsultaMesesHabilitar, 
        checkboxConsultarTodos, 
        continuarMesesDesactivarSeleccionados, 
        entrarHabilitarMensualides, 
        marcarTodosLosMesesHabilitar} from "./controlesHabilitarMensualidades.js";
import { buscarEstudiantesParaHabilitar, consultarEstudiantes, habilitarMensualidadesSeleccionadas } from "./habilitarMensualidades.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("habilitarMensualidades").addEventListener("click", entrarHabilitarMensualides);
document.getElementById("atrasHabilitarMensualidades").addEventListener("click", atrasHabilitarMensualidades);
document.getElementById("atrasSeleccionarMesesHabilitar").addEventListener("click", atrasPantallaConsultaMesesHabilitar);
document.getElementById("atrasConfirmarMesesHabilitar").addEventListener("click", atrasPantallaConfirmarMesesHabilitar);

//BOTONES

document.getElementById("buscarEstudiantesHabilitarMensualides").addEventListener("click", buscarEstudiantesParaHabilitar);
document.getElementById("botonHabilitarMensualidades").addEventListener("click", consultarEstudiantes);
document.getElementById("continuarHabilitarMeses").addEventListener("click", continuarMesesDesactivarSeleccionados);
document.getElementById("habilitarMeses").addEventListener("click", habilitarMensualidadesSeleccionadas);

//CHECKBOXES

document.getElementById("marcarTodosLosEstudiantesHabilitar").addEventListener("change", checkboxConsultarTodos);
document.getElementById("marcarTodosLosMesesHabilitar").addEventListener("change", marcarTodosLosMesesHabilitar);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaHabilitarMensualidades").addEventListener("click", pegarContenidoPortapapeles);