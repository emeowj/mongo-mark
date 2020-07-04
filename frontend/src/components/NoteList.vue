<template>
  <div class="h-full flex flex-col justify-between">
    <ul>
      <li v-for="note in notes" :key="note.id" @click="() => handleSelected(note)">
        <note-list-item :note="note" :selected="selectedNote === note._id" />
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
import NoteListItem from "./NoteListItem.vue";

export default {
  components: {
    NoteListItem
  },
  data: function() {
    return {
      notes: [],
      selectedNote: ""
    };
  },
  created: function() {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        this.notes = data;
        if (this.notes) {
          this.selectedNote = this.notes[0]._id;
        }
      });
  },
  methods: {
    handleSelected(note) {
      this.selectedNote = note._id;
      this.$emit("selected", note);
    },
    addNewNote() {
      const note = {
        title: "New Note",
        content: ""
      };
      fetch("/api/note", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
      })
        .then(response => response.json())
        .then(created => {
          this.notes.push(created);
          this.handleSelected(created);
        });
    }
  }
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
