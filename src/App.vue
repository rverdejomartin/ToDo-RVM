<script setup>

</script>

<template>
  <RouterView></RouterView>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

:root {
  --bg-dark: #0f172a;
  --bg-card: rgba(30, 41, 59, 0.7);
  --accent: #38bdf8;
  --accent-high: #f43f5e;
  --accent-low: #10b981;
  --accent-normal: #f59e0b;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --glass-border: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

input, select {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid var(--glass-border);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: var(--accent);
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 1rem;
  }
}
</style>