<template>
  <header class="header">
    <strong>Заметки</strong>
    <nav>
      <RouterLink to="/">Список</RouterLink>
      <RouterLink to="/about">О приложении</RouterLink>
    </nav>
  </header>
  <main class="main">
    <RouterView />
  </main>
</template>
