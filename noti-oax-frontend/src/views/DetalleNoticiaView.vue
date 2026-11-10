<template>
  <main class="detalle" v-if="noticia">
    <h1 class="detalle__titulo">{{ noticia.titulo }}</h1>
    <p class="detalle__meta">{{ noticia.categoria }} • {{ noticia.autor }}</p>
    <div class="detalle__imagen"></div>
    <p class="detalle__resumen">{{ noticia.resumen }}</p>
    <p class="detalle__contenido">{{ noticia.contenido }}</p>
    <div v-if="logueado" class="detalle__acciones">
      <router-link :to="`/editar/${route.params.id}`" class="detalle__btn detalle__btn--editar">Editar</router-link>
      <button @click="eliminar" class="detalle__btn detalle__btn--eliminar">Eliminar</button>
    </div>
    <router-link to="/" class="detalle__volver">← Volver</router-link>
  </main>
  <p v-else class="detalle__cargando">Cargando...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const noticia = ref(null)
const route = useRoute()
const router = useRouter()
const logueado = ref(!!localStorage.getItem('token'))

onMounted(async () => {
  try {
    const res = await api.get('/noticias')
    const lista = res.data.noticias || res.data
    noticia.value = lista.find(n => String(n.id_noticia || n.id) === String(route.params.id))
  } catch (e) {
    console.log('Error detalle', e)
  }
})

async function eliminar() {
  if (!confirm('¿Borrar esta noticia?')) return
  await api.delete(`/noticias/${route.params.id}`)
  router.push('/')
}
</script>

<style scoped>
.detalle { max-width: 700px; margin: 0 auto; padding: 32px 24px; background: var(--color-blanco); margin-top: 24px; border-radius: 12px; }
.detalle__titulo { color: var(--color-primario); font-size: 28px; }
.detalle__meta { color: #666; font-size: 13px; margin: 8px 0 16px; }
.detalle__imagen { height: 200px; background: var(--color-primario); border-radius: 8px; margin-bottom: 16px; }
.detalle__resumen { font-weight: bold; color: var(--color-verde-oscuro); margin-bottom: 12px; }
.detalle__contenido { line-height: 1.6; color: #333; }
.detalle__acciones { display: flex; gap: 12px; margin-top: 20px; }
.detalle__btn { padding: 10px 16px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-decoration: none; font-size: 14px; }
.detalle__btn--editar { background: var(--color-verde-oscuro); color: white; }
.detalle__btn--eliminar { background: #c0392b; color: white; }
.detalle__volver { display: inline-block; margin-top: 24px; color: var(--color-verde-oscuro); font-weight: bold; text-decoration: none; }
.detalle__cargando { text-align: center; padding: 40px; }
</style>