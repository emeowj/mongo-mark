<template>
  <div class="relative m-w-32" :class="{ selected: selected }">
    <div
      v-if="state === State.DELETING"
      class="delete-buttons absolute w-full h-full flex justify-around items-center"
    >
      <button class="btn text-white" @click.stop="state = State.DEFAULT">
        Cancel
      </button>
      <button class="btn text-orange-500" @click.stop="deleteNote">
        Delete
      </button>
    </div>
    <div class="item flex justify-between p-2 border" @dblclick="editNote">
      <div class="flex flex-col items-start justify-between">
        <input
          v-if="state === State.EDITING"
          class="title-input"
          type="text"
          v-model="newTitle"
          @blur="updateNote"
          @keyup.enter="updateNote"
          @click.stop
        />
        <div v-else class="text-md font-bold">{{ note.title }}</div>
        <p class="text-gray-700 text-sm">
          <i class="fas fa-clock text-gray-400"></i>
          {{ updated }}
        </p>
      </div>
      <div
        v-if="state !== State.EDITING"
        class="menu invisible hover:visible flex items-center text-gray-400 text-sm"
      >
        <button @click.stop="state = State.DELETING">
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
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    hasUnsavedChange: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    state: function(val) {
      switch (val) {
        case this.State.EDITING:
        case this.State.DELETING:
          window.addEventListener('click', this.clickEventHandler);
          window.addEventListener('keydown', this.escEventHandler);
          break;
        case this.State.DEFAULT:
          window.removeEventListener('click', this.clickEventHandler);
          window.removeEventListener('keydown', this.escEventHandler);
      }
    },
  },
  data: function() {
    return {
      State: Object.freeze({
        DEFAULT: 'default',
        DELETING: 'deleting',
        EDITING: 'editing',
      }),
      state: 'default',
      newTitle: this.note.title,
      clickEventHandler: (ev) => {
        if (ev.target != this.$el.querySelector('.delete-buttons')) {
          this.state = this.State.DEFAULT;
        }
      },
      escEventHandler: (ev) => {
        if (ev.keyCode === 27) {
          this.state = this.State.DEFAULT;
          this.newTitle = this.note.title;
        }
      },
    };
  },
  computed: {
    updated() {
      return moment(this.note.updated).fromNow();
    },
  },
  methods: {
    deleteNote() {
      this.$emit('deleteNote', this.note._id);
      this.state = this.State.DELETING;
    },
    editNote() {
      this.state = this.State.EDITING;
      this.$nextTick(() => {
        this.$el.querySelector('.title-input').focus();
      });
    },
    updateNote() {
      this.state = this.State.DEFAULT;
      if (this.newTitle != this.note.title) {
        this.note.title = this.newTitle;
        this.$emit('updateNote', { id: this.note._id, title: this.newTitle });
      }
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

input {
  @apply border-b-2 border-orange-500 bg-transparent;
}
</style>
