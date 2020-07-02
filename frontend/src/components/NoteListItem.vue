<template>
  <div class="note">
    <h1>{{ note.title }}</h1>
    <div>Created: {{ created }}</div>
    <div>Last updated: {{ updated }}</div>
    <p>{{ note.content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  computed: {
    created() {
      return new Date(this.note.created).toLocaleDateString("en-US");
    },
    updated() {
      return new Date(this.note.updated).toLocaleDateString("en-US");
    }
  }
};
</script>

<style></style>
