<template>
  <div id="app">
    <Sidebar/>
    <Editor/>
  </div>
</template>

<script>

import Sidebar from './components/Sidebar.vue'
import Editor from './components/Editor.vue'



export default {
  name: 'app',
  components: {
    Sidebar, Editor
  }
}
</script>

<style>
body, html{
  height: 100%;
  margin: 0;
}
a:visited{
  color: #1a0dab;
}
#app {
  min-height: 100%;
  display: grid;
  grid-template-columns: 350px auto;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
