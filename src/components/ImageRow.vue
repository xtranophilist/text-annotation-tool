<template>
  <div v-if="img" class="image-row">
    <a href="#" @click.prevent="selectImage" :class="{selected: isSelected, empty:!hasFile}">
      {{img.name}}
      <span v-if="img.data.objects && img.data.objects.length" class="counter">{{img.data.objects && img.data.objects.length}}</span>
      </a>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ImageRow",
  props: {
    img: Object
  },
  components: {
    //   ImageRow
  },
  methods: {
    selectImage() {
      this.$store.commit("selectImage", this.img, this.selected);
    }
  },
  computed: {
    ...mapState(["selected"]),
    isSelected() {
      return this.selected && this.selected.id === this.img.id;
    },
    hasFile(){
      return this.img.file instanceof Blob;
    }
  }
};
</script>


<style>
.image-row a {
  display: block;
}
a.empty{
  color: #e22c2c !important;
}
.selected {
  font-weight: bold;
}
.counter {
  background: #666;
  color: #fff;
  padding: 0.1em;
}
</style>
