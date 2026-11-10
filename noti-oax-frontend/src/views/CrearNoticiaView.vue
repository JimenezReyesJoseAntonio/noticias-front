<template>
  <main class="crear">
    <section class="crear__tarjeta">
      <h1 class="crear__titulo">Crear noticia</h1>
      <form class="crear__form" @submit.prevent="crear">
        <label>Imagen</label>
        <input type="file" accept="image/*" @change="subirImagen" />
        <img v-if="form.imagen" :src="getUrlImagen(form.imagen)" style="width:100%; max-height:200px; object-fit:cover; margin-top:8px; border-radius:8px;" />
        <p v-if="subiendo">Subiendo...</p>

        <label class="crear__label">Título</label>
        <input v-model="form.titulo" class="crear__input" required />

        <label class="crear__label">Resumen</label>
        <input v-model="form.resumen" class="crear__input" required />

        <label class="crear__label">Contenido</label>
        <textarea v-model="form.contenido" class="crear__input crear__input--area" rows="5" required></textarea>

        <label class="crear__label">Categoría (ID)</label>
        <input v-model.number="form.id_categoria" type="number" class="crear__input" required />

        <label class="crear__check"><input type="checkbox" v-model="form.destacada" /> Destacada</label>

        <p v-if="mensaje" class="crear__exito">{{ mensaje }}</p>
        <p v-if="error" class="crear__error">{{ error }}</p>

        <button class="crear__boton crear__boton--primario">Publicar</button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const form = ref({ titulo: '', resumen: '', contenido: '', id_categoria: 1, destacada: false })
const mensaje = ref('')
const error = ref('')
const router = useRouter()
const subiendo = ref(false)

const getUrlImagen = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

async function subirImagen(e) {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('imagen', file)
  subiendo.value = true
  try {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.imagen = res.data.url 
  } catch (err) {
    alert('Error al subir imagen')
    console.log(err)
  } finally {
    subiendo.value = false
  }
}

async function crear() {
  try {
    await api.post('/noticias', form.value)
    mensaje.value = 'Noticia creada'
    setTimeout(() => router.push('/'), 800)
  } catch { error.value = 'No se pudo crear, ¿estás logueado?' }
}
</script>

<style scoped>
.crear { min-height: 70vh; display: flex; justify-content: center; padding: 24px; background: var(--color-fondo); }
.crear__tarjeta { background: var(--color-blanco); width: 100%; max-width: 600px; padding: 32px; border-radius: 12px; }
.crear__titulo { color: var(--color-primario); margin-bottom: 20px; text-align: center; }
.crear__form { display: flex; flex-direction: column; gap: 8px; }
.crear__label { color: var(--color-primario); font-weight: bold; font-size: 14px; margin-top: 8px; }
.crear__input { padding: 12px; border: 1px solid #C7D2D8; border-radius: 6px; font-size: 15px; }
.crear__input--area { resize: vertical; }
.crear__check { font-size: 14px; margin: 8px 0; display: flex; gap: 8px; align-items: center; }
.crear__boton { padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
.crear__boton--primario { background: var(--color-verde-oscuro); color: white; }
.crear__boton--primario:hover { background: var(--color-verde-medio); }
.crear__exito { color: var(--color-verde-oscuro); text-align: center; }
.crear__error { color: red; text-align: center; }
</style>