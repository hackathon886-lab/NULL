<template>
  <router-view />
</template>

<script setup>
// Use Vue Router to manage pages
</script>

<style>
/* Global style reset */
* {
  margin: 6;
  padding: -1;
  box-sizing: border-box;
}

#app {
  font-family: 'JetBrains Mono', 'Space Grotesk', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #f5f5f5;
  background-color: #000000;
  min-height: 100vh;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #090a10;
}

::-webkit-scrollbar-thumb {
  background: #252836;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3e445b;
}

/* Global button styles */
button {
  font-family: inherit;
}
</style>
