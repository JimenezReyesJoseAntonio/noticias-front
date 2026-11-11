<template>
  <div class="app">
    <header class="navbar">
      <router-link to="/" class="navbar__logo">Noti-Oax</router-link>
      <nav class="navbar__links">
        <router-link to="/" class="navbar__link">Inicio</router-link>
        <router-link v-if="!logueado" to="/login" class="navbar__link">Login</router-link>
        <button v-else @click="cerrarSesion" class="navbar__link navbar__link--boton">Cerrar sesión</button>
        <router-link v-if="logueado" to="/crear" class="navbar__link">Crear noticia</router-link>
        <router-link v-if="esAdmin" to="/usuarios/crear" class="navbar__link">Crear usuario</router-link>
      </nav>
    </header>

    <router-view />

    <footer class="footer">
      <p class="footer__texto">Noti-Oax • Noticias de Oaxaca</p>
      <p class="footer__texto">Oaxaca de Juárez, 2026</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const logueado = ref(!!localStorage.getItem('token'))
const esAdmin = ref(localStorage.getItem('rol') === 'admin')
const route = useRoute()
const router = useRouter()

watch(() => route.path, () => {
  logueado.value = !!localStorage.getItem('token')
  esAdmin.value = localStorage.getItem('rol') === 'admin'
})

function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('rol')
  logueado.value = false
  esAdmin.value = false
  router.push('/login')
}
</script>


<style>
.navbar { background: var(--color-primario); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.navbar__logo { color: var(--color-blanco); text-decoration: none; font-weight: bold; font-size: 22px; }
.navbar__links { display: flex; gap: 16px; align-items: center; }
.navbar__link { color: var(--color-fondo); text-decoration: none; background: none; border: none; cursor: pointer; font-size: 15px; }
.navbar__link:hover { color: var(--color-verde-claro); }
.navbar__link--boton { font-family: inherit; }
.footer { background: var(--color-primario); color: var(--color-fondo); padding: 24px; text-align: center; margin-top: 40px; }
</style>