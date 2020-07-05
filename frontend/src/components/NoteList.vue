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
          :selected="selectedNote === note._id"
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
  data: function() {
    return {
      notes: [],
      selectedNote: '',
    };
  },
  created: function() {
    this.$http.get('/notes').then((res) => {
      this.notes = res.data;
      if (this.notes) {
        this.handleSelected(this.notes[0]);
      }
    });
  },
  methods: {
    handleSelected(note) {
      this.selectedNote = note._id;
      this.$emit('selected', note);
    },
    addNewNote() {
      const note = {
        title: 'New Note',
        content: '',
      };
      this.$http.put('note', note).then((res) => {
        const created = res.data;
        this.notes.push(created);
        this.handleSelected(created);
      });
    },
    deleteNote(id) {
      this.$http.delete(`/note/${id}`).then(() => {
        const index = this.notes.findIndex((note) => note._id === id);
        this.notes.splice(index, 1);
        // Update selected note if the deleted note is currently selected.
        if (this.selectedNote === id) {
          let selected = null;
          if (index >= this.notes.length) {
            selected = this.notes[0] || null;
          } else {
            selected = this.notes[index];
          }
          this.handleSelected(selected);
        }
      });
    },
    updateNote({ id, title }) {
      this.$http.patch(`/note/${id}`, { title }).then((res) => {
        const index = this.notes.findIndex((note) => note._id === id);
        const updated = res.data;
        this.notes.splice(index, 1, updated);
        this.handleSelected(updated);
      });
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
