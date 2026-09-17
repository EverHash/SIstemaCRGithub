/*global document, console */

import { escribirFormularioDigitalRepresentanteActualizar, limpiarFormulariosActualizar, escribirFormularioDigitalEstudianteActualizar, acomodarArrayListaEstudiantesActualizar } from "./controlesActualizarDatos.js";
import { mostrarPantallaError, ocultarPantallaCarga, mostrarPantallaCarga, mostrarPantallaExito } from "./modal.js";
import { getDoc, doc, Base, getDocs, collection, updateDoc, deleteDoc, setDoc } from "./firebase.js";
import { estudianteRepresentante, estudiante, representante } from "./objetos.js";
import { eliminadorDeMetodos } from "./utilidades.js";

export { obtenerDatosActualizar, actualizarDatos };

let cedulaRepresentanteActualizarDatos;
let arrayEstudiantesActualizar = [];
let objetoRepresentante;


async function obtenerDatosActualizar(){
    cedulaRepresentanteActualizarDatos = document.getElementById("cedulaRepresentanteActualizarDatos").value;
    limpiarFormulariosActualizar();
    arrayEstudiantesActualizar = [];
    try {
        mostrarPantallaCarga();
        let cedulaRepresentante;
        let datosRepresentante = await getDoc(doc(Base, "representantes", cedulaRepresentanteActualizarDatos));
        cedulaRepresentante = cedulaRepresentanteActualizarDatos;
        if(!datosRepresentante.exists()){
          ocultarPantallaCarga();
          mostrarPantallaError("El representante no está registrado en la base de datos");
          return 0;
        }
        let estudiantesRepresentados = await getDocs(collection(Base, "representantes/"+ cedulaRepresentante +"/estudiantes"));
        objetoRepresentante = eliminadorDeMetodos(datosRepresentante.data());
        cedulaRepresentanteActualizarDatos = cedulaRepresentante;
        let objetoEstudiante;
        let i = 1;
        let flag = true;
        escribirFormularioDigitalRepresentanteActualizar(objetoRepresentante);
        estudiantesRepresentados.forEach(estudiante =>{
          i++;
        });
        if(i == 1){
          ocultarPantallaCarga();
          mostrarPantallaError("El representante no tiene estudiantes inscritos...");
          return 0;
        }
        i = 1;
        document.getElementById("contenedorActualizarDatos").removeChild(document.getElementById("contenedorActualizarDatos").children[1]);
        estudiantesRepresentados.forEach(estudiante =>{
          objetoEstudiante = eliminadorDeMetodos(estudiante.data());
          arrayEstudiantesActualizar.push(objetoEstudiante);
          escribirFormularioDigitalEstudianteActualizar(objetoEstudiante, i, flag);
          flag = false;
          i++;
        });
        acomodarArrayListaEstudiantesActualizar();
        ocultarPantallaCarga();
    } catch (error) {
        console.log("Error al obtener datos: ", error);
        ocultarPantallaCarga();
        mostrarPantallaError("Error Inesperado");
    }
}

function estudianteRepresentanteaEstudiante(estudianteRepre, cedulaRepresentante, nombreRepresentante){
  let resultado ={
    nombres: estudianteRepre.nombres,
    apellidos: estudianteRepre.apellidos,
    direccion: estudianteRepre.direccion,
    cedula: estudianteRepre.cedula,
    sexo: estudianteRepre.sexo,
    cedulaRepresentante: cedulaRepresentante,
    nombreRepresentante: nombreRepresentante,
    tipoRepresentante: estudianteRepre.tipoRepresentante,
    fechaNacimiento: estudianteRepre.fechaNacimiento,
    lugarNacimiento: estudianteRepre.lugarNacimiento,
    estado: estudianteRepre.estado,
    pago09Septiembre: estudianteRepre.pago09Septiembre,
    pago10Octubre: estudianteRepre.pago10Octubre,
    pago11Noviembre: estudianteRepre.pago11Noviembre,
    pago12Diciembre: estudianteRepre.pago12Diciembre,
    pago13Enero: estudianteRepre.pago13Enero,
    pago14Febrero: estudianteRepre.pago14Febrero,
    pago15Marzo: estudianteRepre.pago15Marzo,
    pago16Abril: estudianteRepre.pago16Abril,
    pago17Mayo: estudianteRepre.pago17Mayo,
    pago18Junio: estudianteRepre.pago18Junio,
    pago19Julio: estudianteRepre.pago19Julio,
    pago20Agosto: estudianteRepre.pago20Agosto,
  };
  return resultado;
}

async function actualizarDatos() {
    try {
        mostrarPantallaCarga();
        let formularios = document.getElementsByClassName("subcajaFormularioActualizarDerecha");
        let estudianteSubir, estudianteRepreSubir, repreSubir;
        let j = 0;

        //CREACIÓN DE OBJETOS

        const repre = new representante();
        repre.obtenerDatosRepresentante(formularios);

        await deleteDoc(doc(Base, "representantes/", objetoRepresentante.cedula));


        //BUCLE DE ELIMINACION DE LA BASE
      
        for(let i = 1; i <= formularios.length - 1; i++){
            
          j = i - 1;
        

          await deleteDoc(doc(Base, "estudiantes/" + arrayEstudiantesActualizar[j].grado + "/" 
                              + arrayEstudiantesActualizar[j].curso + " " 
                              + arrayEstudiantesActualizar[j].seccion,         
                              arrayEstudiantesActualizar[j].cedula));  
          
          await deleteDoc(doc(Base, "representantes/" + objetoRepresentante.cedula + "/estudiantes/", arrayEstudiantesActualizar[j].cedula));  
        }



          for(let i = 1; i <= formularios.length - 1; i++){
            
            j = i - 1;
          
            arrayEstudiantesActualizar[j].nombres = formularios[i].children[0].value;
            arrayEstudiantesActualizar[j].apellidos = formularios[i].children[1].value;
            arrayEstudiantesActualizar[j].cedula = formularios[i].children[2].value;
            arrayEstudiantesActualizar[j].sexo = formularios[i].children[3].options[formularios[i].children[3].selectedIndex].textContent;
            arrayEstudiantesActualizar[j].grado = formularios[i].children[4].options[formularios[i].children[4].selectedIndex].textContent;
            arrayEstudiantesActualizar[j].curso = formularios[i].children[5].options[formularios[i].children[5].selectedIndex].textContent;
            arrayEstudiantesActualizar[j].seccion = formularios[i].children[6].options[formularios[i].children[6].selectedIndex].textContent;
            arrayEstudiantesActualizar[j].fechaNacimiento = formularios[i].children[7].value;
            arrayEstudiantesActualizar[j].lugarNacimiento = formularios[i].children[8].value;
            arrayEstudiantesActualizar[j].estado = formularios[i].children[9].options[formularios[i].children[9].selectedIndex].textContent;
            arrayEstudiantesActualizar[j].direccion = formularios[i].children[10].value;

            estudianteSubir = estudianteRepresentanteaEstudiante(arrayEstudiantesActualizar[j], repre.cedula, repre.nombres + " " + repre.apellidos);
            console.log(estudianteSubir);
            await setDoc(doc(Base, "estudiantes/" + arrayEstudiantesActualizar[j].grado + "/" 
                                + arrayEstudiantesActualizar[j].curso + " " 
                                + arrayEstudiantesActualizar[j].seccion, 
                                arrayEstudiantesActualizar[j].cedula), estudianteSubir);    
            await setDoc(doc(Base, "representantes/"+ repre.cedula 
                                +"/estudiantes/" + arrayEstudiantesActualizar[j].cedula), arrayEstudiantesActualizar[j]);    
          }
          repreSubir = eliminadorDeMetodos(repre);
          await setDoc(doc(Base, "representantes/"+ repre.cedula), repreSubir);  
          ocultarPantallaCarga();
          mostrarPantallaExito("Éxito al actualizar!");
      } 
      catch (error) {
        console.log("Error al inscribir", error);
        ocultarPantallaCarga();
        mostrarPantallaError("Error Inesperado...");
      }
}