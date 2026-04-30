<script setup>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { supabase } from '@/supabase';

const archivo = ref(null);
var errorSubida = false;
var bucket = "ToDo-RVM";
const db = getFirestore();
const auth = getAuth();
const tarea = ref('');
const prioridad = ref("NORMAL");


function adjuntarArchivo(e) {
  archivo.value = e.target.files[0];
}
//agregar un nuevo recordatorio
async function agregarRecordatorio() {
  if (archivo.value) {
    //subimos primero el archivo si existe
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(archivo.value.name, archivo.value);

    if (error) {
      console.log("Se ha producido un error: " + error);
      errorSubida = true;
    } else {
      console.log("Subido archivo con éxito");
      errorSubida = false;
    }
  }

  if (!archivo.value && tarea.value.trim()) {
    //sin archivo, se sube sin campo img
    await addDoc(collection(db, 'thingsToDo'), {
      tarea: tarea.value,
      priority: prioridad.value,
      subida: new Date(),
      idUser: auth.currentUser.uid
    });

  } else if (!errorSubida && tarea.value.trim()) {
    //con archivo y sin error, cogemos la url y ya se agrega el campo
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(archivo.value.name);

    await addDoc(collection(db, 'thingsToDo'), {
      tarea: tarea.value,
      priority: prioridad.value,
      subida: new Date(),
      idUser: auth.currentUser.uid,
      imagenUrl: data.publicUrl,
      imagenPath: archivo.value.name
    });
  }

  tarea.value = '';
  prioridad.value = 'NORMAL';
  archivo.value = null;
}



</script>


<template>
  <div class="add-box">
    <div class="form-row">
      <input v-model="tarea" type="text" placeholder="Nueva tarea..." @keydown.enter="agregarRecordatorio"/>
      <select v-model="prioridad">
        <option value="HIGH">Alta</option>
        <option value="NORMAL">Normal</option>
        <option value="LOW">Baja</option>
      </select>
      <input type="file" @change="adjuntarArchivo" accept=".png, .jpg, .jpeg"/>
      <button @click="agregarRecordatorio">Añadir</button>
    </div>
  </div>
</template>

<style scoped>
.add-box {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  border: 1px solid var(--glass-border);
}

.form-row {
  display: flex;
  gap: 12px;
}

input { flex: 3; }
select { flex: 1; }
button { background: var(--accent); color: var(--bg-dark); flex: 1; }

@media (max-width: 600px) {
  .form-row { flex-direction: column; }
  input, select, button { width: 100%; }
}
</style>