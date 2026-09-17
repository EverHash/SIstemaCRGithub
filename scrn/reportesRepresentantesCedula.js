import { mediadorReportesCedula } from "./controlesReportesRepresentantesCedula.js";
import { Base, collection, getDocs, orderBy, query, where } from "./firebase.js"; 
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

const err = -10;

export class consultorBDreportesCedula{

    async obtenerReportes(cedula){

        try {

            mostrarPantallaCarga();

            let arrayReportes = [];

            let flagVacio = true;

            let coleccionEdiciones = await collection(Base, "reportesEdicion/");

            let obtenerReportesEdicion = await query(coleccionEdiciones, orderBy("numeroReporte", "desc"), where("cedulaRepresentante", "==", cedula));

            let documentosEdicion = await getDocs(obtenerReportesEdicion);
            documentosEdicion.forEach((documento) => {

                arrayReportes.push(documento.data());
                flagVacio = false;

            });
            
            if(flagVacio){

                ocultarPantallaCarga();
                mostrarPantallaError("No hay reportes para este representante");
                return err;

            }

            else return arrayReportes;

        } catch (error) {
            ocultarPantallaCarga();
            mostrarPantallaError(error);
            return err;
        }

    }

}

export async function consultarReportesCedula(){

    let mediador = new mediadorReportesCedula();

    let cedula = mediador.obtenerCedula();

    if(cedula == err) return;

    let reportes = await mediador.obtenerReportes(cedula);

    mediador.dibujarTablaReportes(reportes);

    ocultarPantallaCarga();

}

