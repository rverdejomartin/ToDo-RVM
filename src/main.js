import { createApp } from 'vue'
import App from './App.vue'

import { initializeApp } from "firebase/app";
import { getAuth,  onAuthStateChanged } from 'firebase/auth';
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire';
import { createWebHistory, createRouter } from 'vue-router';

import LandingPage from './components/LandingPage.vue';
import UsuarioVIew from './components/UsuarioVIew.vue';
import AdminView from './components/AdminView.vue';

const firebaseConfig = {
    apiKey: "AIzaSyCLcwlGv83n2gRsdUed0MPbW7aIzIEOsRo",
    authDomain: "todo-rvm.firebaseapp.com",
    projectId: "todo-rvm",
    storageBucket: "todo-rvm.firebasestorage.app",
    messagingSenderId: "433207819026",
    appId: "1:433207819026:web:386af23db26cb47f7dd1cb",
    measurementId: "G-LZX6QS6746"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem('uid', user.uid);
    } else {
        localStorage.removeItem('uid');
    }
});

const ADMIN_UID = "E4zVfhN96lhTDfKjkkQNBzw7wxb2"; //CUENTA admin@admin.com contraseña Admin1234

const routes = [
    { path: '/', component: LandingPage },
    { path: '/recordatorios', component: UsuarioVIew, meta: { requiresAuth: true } },
    { path: '/admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from) => {
    const uid = localStorage.getItem('uid');

    if ((to.meta.requiresAuth && !uid) || (to.meta.requiresAdmin && uid !== ADMIN_UID)) {
        return '/';
    }
});

const app = createApp(App)
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireFirestoreOptionsAPI() //permite que el useCollection funcione en componentes diferentes y tol royo ese
    ]
})
app.use(router)
app.mount('#app')