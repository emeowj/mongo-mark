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
      <note-list @selected="selectNote"></note-list>
    </div>
    <div class="flex-1 bg-gray-200">
      <note :note="currentNote" @update="updateNote" v-if="currentNote"></note>
    </div>
  </div>
</template>

<script>
import NoteList from './components/NoteList.vue';
import Note from './components/Note.vue';

export default {
  name: 'App',
  data: function() {
    return {
      currentNote: null,
      modified: new Map(),
    };
  },
  components: {
    NoteList,
    Note,
  },
  methods: {
    selectNote(note) {
      if (this.modified.has(note._id)) {
        this.currentNote = this.modified.get(note._id);
      } else {
        this.currentNote = note;
      }
    },
    updateNote(note) {
      this.modified.set(note._id, note);
      this.currentNote = note;
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
