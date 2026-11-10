<template>
  <main class="crear">
    <section class="crear__tarjeta">
      <h1 class="crear__titulo">Editar noticia</h1>
      <form class="crear__form" @submit.prevent="guardar">
        <label>Imagen actual</label>
        <img v-if="form.imagen" :src="getUrlImagen(form.imagen)" style="width:100%; max-height:200px; object-fit:cover; border-radius:8px;" />
        <label>Cambiar imagen</label>
        <input type="file" accept="image/*" @change="subirImagen" />
        <p v-if="subiendo">Subiendo...</p>
        <label class="crear__label">Título</label>
        <input v-model="form.titulo" class="crear__input" required />
        <label class="crear__label">Resumen</label>
        <input v-model="form.resumen" class="crear__input" required />
        <label class="crear__label">Contenido</label>
        <textarea v-model="form.contenido" class="crear__input crear__input--area" rows="5" required></textarea>
        <label class="crear__label">Categoría</label>
        <select v-model="form.id_categoria" class="crear__input" required>
         <option value="" disabled>Selecciona una categoría</option>
         <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
         {{ cat.nombre }}
         </option>
        </select>
        <label class="crear__check"><input type="checkbox" v-model="form.destacada" /> Destacada</label>
        <p v-if="mensaje" class="crear__exito">{{ mensaje }}</p>
        <button class="crear__boton crear__boton--primario">Guardar cambios</button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const categorias = ref([
  { id: 1, nombre: 'Local' },
  { id: 2, nombre: 'Deportes' },
  { id: 3, nombre: 'Cultura' }
])

const form = ref({ titulo:'', resumen:'', contenido:'', imagen:'', id_categoria:'' })
const mensaje = ref('')
const route = useRoute()
const router = useRouter()
const subiendo = ref(false)

const getUrlImagen = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

onMounted(async () => {
  const res = await api.get('/noticias')
  const lista = res.data.noticias || res.data
  const n = lista.find(x => String(x.id_noticia || x.id) === String(route.params.id))
  if (n) form.value = { titulo: n.titulo, resumen: n.resumen, contenido: n.contenido, imagen: n.imagen || '', id_categoria:  Number(n.id_categoria), destacada: !!n.destacada }
})

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
  } finally {
    subiendo.value = false
  }
}

async function guardar() {
  await api.put(`/noticias/${route.params.id}`, form.value)
  mensaje.value = 'Guardado'
  setTimeout(() => router.push(`/noticia/${route.params.id}`), 800)
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
.crear__exito { color: var(--color-verde-oscuro); text-align: center; }
</style>