/*global document */

import { asignarDatosRepresentanteEnInterfaz, cerrarModalBorrarContenedor, cerrarModalEditarAbonos, construirObjetoRepresentanteCompleto, construirObjetoRepresentanteSinAbonos, copiarTablaAbonosNoEditada, copiarTablaParaComprobar, determinarCambiosTabla, flagHuboCambiosContenedores, abonoBorrado, listaCambios, nombreContenedorBorrar, obtenerDatosPropiedadDeFila, obtenerNombrePropiedadDeFila, representanteNoExiste } from "./controlesEdicionAbonos.js";
import { Base, doc, getDoc, setDoc, updateDoc } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, mostrarPantallaExito, ocultarPantallaCarga } from "./modal.js";
import { documentoReporte } from "./objetos.js";
import { eliminadorDeMetodos, fechaDeHoy } from "./utilidades.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

let cedulaParaProcesos;

let copiaRepresentante;

let copiaRepresentanteCompleto;

export async function consultarRepresentante(){

    try {
        
        copiaRepresentante = {};

        mostrarPantallaCarga();

        limpiarFilasTabla("tablaEditarAbonosRepresentante", 1);

        cedulaParaProcesos = document.getElementById("cedulaRepresentanteEdicionAbonos").value;

        let representante = await getDoc(doc(Base, "representantes", cedulaParaProcesos));

        if(representanteNoExiste(representante)) return;

        copiaRepresentante = construirObjetoRepresentanteSinAbonos(representante.data());

        copiaRepresentanteCompleto = construirObjetoRepresentanteCompleto(representante.data());

        asignarDatosRepresentanteEnInterfaz(representante.data());

        copiarTablaAbonosNoEditada();

        ocultarPantallaCarga();

    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }

}

export async function editarAbonos(){
    try {

        cerrarModalEditarAbonos();

        mostrarPantallaCarga();

        let tabla = document.getElementById("tablaEditarAbonosRepresentante");

        let nombrePropiedad = "";

        for(let i = 1; i <= tabla.rows.length - 1; i++){

            nombrePropiedad = obtenerNombrePropiedadDeFila(i);

            copiaRepresentante[nombrePropiedad] = obtenerDatosPropiedadDeFila(i);

        }

        await setDoc(doc(Base, "representantes/", cedulaParaProcesos), copiaRepresentante);
    
        document.getElementById("cedulaRepresentanteEdicionAbonos").value = cedulaParaProcesos;

        await subirReporteEdicionRegular();

        await consultarRepresentante();

        mostrarPantallaExito("Abonos Editados!");
        
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }
    
}

export async function eliminarAbono(){
    
    try {
        cerrarModalBorrarContenedor();
        
        mostrarPantallaCarga();
    
        let representanteSubir = {};
    
        //INSERTAR TODOS LOS CONTENEDORES QUE EXISTAN EXCEPTO AL QUE SE BORRA
    
        for(let propiedad in copiaRepresentanteCompleto){
    
            if(propiedad.includes(nombreContenedorBorrar)) continue;
    
            representanteSubir[propiedad] = copiaRepresentanteCompleto[propiedad];
    
        }
    
        await setDoc(doc(Base, "representantes/", cedulaParaProcesos), representanteSubir);
        
        document.getElementById("cedulaRepresentanteEdicionAbonos").value = cedulaParaProcesos;
    
        await consultarRepresentante();
    
        await subirReporteBorrarContenedor(abonoBorrado);
    
        ocultarPantallaCarga();
        
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }


}

async function subirReporteEdicionRegular(){
    
    try {
        let obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportes");
        let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
        let IdReporteObtener = numeroDeReporte.data();
        let IdReporte = IdReporteObtener.numero + 1;
    
        let nombreRepresentante = copiaRepresentanteCompleto.nombres + " " + copiaRepresentanteCompleto.apellidos;
    
        let fecha = fechaDeHoy();
    
        const reporte = new documentoReporte(IdReporte, nombreRepresentante, 
                                             "Abono", cedulaParaProcesos, fecha);
    
        reporte.insertarCambiosAbonos(listaCambios);
    
        let reporteSubir = eliminadorDeMetodos(reporte);
    
        await setDoc(doc(Base, "reportesEdicion/" + IdReporte), reporteSubir);
        await updateDoc(obtenerNumeroDeReporte, {numero: IdReporte}); 
        
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }

}

async function subirReporteBorrarContenedor(abonoBorrado){

    try {
        let obtenerNumeroDeReporte = await doc(Base, "variables", "numeroReportes");
        let numeroDeReporte = await getDoc(obtenerNumeroDeReporte);
        let IdReporteObtener = numeroDeReporte.data();
        let IdReporte = IdReporteObtener.numero + 1;
    
        let nombreRepresentante = copiaRepresentanteCompleto.nombres + " " + copiaRepresentanteCompleto.apellidos;
    
        let fecha = fechaDeHoy();
    
        const reporte = new documentoReporte(IdReporte, nombreRepresentante, 
                                             "Abono", cedulaParaProcesos, fecha);
    
        reporte.insertarAbonoBorrado(abonoBorrado);
    
        let reporteSubir = eliminadorDeMetodos(reporte);
    
        await setDoc(doc(Base, "reportesEdicion/" + IdReporte), reporteSubir);
        await updateDoc(obtenerNumeroDeReporte, {numero: IdReporte});
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }


}