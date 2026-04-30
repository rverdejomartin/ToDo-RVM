<script setup>
//importes de funcionalidades
import { ref } from 'vue';
//importes de componentes
import LoginForm from './LoginForm.vue';
var mostrarForm = ref(false);

function toogleMostrar() {
    if (mostrarForm.value == false) 
        mostrarForm.value = true;
    else
        mostrarForm.value = false;
}
</script>


<template>
  <div class="landing-wrapper">
    <div class="video-background">
      <iframe src="https://www.youtube.com/embed/jyKja2vcpQo?autoplay=1&mute=1&loop=1&playlist=jyKja2vcpQo&controls=0" frameborder="0" allow="autoplay"></iframe>
      <div class="overlay"></div>
    </div>

    <div class="content-area">
      <div v-if="!mostrarForm" class="glass-card">
        <h1>Lista de recordatorios</h1>
        <p>Organiza tus tareas con una herramienta potente y minimalista. Mantén el control de tus pendientes con estilo.</p>
        <button class="btn-primary" @click="toogleMostrar">Empezar ahora</button>
      </div>

      <div v-else class="glass-card">
        <LoginForm />
        <button class="btn-ghost" @click="toogleMostrar">← Volver</button>
      </div>
    </div>

    <div class="personal-information">
      
    </div>
  </div>
</template>

<style scoped>
.landing-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-background {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: -1;
  filter: brightness(0.4) blur(3px);
}

.video-background iframe {
  width: 100vw; height: 56.25vw;
  min-height: 100vh; min-width: 177.78vh;
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle, transparent 0%, var(--bg-dark) 100%);
}

.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 32px;
  border: 1px solid var(--glass-border);
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

h1 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent); }
p { color: var(--text-dim); margin-bottom: 2rem; }

.btn-primary { background: var(--accent); color: var(--bg-dark); width: 100%; font-size: 1.1rem; }
.btn-ghost { background: transparent; color: var(--text-dim); margin-top: 1rem; }

@media (max-width: 600px) {
  .glass-card { padding: 2rem 1.5rem; }
  h1 { font-size: 1.8rem; }
}
</style>