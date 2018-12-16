
<template>

  <div class="dropzone">
    <form class="box" method="post" action="" enctype="multipart/form-data">
    <label for="files">
      Drop your files here or click to append.<br/>
      <span> ({{images.length}} <span v-if="images.length==1">image</span><span v-else>images</span>)</span>
      </label>
    
    <input class="file-input" id="files" type="file" multiple @change="filesChanged" accept="image/*"/>    
</form>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: "Dropzone",
  methods: {
    filesChanged: function(e) {
      let files = e.target.files;
      console.log(files);
      this.$store.commit("addFiles", files);
    }
  },
  computed: mapState([
  // map this.count to store.state.count
  'images'
])
};
</script>


<style>
.box {
  height: 200px;
  background-color: #c8dadf;
  outline: 2px dashed #92b0b3;
  outline-offset: -5px;
  position: relative;
}
label {
  position: absolute;
  top: 30%;
  left: 5%;
  text-align: center;
}
.file-input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  height: 100%;
  width: 100%;
  opacity: 0;
}
</style>
