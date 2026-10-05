<script setup lang="ts">
import { ref, watch } from 'vue';

const KEY = 'notes-vue';

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

const notes = ref<string[]>(load());
const text = ref('');

watch(
  notes,
  (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
  },
  { deep: true },
);

function add() {
  if (!text.value.trim()) return;
  notes.value.unshift(text.value.trim());
  text.value = '';
}
</script>

<template>
  <form class="form" @submit.prevent="add">
    <input v-model="text" placeholder="Новая заметка" />
    <button type="submit">Добавить</button>
  </form>
  <p v-if="!notes.length" class="muted">Заметок пока нет.</p>
  <ul class="notes">
    <li v-for="(note, i) in notes" :key="i">
      <span>{{ note }}</span>
      <button type="button" class="ghost" aria-label="Удалить" @click="notes.splice(i, 1)">×</button>
    </li>
  </ul>
</template>
