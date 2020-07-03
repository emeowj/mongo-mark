<template>
  <div class="border flex flex-col items-start p-2 m-w-32" @click="handleClick">
    <div class="text-lg font-bold">{{ note.title }}</div>
    <p class="text-gray-700">{{ updated }}</p>
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
    updated() {
      return new Date(this.note.updated).toLocaleDateString("en-US");
    }
  },
  methods: {
    handleClick() {
      this.$emit("selected", this.note);
    }
  }
};
</script>

<style></style>
