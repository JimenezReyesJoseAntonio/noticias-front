<template>
  <main class="noticias">
    <h1 class="noticias__titulo">Noticias de Oaxaca</h1>

    <p v-if="cargando" class="noticias__cargando">Cargando...</p>
    <p v-if="error" class="noticias__error">{{ error }}</p>

    <div class="noticias__lista">
      <article
        v-for="n in noticias"
        :key="n.id"
        class="noticia"
        :class="{ 'noticia--destacada': n.destacada }"
      >
        <h2 class="noticia__titulo">{{ n.titulo }}</h2>
        <p class="noticia__meta">{{ n.categoria }} • {{ n.autor }}</p>
        <p class="noticia__resumen">{{ n.resumen }}</p>
      </article>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const noticias = ref([])
const cargando = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await api.get('/noticias')
    noticias.value = res.data
  } catch {
    error.value = 'No se pudieron cargar las noticias'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.noticias { max-width: 800px; margin: 0 auto; padding: 20px; }
.noticias__titulo { font-size: 28px; margin-bottom: 20px; }
.noticias__lista { display: flex; flex-direction: column; gap: 16px; }
.noticia { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
.noticia--destacada { border-color: #e67e22; background: #fff8f0; }
.noticia__titulo { font-size: 20px; margin: 0 0 8px; }
.noticia__meta { font-size: 13px; color: #666; margin: 0 0 8px; }
.noticia__resumen { margin: 0; }
</style>