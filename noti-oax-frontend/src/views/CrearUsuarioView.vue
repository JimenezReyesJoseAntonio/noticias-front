<template>
  <main class="crear-usuario">
    <section class="crear-usuario__tarjeta">
      <h1 class="crear-usuario__titulo">Crear usuario</h1>
      <p class="crear-usuario__subtitulo">La cuenta se creará con permisos de usuario.</p>

      <form class="crear-usuario__form" @submit.prevent="crearUsuario">
        <label class="crear-usuario__label" for="nombre">Nombre</label>
        <input
          id="nombre"
          v-model.trim="form.nombre"
          class="crear-usuario__input"
          type="text"
          maxlength="100"
          autocomplete="name"
          required
        />

        <label class="crear-usuario__label" for="correo">Correo</label>
        <input
          id="correo"
          v-model.trim="form.correo"
          class="crear-usuario__input"
          type="email"
          maxlength="100"
          autocomplete="email"
          required
        />

        <label class="crear-usuario__label" for="password">Contraseña inicial</label>
        <input
          id="password"
          v-model="form.password"
          class="crear-usuario__input"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        />

        <p v-if="mensaje" class="crear-usuario__mensaje">{{ mensaje }}</p>
        <p v-if="error" class="crear-usuario__error">{{ error }}</p>

        <button class="crear-usuario__boton" type="submit" :disabled="cargando">
          {{ cargando ? 'Creando...' : 'Crear usuario' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const form = ref({ nombre: '', correo: '', password: '' })
const mensaje = ref('')
const error = ref('')
const cargando = ref(false)
const router = useRouter()

async function crearUsuario() {
  mensaje.value = ''
  error.value = ''
  cargando.value = true

  try {
    await api.post('/usuarios', form.value)
    mensaje.value = 'Usuario creado correctamente.'
    form.value = { nombre: '', correo: '', password: '' }
    setTimeout(() => router.push('/'), 1000)
  } catch (e) {
    if (e.response?.status === 409) {
      error.value = 'Ya existe una cuenta con ese correo.'
    } else {
      error.value = e.response?.data?.mensaje || 'No se pudo crear el usuario.'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.crear-usuario { min-height: 70vh; display: flex; justify-content: center; padding: 24px; background: var(--color-fondo); }
.crear-usuario__tarjeta { align-self: flex-start; background: var(--color-blanco); width: 100%; max-width: 500px; padding: 32px; border-radius: 12px; }
.crear-usuario__titulo { color: var(--color-primario); margin-bottom: 8px; text-align: center; }
.crear-usuario__subtitulo { color: #666; text-align: center; margin-bottom: 20px; font-size: 14px; }
.crear-usuario__form { display: flex; flex-direction: column; gap: 8px; }
.crear-usuario__label { color: var(--color-primario); font-weight: bold; font-size: 14px; margin-top: 8px; }
.crear-usuario__input { padding: 12px; border: 1px solid #C7D2D8; border-radius: 6px; font-size: 15px; }
.crear-usuario__input:focus { outline: 2px solid var(--color-verde-medio); outline-offset: 1px; }
.crear-usuario__boton { margin-top: 16px; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; background: var(--color-verde-oscuro); color: white; }
.crear-usuario__boton:hover:enabled { background: var(--color-verde-medio); }
.crear-usuario__boton:disabled { opacity: 0.65; cursor: wait; }
.crear-usuario__mensaje { color: var(--color-verde-oscuro); text-align: center; }
.crear-usuario__error { color: #c0392b; text-align: center; }
</style>
