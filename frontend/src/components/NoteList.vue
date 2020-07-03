<template>
  <div>
    <ul>
      <li v-for="note in notes" :key="note.id">
        <note-list-item :note="note" @selected="handleSelected" />
      </li>
    </ul>
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
      notes: []
    };
  },
  created: function() {
    fetch("http://localhost:3000/notes")
      .then(res => res.json())
      .then(data => {
        this.notes = data;
      });
  },
  methods: {
    handleSelected(note) {
      this.$emit("selected", note);
    }
  }
};
</script>

<style scoped>
li {
  list-style: none;
}
</style>
