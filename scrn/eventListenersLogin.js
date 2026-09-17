/*global document */

//LOGIN

//import { dibujarContratoPares } from "./controlesConvenioPagos.js";
import {entrar, cerrarSesion} from "./login.js";

document.getElementById("iniciarSesion").addEventListener("click", entrar);
document.getElementById("cerrarSesion").addEventListener("click", cerrarSesion);

//document.getElementById("testFunction").addEventListener("click", dibujarContratoPares);

//NAVEGACION GENERAL

/*

    //ESTO ERA LO QUE ESTABA EN LOS MODULOS

        <script type="module" src="firebase.js"></script>
        <script type="module" src="login.js"></script>
        <script type="module" src="InternalProcedures.js"></script>
*/