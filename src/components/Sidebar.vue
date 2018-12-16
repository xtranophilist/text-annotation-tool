<template>
  <div class="sidebar">
    <h1>OCR GT</h1>
    <Dropzone/>
    
  </div>
</template>

<script>

import Dropzone from './Dropzone.vue'

export default {
  name: 'Sidebar',
  components: {
      Dropzone
  }
}
</script>


<style>
.sidebar{
    border-right: 1px solid black;
    height: 100%;
    margin-right: 1em;
}

</style>
