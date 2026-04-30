<script setup>
//imports necesarios para la autenticacion
import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//importe de emailjs para los email al loguear
import emailjs from '@emailjs/browser';


const auth = getAuth();
const providerGo = new GoogleAuthProvider();
const providerGi = new GithubAuthProvider();
const router = useRouter();


var mail = ref("");
var contrasenia = ref("");
var registro = ref(false);
var error = ref("");

//funcion que alternará la vista, si de forulario de CREAR o el de registro normal
function toggleModo() {
    registro.value = !registro.value;
    error.value = "";
}

//para enviar el correo
const enviarNoti = (emailUsuario) => {
  const serviceID = 'service_ts54ec4';
  const templateID = 'template_oq72lhn';
  const publicKey = 'rKM53Hzh-CW3m229B';

  const templateParams = {
    user_email: emailUsuario,
    fecha: new Date().toLocaleString()
  };

  emailjs.send(serviceID, templateID, templateParams, publicKey)
    .then(() => console.log('Aviso enviado al usuario'))
    .catch((err) => console.error('Error al enviar:', err));
}

//funcion para el submit
function enviar() {
    if (registro.value) {
        createUserWithEmailAndPassword(auth, mail.value, contrasenia.value)
          .then((data) => {
            enviarNoti(data.user.email)
            mail.value = "";
            contrasenia.value = "";
            router.push('/recordatorios');
          })
          .catch((e) => {
            error.value = "Error al crear el usuario";
        })
    } else {
        signInWithEmailAndPassword(auth, mail.value, contrasenia.value)
          .then((data) => {
            enviarNoti(data.user.email)
            mail.value = "";
            contrasenia.value = "";
            router.push('/recordatorios')
          })
          .catch((e) => {
            error.value = "Credenciales incorrectas";
          })
    }
}

//registro de google
function logeoGoogle() {
    signInWithPopup(auth, providerGo)
      .then((data) => { 
        enviarNoti(data.user.email)
        router.push('/recordatorios')
      })
      .catch(() => {
        error.value = "Error de inicio de sesión con Google";
      })
}

//registro de github
function logeoGithub() {
    signInWithPopup(auth, providerGi)
      .then((data) => {
        enviarNoti(data.user.email)
        router.push('/recordatorios')
      })
      .catch(() => {
        error.value = "Error de inicio de sesión con Github"
      })
}
</script>


<template>
  <form @submit.prevent="enviar" class="login-form">

    <div v-if="!registro" class="form-content">
      <h2>Iniciar sesión</h2>
      
      <div class="input-group">
        <input v-model="mail" type="email" placeholder="Tu correo electrónico" required />
        <input v-model="contrasenia" type="password" placeholder="Tu contraseña" required />
      </div>
      
      <p v-if="error" class="error-msg">{{ error }}</p>
      
      <button type="submit" class="btn-main">Entrar</button>
      
      <div class="social-login">
        <button type="button" class="btn-google" @click="logeoGoogle">Google</button>
        <button type="button" class="btn-github" @click="logeoGithub">Github</button>
      </div>
      
      <p class="switch-mode">¿No tienes cuenta? <a @click="toggleModo">Regístrate aquí</a></p>
    </div>

    <div v-else class="form-content">
      <h2>Crear cuenta</h2>
      
      <div class="input-group">
        <input v-model="mail" type="email" placeholder="Tu correo electrónico" required />
        <input v-model="contrasenia" type="password" placeholder="Tu contraseña" required />
      </div>
      
      <p v-if="error" class="error-msg">{{ error }}</p>
      
      <button type="submit" class="btn-main">Registrarme</button>
      <p class="switch-mode">¿Ya tienes cuenta? <a @click="toggleModo">Inicia sesión aquí</a></p>
    </div>

  </form>
</template>

<style scoped>
h2 {
  color: white;
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s ease;
}

input:focus {
  border-color: var(--accent);
}

.btn-main {
  width: 100%;
  margin-bottom: 20px;
}

.social-login {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-google, .btn-github {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-google:hover, .btn-github:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.switch-mode {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.switch-mode a {
  color: var(--accent);
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 15px;
}
</style>