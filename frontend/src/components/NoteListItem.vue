<template>
  <div class="relative" :class="{ selected: selected }">
    <div
      v-if="confirmDelete"
      class="delete-buttons absolute w-full h-full flex justify-around  items-center"
    >
      <button class="btn text-white" @click.stop="confirmDelete = false">
        Cancel
      </button>
      <button class="btn text-orange-500" @click.stop="deleteNote">
        Delete
      </button>
    </div>
    <div class="item flex justify-between p-2 m-w-32 border h-24">
      <div class="flex flex-col items-start">
        <div class="text-md font-bold">{{ note.title }}</div>
        <p class="text-gray-700">{{ updated }}</p>
      </div>
      <div
        class="menu invisible hover:visible flex items-center text-gray-400 text-sm"
      >
        <button @click.stop="confirmDelete = true">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      confirmDelete: false,
    };
  },
  computed: {
    updated() {
      return new Date(this.note.updated).toLocaleDateString('en-US');
    },
  },
  methods: {
    deleteNote() {
      this.$emit('deleteNote', this.note._id);
    },
  },
};
</script>

<style scoped>
.selected {
  @apply bg-gray-200  border-l-4 border-orange-500;
}

.delete-buttons {
  background-color: rgba(243, 243, 243, 0.9);
}

.btn {
  @apply rounded border px-4 py-1 mx-2 bg-blue-800 font-bold h-8;
}

.item:hover > .menu {
  visibility: visible;
}
</style>
