<template>
  <div class="app">
    <header class="navbar">
      <router-link to="/" class="navbar__logo">Noti-Oax</router-link>
    </header>

    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
* { box-sizing: border-box; margin: 0; font-family: sans-serif; }
.app { min-height: 100vh; background: #f9f9f9; }
.navbar { background: #1a1a1a; padding: 16px 20px; }
.navbar__logo { color: white; text-decoration: none; font-weight: bold; font-size: 20px; }
</style>