<template>
  <div>
    <ul>
      <li v-for="note in notes" :key="note.id">
        <note-list-item :note="note" />
      </li>
    </ul>
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
    };
  },
  created: function() {
    fetch('http://localhost:3000/notes')
      .then((res) => res.json())
      .then((data) => {
        this.notes = data;
      });
  },
};
</script>

<style></style>
