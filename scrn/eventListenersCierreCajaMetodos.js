import {entrarCierreCajaMetodos,
        atrasCierreCajaMetodos, 
        seleccionarMesCierreCajaMetodos, 
        seleccionarAnnoCierreCaja
} from "./controlesCierreCajaMetodos.js";

import { determinarTipoCierre } from "./cierreCajaMetodos.js";

document.getElementById("CierreDeCajaMetodos").addEventListener("click", entrarCierreCajaMetodos); //ENTRAR AL MODULO
document.getElementById("atrasCierreCajaMetodos").addEventListener("click", atrasCierreCajaMetodos); //SALIR DEL MODULO

document.getElementById("SeleccionarAnnoMetodos").addEventListener("change", seleccionarAnnoCierreCaja); //CAMBIAR EL AÑO AL QUE SE VA A CONSULTAR
document.getElementById("SeleccionarMesMetodos").addEventListener("change", seleccionarMesCierreCajaMetodos); //SELECCIONAR EL MES EN CUESTION DEL QUE SE VA A CONSULTAR

document.getElementById("BotonCalcularCierreMetodos").addEventListener("click", determinarTipoCierre); //HACER EL CIERRE DE PAGO