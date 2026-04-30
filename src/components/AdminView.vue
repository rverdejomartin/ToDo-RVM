<script setup>
import { ref, computed } from 'vue';
import { useCollection } from 'vuefire';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router'
import ListaRecordatorios from './ListaRecordatorios.vue';

const router = useRouter();
const db = getFirestore();
const auth = getAuth();

const thingsToDo = useCollection(collection(db, 'thingsToDo'));
const completados = useCollection(collection(db, "completados"));
const mostrarHistorial = ref(false); 

const tareasPendientes = computed(() => {
    if (!thingsToDo.value) return { total: 0, pendientes: 0 };
    return {
        total: thingsToDo.value.length,
        pendientes: thingsToDo.value.filter(t => !t.realizado).length
    };
});

//para sacar la foto y el nombre
const usuarioInfo = computed(() => {
    const user = auth.currentUser;
    return {
        nombre: user.displayName || user.email,
        foto: user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    };
});

function borrarSesion() {
    signOut(auth).then(() => {
        router.push('/');
    })
}

function volverUsuario() {
    router.push('/recordatorios');
}
</script>

<template>
  <div class="dashboard-container">
    <header class="top-nav">
      <div class="left-side">
        <div class="admin-brand">
          <span class="badge-admin">ADMIN PANEL</span>
        </div>
      </div>
      
      <div class="right-side">
        <div v-if="usuarioInfo" class="user-profile">
            <span class="user-text">{{ usuarioInfo.nombre }}</span>
            <img :src="usuarioInfo.foto" alt="perfil" class="user-img" />
        </div>

        <div class="nav-btns">
          <button @click="volverUsuario" class="btn-nav">Ver mis tareas</button>
          <button @click="borrarSesion" class="btn-danger">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="content-body">
      <ListaRecordatorios :thingsToDo="thingsToDo" :completados="completados"/>
    </main>
  </div>
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.right-side {
  display: flex;
  align-items: center;
  gap: 25px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
  border-radius: 50px;
  transition: 0.3s;
}

.user-text {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.user-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(56, 189, 248, 0.5);
}

.nav-btns {
  display: flex;
  gap: 12px;
}

.badge-admin {
  background: #f43f5e;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
}

.btn-nav {
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
}

.btn-danger {
  background: rgba(244, 63, 94, 0.15);
  color: #fb7185;
  border: 1px solid rgba(244, 63, 94, 0.3);
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
}

.view-title h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stats {
  color: #38bdf8;
  font-size: 1rem;
  font-weight: 600;
}

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-filter {
  background: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid transparent;
}

@media (max-width: 800px) {
  .right-side {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .top-nav {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  .right-side {
      align-items: center;
      width: 100%;
  }
  .nav-btns {
    width: 100%;
  }
  .nav-btns button {
    flex: 1;
  }
}
</style>