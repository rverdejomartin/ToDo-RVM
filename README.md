# ToDo-RVM

**ToDo-RVM** es una aplicación moderna de gestión de tareas diseñada bajo el concepto de **Single Page Application (SPA)**. Este proyecto demuestra la integración de dos potentes plataformas de backend (Firebase y Supabase) para ofrecer una experiencia de usuario fluida y robusta.

## 🚀 Tecnologías Utilizadas

La aplicación aprovecha lo mejor de cada ecosistema:

* **Vue.js:** Framework principal para la interfaz de usuario, gestionando la lógica de la SPA y la reactividad de los componentes.
* **Firebase:**
    * **Authentication:** Gestión de acceso y seguridad de usuarios.
    * **Firestore:** Base de datos NoSQL en tiempo real para el almacenamiento de recordatorios e historial.
    * **Hosting:** Despliegue de la aplicación en la nube.
* **Supabase:**
    * **Storage:** Servicio encargado del manejo de archivos y recursos multimedia.

---

## 🛠️ Funcionalidades Principales

Para interactuar con la aplicación, el usuario debe **autenticarse** (Log-in). Una vez dentro, dispone de las siguientes capacidades:

### 1. Gestión de Recordatorios
* **Agregar:** Crea nuevos recordatorios que se sincronizan instantáneamente con Firestore.
* **Eliminar:** Borra elementos específicos de la lista actual.
* **Vaciar Lista:** Opción para limpiar todos los recordatorios activos de una sola vez.

### 2. Sistema de "Realizados" e Historial
A diferencia de un borrado común, marcar una tarea como realizada activa un flujo de datos:
1.  El recordatorio se **elimina** de la vista principal y de la colección de "tareas pendientes" en la base de datos.
2.  Automáticamente, se **agrega a una nueva colección** de historial en la DB.
3.  El registro aparece inmediatamente en la **Vista de Historial**, manteniendo un seguimiento de la productividad del usuario.

---

## 🏗️ Arquitectura (SPA)

Al ser una **SPA**, ToDo-RVM no recarga el navegador al navegar entre la lista de tareas y el historial. Vue se encarga de cambiar los componentes dinámicamente, mientras que la integración con Firebase garantiza que los datos se mantengan actualizados sin necesidad de refrescar la página manualmente.

---

## 📝 Instalación y Configuración

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura tus variables de entorno con las credenciales de Firebase y Supabase.
4.  Ejecuta el proyecto en local:
    ```bash
    npm run serve
    ```
