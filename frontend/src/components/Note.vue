<template>
  <div class="flex flex-col h-full">
    <h1 class="w-full text-center  bg-blue-700 text-white font-bold">
      {{ note.title }}
    </h1>
    <div class="flex flex-1">
      <div class="w-1/2 h-full px-2 py-2 border-2">
        <textarea
          name="content"
          :value="note.content"
          @input="update"
          class="w-full h-full"
        ></textarea>
      </div>
      <div class="w-1/2 px-2 py-2">
        <iframe
          :srcdoc="renderedContent"
          frameborder="0"
          class="w-full h-full"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      stylesheet: 'retro.css',
    };
  },
  created: function() {
    this.md = new MarkdownIt();
  },
  computed: {
    renderedContent() {
      return `
        <html>
        <head>
        <link rel="stylesheet" href="/markdown-css/${this.stylesheet}">
        </head>
        <body>${this.md.render(this.note.content)}</body>
        </html>
        `;
    },
  },
  methods: {
    update: function(ev) {
      const updated = Object.assign({}, this.note);
      updated.content = ev.target.value;
      this.$emit('update', updated);
    },
  },
};
</script>

<style></style>
