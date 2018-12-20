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
    dataURL() {
      let obj = this.obj;
      let url = this.canvas.toDataURL({
        format: "jpg",
        quality: 1,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height
      });
      return url;
    }
  }
};
</script>


<style>
</style>
