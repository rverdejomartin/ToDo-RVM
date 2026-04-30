<script setup>
import { supabase } from '@/supabase';
import { getFirestore, doc, setDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { ref, computed } from 'vue';

const db = getFirestore();

const props = defineProps({ 
  thingsToDo: Array,
  completados: Array
});

const mostrarHistorial = ref(false);
const modalVisible = ref(false);
const modalEditar = ref(false);
const tareaSeleccionada = ref(null);
const nuevoNombre = ref('');
var bucket = "ToDo-RVM";

const tareasFiltradas = computed(() => {
  var lista = [];
  const fuente = mostrarHistorial.value ? props.completados : props.thingsToDo;
  if (fuente) {
    lista = [...fuente].sort((a, b) => {
            const orden = { HIGH: 0, NORMAL: 1, LOW: 2 };
            return orden[a.priority] - orden[b.priority];
        });
  }
  return lista;
});

const tareasPendientes = computed(() => {
    var resultado = { pendientes: 0, total: 0 };
    if (props.thingsToDo) {
        resultado = {
            pendientes: props.thingsToDo.length,
            total: props.thingsToDo.length
        }
    }
    return resultado;
});

function tiempoTranscurrido(fecha) {
    if (!fecha) return 'Recientemente';
    const ahora = new Date();
    const subida = fecha.toDate();
    const diferencia = Math.floor((ahora - subida) / 1000 / 60);
    var resultado = '';

    if (diferencia < 1) {
        resultado = 'Hace un momento';
    } else if (diferencia < 60) {
        resultado = `Hace ${diferencia} minutos`;
    } else if (diferencia < 1440) {
        const horas = Math.floor(diferencia / 60);
        resultado = `Hace ${horas} horas`;
    } else {
        const dias = Math.floor(diferencia / 1440);
        resultado = `Hace ${dias} días`;
    }

    return resultado;
}

function abrirModal(thing) {
    tareaSeleccionada.value = thing;
    modalVisible.value = true;
}

function cancelar() {
    modalVisible.value = false;
    tareaSeleccionada.value = null;
}

async function confirmar() {
  const { id, ...datos } = tareaSeleccionada.value;

    await addDoc(collection(db, 'completados'), {
        ...datos,
        completada: new Date()
    });

    await deleteDoc(doc(db, 'thingsToDo', id));

    modalVisible.value = false;
    tareaSeleccionada.value = null;
}

function abrirEditar(thing) {
    tareaSeleccionada.value = thing;
    nuevoNombre.value = thing.tarea;
    modalEditar.value = true;
}

function cancelarEditar() {
    modalEditar.value = false;
    tareaSeleccionada.value = null;
    nuevoNombre.value = '';
}

async function confirmarEditar() {
    if (nuevoNombre.value.trim()) {
        await setDoc(doc(db, 'thingsToDo', tareaSeleccionada.value.id), {
            tarea: nuevoNombre.value
        }, { merge: true });
        modalEditar.value = false;
        tareaSeleccionada.value = null;
        nuevoNombre.value = '';
    }
}

async function cambiarPrioridad(thing, nuevaPrioridad) {
    await setDoc(doc(db, 'thingsToDo', thing.id), {
        priority: nuevaPrioridad
    }, { merge: true });
}

async function borrarTarea(thing) {
  if (thing.imagenPath){
    await supabase.storage.from(bucket).remove([thing.imagenPath]);
  }

  await deleteDoc(doc(db, 'thingsToDo', thing.id))
}

</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <h2>{{ mostrarHistorial ? 'Historial' : 'Pendientes' }}</h2>
      <button @click="mostrarHistorial = !mostrarHistorial" class="btn-toggle">
        {{ mostrarHistorial ? 'Ver Pendientes' : 'Ver Historial' }}
      </button>
    </div>

    <p class="stats">{{ tareasPendientes.pendientes }} de {{ tareasPendientes.total }} tareas activas</p>

    <ul class="task-list">
      <TransitionGroup name="list">
        <li v-for="thing in tareasFiltradas" :key="thing.id" :class="['task-item', thing.priority]">
          <div class="task-main">
            <input type="checkbox" :checked="'completada' in thing" :disabled="'completada' in thing" @click="abrirModal(thing)" />
            <span class="task-text">{{ thing.tarea }}</span>
          </div>
          
          <div class="task-footer">
            <div class="footer-left">
              <span class="time">{{ tiempoTranscurrido(thing.subida) }}</span>
              
              <div class="priority-badges" v-if="!mostrarHistorial">
                <button 
                  v-for="p in ['LOW', 'NORMAL', 'HIGH']" 
                  :key="p"
                  :class="['badge', p, { active: thing.priority === p }]"
                  @click="cambiarPrioridad(thing, p)"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <div class="actions">
              <a v-if="thing.imagenUrl" :href="`${thing.imagenUrl}?download=`" download class="btn-icon btn-link">🖇️</a>
              <button @click="abrirEditar(thing)" class="btn-icon">✏️</button>
              <button @click="borrarTarea(thing)" class="btn-icon delete">🗑️</button>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </ul>

    <div v-if="modalVisible || modalEditar" class="modal-overlay">
      <div class="modal-card">
        <template v-if="modalVisible">
          <h3>¿Finalizar tarea?</h3>
          <div class="modal-actions">
            <button @click="confirmar" class="btn-confirm">Sí, completar</button>
            <button @click="cancelar" class="btn-cancel">No</button>
          </div>
        </template>
        <template v-if="modalEditar">
          <h3>Editar Tarea</h3>
          <input v-model="nuevoNombre" type="text" class="edit-input" @keyup.enter="confirmarEditar" />
          <div class="modal-actions">
            <button @click="confirmarEditar" class="btn-confirm">Guardar</button>
            <button @click="cancelarEditar" class="btn-cancel">Cancelar</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-container { width: 100%; }

.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.btn-toggle { background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.btn-toggle:hover { background: rgba(255,255,255,0.1); color: white; }

.stats { color: #38bdf8; font-size: 0.9rem; margin-bottom: 1.5rem; font-weight: 600; }

.task-list { list-style: none; display: flex; flex-direction: column; gap: 12px; padding: 0; position: relative; }

.task-item {
  background: #1e293b;
  padding: 1.2rem;
  border-radius: 16px;
  border-left: 6px solid #475569;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.task-item.HIGH { border-left-color: #f43f5e; }
.task-item.NORMAL { border-left-color: #f59e0b; }
.task-item.LOW { border-left-color: #10b981; }

.task-main { display: flex; align-items: center; gap: 12px; }
.task-text { font-weight: 600; font-size: 1.1rem; color: #f8fafc; }

.task-footer { display: flex; justify-content: space-between; align-items: center; }
.footer-left { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
.time { font-size: 0.75rem; color: #94a3b8; }

.priority-badges {
  display: flex;
  gap: 4px;
  background: rgba(15, 23, 42, 0.8);
  padding: 4px;
  border-radius: 8px;
}

.badge {
  font-size: 0.65rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-weight: 800;
  opacity: 0.5;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge:hover {
  opacity: 1;
  transform: translateY(-2px);
  color: white;
}

.badge.LOW:hover { box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); color: #10b981; }
.badge.NORMAL:hover { box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); color: #f59e0b; }
.badge.HIGH:hover { box-shadow: 0 0 12px rgba(244, 63, 94, 0.5); color: #f43f5e; }

.badge.active { opacity: 1; background: rgba(255, 255, 255, 0.1); }
.badge.LOW.active { color: #10b981; }
.badge.NORMAL.active { color: #f59e0b; }
.badge.HIGH.active { color: #f43f5e; }

/* ESTILOS DE BOTONES E ICONOS ACTUALIZADOS */
.btn-icon { 
  background: transparent; 
  padding: 6px; 
  font-size: 1.1rem; 
  border: none; 
  cursor: pointer; 
  opacity: 0.6; 
  transition: 0.2s;
  display: inline-flex;    /* Añadido para centrar emoji */
  align-items: center;     /* Añadido para centrar emoji */
  justify-content: center;  /* Añadido para centrar emoji */
  width: 32px;             /* Ancho fijo para que todos midan igual */
  height: 32px;            /* Alto fijo para que todos midan igual */
}

.btn-icon:hover { opacity: 1; transform: scale(1.2); }
.btn-icon.delete:hover { filter: drop-shadow(0 0 5px #f43f5e); color: #f43f5e; }

/* NUEVA CLASE PARA EL ENLACE <a> */
.btn-link {
  text-decoration: none;   /* Quita el subrayado azul */
  color: inherit;          /* Hereda el color del texto actual */
  line-height: 1;          /* Evita desalineación por altura de línea */
}

.list-enter-active,
.list-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-leave-active {
  position: absolute;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
  filter: blur(10px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
  filter: blur(5px);
}

.list-move {
  transition: transform 0.4s ease;
}

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { background: #1e293b; padding: 2rem; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; width: 90%; max-width: 400px; }
.btn-confirm { background: #38bdf8; color: #0f172a; flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; }
.btn-cancel { background: rgba(255, 255, 255, 0.05); color: white; flex: 1; padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); }
.edit-input { width: 100%; margin-top: 15px; background: #0f172a; border: 1px solid #38bdf8; color: white; padding: 12px; border-radius: 10px; outline: none; }

@media (max-width: 600px) {
  .task-footer { flex-direction: column; align-items: flex-start; gap: 15px; }
  .footer-left { width: 100%; justify-content: space-between; }
  .actions { width: 100%; display: flex; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 10px; }
}
</style>