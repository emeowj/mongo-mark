<template>
  <div>
    <h1>{{note.title}}</h1>
    <p>{{note.content}}</p>
  </div>
</template>

<script>
export default {
  props: ["note"]
};
</script>

<style>
</style>