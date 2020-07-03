<template>
  <div class="flex flex-col items-start p-2 m-w-32" :class="{selected: selected}">
    <div class="text-md font-bold">{{ note.title }}</div>
    <p class="text-gray-700">{{ updated }}</p>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    updated() {
      return new Date(this.note.updated).toLocaleDateString("en-US");
    }
  }
};
</script>

<style scoped>
.selected {
  @apply bg-gray-200  border-l-4 border-orange-500;
}
</style>
