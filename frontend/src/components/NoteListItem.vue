<template>
  <div class="relative m-w-32" :class="{ selected: selected }">
    <div
      v-if="confirmDelete"
      class="delete-buttons absolute w-full h-full flex justify-around items-center"
    >
      <button class="btn text-white" @click.stop="confirmDelete = false">Cancel</button>
      <button class="btn text-orange-500" @click.stop="deleteNote">Delete</button>
    </div>
    <div class="item flex justify-between p-2 border" @dblclick="editNote">
      <div class="flex flex-col items-start justify-between">
        <input
          v-if="editing"
          class="title-input"
          type="text"
          v-model="newTitle"
          @blur="updateNote"
          @keyup.enter="updateNote"
        />
        <div v-else class="text-md font-bold">{{ note.title }}</div>
        <p class="text-gray-700 text-sm">
          <i class="fas fa-clock text-gray-400"></i>
          {{ updated }}
        </p>
      </div>
      <div
        v-if="!editing"
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
import moment from 'moment';

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
  data: function() {
    return {
      confirmDelete: false,
      editing: false,
      newTitle: this.note.title
    };
  },
  computed: {
    updated() {
      return moment(this.note.updated).fromNow();
    }
  },
  methods: {
    deleteNote() {
      this.$emit('deleteNote', this.note._id);
      this.confirmDelete = false;
    },
    editNote() {
      this.editing = true;
      this.$nextTick(() => {
        this.$el.querySelector('.title-input').focus();
      });
    },
    updateNote() {
      this.editing = false;
      if (this.newTitle != this.note.title) {
        this.$emit('updateNote', { id: this.note._id, title: this.newTitle });
      }
    }
  }
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

input {
  @apply border-b-2 border-orange-500 bg-transparent;
}
</style>
