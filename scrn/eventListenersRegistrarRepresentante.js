/*global document */

import { atrasRegistrarRepresentante, entrarRegistrarRepresentante } from "./controlesRegistrarRepresentante.js";
import { registrarRepresentanteNuevoModulo } from "./registrarRepresentante.js";

//ENTRAR

document.getElementById("registroRepresentantes").addEventListener("click", entrarRegistrarRepresentante);

//SALIR 

document.getElementById("atrasRegistrarRepresentante").addEventListener("click", atrasRegistrarRepresentante);

//REGISTRAR

document.getElementById("registrarRepresentante").addEventListener("click", registrarRepresentanteNuevoModulo);