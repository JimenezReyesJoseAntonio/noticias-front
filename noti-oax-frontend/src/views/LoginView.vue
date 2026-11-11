<template>
  <main class="login">
    <section class="login__tarjeta">
      <h1 class="login__titulo">Iniciar sesión</h1>
      <p class="login__subtitulo">Bienvenido a Noti-Oax</p>

      <form class="login__form" @submit.prevent="hacerLogin">
        <label class="login__label">Correo</label>
        <input v-model="correo" type="email" class="login__input" placeholder="tu@correo.com" required />

        <label class="login__label">Contraseña</label>
        <input v-model="password" type="password" class="login__input" placeholder="••••••••" required />

        <p v-if="error" class="login__error">{{ error }}</p>

        <button type="submit" class="login__boton login__boton--primario" :disabled="cargando">
          {{ cargando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="login__link">¿No tienes cuenta? <router-link to="/">Volver a noticias</router-link></p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const correo  = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)
const router = useRouter()

async function hacerLogin() {
  error.value = ''
  cargando.value = true
  try {
    const res = await api.post('/auth/login', { correo: correo.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.removeItem('rol')
    const rol = res.data.usuario?.rol || res.data.rol
    if (rol) localStorage.setItem('rol', rol)
    router.push('/')
  } catch (e) {
    error.value = 'Correo o contraseña incorrectos'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login { min-height: 70vh; display: flex; justify-content: center; align-items: center; padding: 24px; background: var(--color-fondo); }
.login__tarjeta { background: var(--color-blanco); width: 100%; max-width: 400px; padding: 32px; border-radius: 12px; }
.login__titulo { color: var(--color-primario); font-size: 26px; text-align: center; }
.login__subtitulo { color: #666; text-align: center; margin: 8px 0 24px; font-size: 14px; }
.login__form { display: flex; flex-direction: column; gap: 8px; }
.login__label { color: var(--color-primario); font-weight: bold; font-size: 14px; margin-top: 8px; }
.login__input { padding: 12px; border: 1px solid #C7D2D8; border-radius: 6px; font-size: 15px; outline: none; }
.login__input:focus { border-color: var(--color-verde-medio); }
.login__error { color: red; font-size: 13px; text-align: center; }
.login__boton { margin-top: 16px; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; }
.login__boton--primario { background: var(--color-verde-oscuro); color: white; }
.login__boton--primario:hover { background: var(--color-verde-medio); }
.login__link { text-align: center; margin-top: 16px; font-size: 13px; color: #666; }
</style>