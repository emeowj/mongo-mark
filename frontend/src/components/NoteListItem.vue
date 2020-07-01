<template>
  <div>
    <h3>{{ note.title }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
