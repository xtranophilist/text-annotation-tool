<template>
  <div v-if="img" class="image-row">
    <a href="#" @click.prevent="selectImage">{{img.name}}</a>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: "ImageRow",
  props: {
    img: null
  },
  components: {
    //   ImageRow
  },
  methods: {
    selectImage(){
      this.$store.commit('selectImage', this.img)
    }
  }
};
</script>


<style>
.image-row a{
display: block
}
</style>
