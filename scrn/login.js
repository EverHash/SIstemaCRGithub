/*global document, window, console, TextEncoder */

//MANO NO ENTIENDOOOOOOOOOOOOOOOO

import { Base, collection, deleteDoc, doc, getAuth, getDoc, getDocs, signInWithEmailAndPassword, signOut, updateDoc} from "./firebase.js";
import {mostrarPantallaCarga,
        ocultarPantallaCarga,
        mostrarPantallaError} from "../scrn/modal.js";

import { app } from "./firebase.js";

export {entrar, cerrarSesion};

export async function contarHashes(){

    let pagos = await getDocs(collection(Base, "hashesPagos"));

    let contador = 1;

    pagos.forEach(async function (pago){
        
      console.log(contador);

      contador++;

    });


}

const auth = getAuth(app);

window.onload = signOut(auth);

            //await updateDoc(representante, {["abonos" + objetoSubir[propiedad][0]]: objetoSubir[propiedad]});

async function entrar(){
    try {
      mostrarPantallaCarga();
      let usuario = document.getElementById("email").value;
      let contra = document.getElementById("password").value;
      usuario += "@gmail.com";
      let respuesta = await signInWithEmailAndPassword(auth, usuario, contra);
      document.getElementById("password").value = "";
      document.getElementById("email").value = "";

      internalLogin();
      ocultarPantallaCarga();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage);
      ocultarPantallaCarga();
      if(errorCode == "auth/internal-error"){
        mostrarPantallaError("Error del servidor de autenticación");
        return 0;
      } 
      if(errorCode == "auth/invalid-credential"){
        mostrarPantallaError("Usuario o contraseña invalidos");
        return 0;
      } 
      if(errorCode == "auth/invalid-email"){
        mostrarPantallaError("Usuario inválido");
        return 0;
      } 
      if(errorCode == "auth/invalid-password"){
        mostrarPantallaError("Contraseña inválida");
        return 0;
      } 
      else mostrarPantallaError("Error Inesperado");
    }
  }

  async function cerrarSesion(){
    try {
        mostrarPantallaCarga();
        await signOut(auth);
        internalLogOut();
        ocultarPantallaCarga();    
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError("Error Inesperado");
    }
  }

  function internalLogin(){
    document.getElementById("main-container-login").style.display = "none";
    document.getElementById("main-container-postLogin").style.display = "block";
}

function internalLogOut(){
    document.getElementById("main-container-postLogin").style.display = "none";
    document.getElementById("main-container-login").style.display = "block";
}

