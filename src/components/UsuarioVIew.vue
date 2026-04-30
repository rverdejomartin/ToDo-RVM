<script setup>
import { computed } from 'vue'; // Importamos computed
import { useCollection } from 'vuefire';
import { getFirestore, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router'
import ListaRecordatorios from './ListaRecordatorios.vue';
import AddRecordatorio from './AddRecordatorio.vue';

const router = useRouter();
const db = getFirestore();
const auth = getAuth();
const uid = localStorage.getItem('uid');
const ADMIN_UID = "E4zVfhN96lhTDfKjkkQNBzw7wxb2";

const q = query(collection(db, 'thingsToDo'), where('idUser', '==', uid));
const thingsToDo = useCollection(q);

//lo de el historial
const qCompletados = query(collection(db, 'completados'), where('idUser', '==', uid));
const completados = useCollection(qCompletados);


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

function vaciar() {
  for (const tarea of thingsToDo.value) {
    deleteDoc(doc(db, "thingsToDo", tarea.id))
  }
}

function irAdmin() {
    router.push('/admin');
}
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Mis Recordatorios</h1>
      
      <div class="header-right">
        <div v-if="usuarioInfo" class="user-profile">
            <span class="user-text">{{ usuarioInfo.nombre }}</span>
            <img :src="usuarioInfo.foto" alt="perfil" class="user-img" />
        </div>

        <div class="header-actions">
          <button @click="vaciar" class="btn-vaciar">
            🗑️ Vaciar
          </button>

          <button v-if="uid === ADMIN_UID" @click="irAdmin" class="btn-admin-access">
            ⚙️ Panel Admin
          </button>
          <button @click="borrarSesion" class="btn-danger-outline">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main>
      <AddRecordatorio />
      <ListaRecordatorios :thingsToDo="thingsToDo" :completados="completados"/>
    </main>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ESTILOS PERFIL */
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-text {
  color: var(--text-dim, #94a3b8);
  font-size: 0.9rem;
}

.user-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-normal, #42b883);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-admin-access {
  background: #1e293b;
  border: 1px solid var(--accent-normal);
  color: var(--accent-normal);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-admin-access:hover {
  background: var(--accent-normal);
  color: var(--bg-dark);
}

.btn-danger-outline {
  background: transparent;
  border: 1px solid #475569;
  color: var(--text-dim);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-vaciar {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-vaciar:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: #fbbf24;
}

.header-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 850px) {
  .header-right {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .dashboard-header { 
    flex-direction: column; 
    align-items: flex-start;
    gap: 20px; 
  }
  .header-right {
    width: 100%;
    align-items: center;
  }
  .header-actions {
    width: 100%;
  }
  .header-actions button {
    flex: 1;
  }
}
</style>