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
          @keydown="handleSave"
          class="w-full h-full"
        ></textarea>
      </div>
      <div class="w-1/2 px-2 py-2">
        <article class="prose prose-sm lg:prose-lg" v-html="compiledMarkdown">
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import hljs from 'highlight.js';

export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      stylesheet: 'modest.css',
    };
  },
  created: function() {
    this.md = new MarkdownIt({
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (error) {
            // ignore
          }
        }
        return '';
      },
    });
    this.md.use(MarkdownItContainer, 'warning');
  },
  computed: {
    compiledMarkdown: function() {
      return this.md.render(this.note.content);
    }
  },
  methods: {
    update: function(ev) {
      const updated = Object.assign({}, this.note);
      updated.content = ev.target.value;
      this.$emit('update', { note: updated, buffer: true });
    },
    handleSave: function(event) {
      if (event.ctrlKey || event.metaKey) {
        if ('s' === String.fromCharCode(event.which).toLowerCase()) {
          const updated = Object.assign({}, this.note);
          updated.content = event.target.value;
          this.$emit('update', { note: updated, buffer: false });
          event.preventDefault();
        }
      }
    },
  },
};
</script>

<style></style>
