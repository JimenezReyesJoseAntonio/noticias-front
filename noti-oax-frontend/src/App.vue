<template>
  <div class="app">
    <header class="navbar">
      <router-link to="/" class="navbar__logo">Noti-Oax</router-link>
      <nav class="navbar__links">
        <router-link to="/" class="navbar__link">Inicio</router-link>
        <router-link to="/login" class="navbar__link">Login</router-link>
      </nav>
    </header>

    <router-view />

    <footer class="footer">
      <p class="footer__texto">Noti-Oax • Noticias de Oaxaca</p>
      <p class="footer__texto">Oaxaca de Juárez, 2026</p>
    </footer>
  </div>
</template>

<style>
.navbar { background: var(--color-primario); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.navbar__logo { color: var(--color-blanco); text-decoration: none; font-weight: bold; font-size: 22px; }
.navbar__links { display: flex; gap: 16px; }
.navbar__link { color: var(--color-fondo); text-decoration: none; }
.navbar__link:hover { color: var(--color-verde-claro); }
.footer { background: var(--color-primario); color: var(--color-fondo); padding: 24px; text-align: center; margin-top: 40px; }
.footer__texto { font-size: 14px; margin: 4px 0; }
</style>