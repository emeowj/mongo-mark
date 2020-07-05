<template>
  <div class="h-full flex flex-col justify-between">
    <ul>
      <li
        v-for="note in notes"
        :key="note.id"
        @click="() => handleSelected(note)"
      >
        <note-list-item
          :note="note"
          :selected="selectedNoteId === note._id"
          :has-unsaved-changes="hasUnsavedChanges(note._id)"
          @deleteNote="deleteNote"
          @updateNote="updateNote"
        />
      </li>
    </ul>
    <div class="flex items-center border-t-2 border-gray-400">
      <button class="btn" @click="addNewNote">
        <i class="fas fa-plus"></i>Add New Note
      </button>
    </div>
  </div>
</template>

<script>
import NoteListItem from './NoteListItem.vue';

export default {
  components: {
    NoteListItem,
  },
  props: {
    notes: {
      type: Array,
      default: () => [],
    },
    selectedNote: {
      type: Object,
      default: null,
    },
  },
  computed: {
    selectedNoteId() {
      if (this.selectedNote) {
        return this.selectedNote._id;
      }
      return '';
    },
  },
  methods: {
    handleSelected(note) {
      this.$store.dispatch('selectNote', note._id);
    },
    hasUnsavedChanges(noteId) {
      return this.$store.getters.hasUnsavedChanges(noteId);
    },
    addNewNote() {
      const note = {
        title: 'New Note',
        content: '',
      };
      this.$store.dispatch('addNote', note);
    },
    deleteNote(id) {
      this.$store.dispatch('deleteNote', id);
    },
    updateNote(note) {
      this.$store.dispatch('updateNote', { note: note, buffer: false });
    },
  },
};
</script>

<style scoped>
li {
  list-style: none;
}

.btn {
  @apply w-full border rounded bg-blue-800 px-2 py-1 m-2 font-semibold text-white;
}

.btn:hover {
  @apply bg-blue-600;
}
</style>
