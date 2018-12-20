<template>
  <span v-if="obj" class="crop">
    <img :src="dataURL"/>
  </span>
</template>

<script>
export default {
  name: "Crop",
  props: {
    obj: Object,
    canvas: Object
  },

  computed: {
    
  }
};
</script>


<style>
</style>
