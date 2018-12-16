<template>
  <div class="sidebar">
    <h1>OCR GT</h1>
    <Dropzone/>
    <div v-for="image in images" :key="image.fullName">
      {{image.name}}
    </div>
  </div>
</template>

<script>

import Dropzone from './Dropzone.vue'
import { mapState } from 'vuex'


export default {
  name: 'Sidebar',
  components: {
      Dropzone
  },
  computed: mapState([
  // map this.count to store.state.count
  'images'
])
}
</script>


<style>
.sidebar{
    border-right: 1px solid black;
    height: 100%;
    margin-right: 1em;
}

</style>
