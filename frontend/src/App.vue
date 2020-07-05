<template>
  <div id="app" class="w-screen h-screen flex">
    <div class="w-64 h-full flex flex-col">
      <div class="w-full p-2 flex items-center text-white bg-blue-800">
        <i class="fas fa-bars mr-2"></i>
        <input
          type="text"
          class="mr-2 px-2 w-48 rounded bg-blue-700"
          placeholder="search"
        />
        <i class="fas fa-search mr-2"></i>
      </div>
      <note-list :notes="notes" :selected-note="selectedNote"></note-list>
    </div>
    <div class="flex-1 bg-gray-200">
      <note
        :note="selectedNote"
        v-if="selectedNote"
        @update="updateNote"
      ></note>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NoteList from './components/NoteList.vue';
import Note from './components/Note.vue';

const AUTO_SAVE_INTERVAL = 30000;

export default {
  name: 'App',
  components: {
    NoteList,
    Note,
  },
  created() {
    this.$store.dispatch('init');
    const i = setInterval(
      () => this.$store.dispatch('batchSave'),
      AUTO_SAVE_INTERVAL
    );
    this.$once('hooks:beforeDestory', () => clearInterval(i));
  },
  computed: {
    ...mapGetters(['notes', 'selectedNote']),
  },
  methods: {
    updateNote({ note, buffer }) {
      this.$store.dispatch('updateNote', { note, buffer });
    },
  },
};
</script>

<style>
#app {
  font-family: Ubuntu, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
