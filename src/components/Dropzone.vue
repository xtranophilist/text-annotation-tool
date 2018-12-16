
<template>

  <div class="dropzone">
    <form class="box" method="post" action="" enctype="multipart/form-data">
    Drop your files here
    <input class="file-input" type="file" multiple @change="filesChanged" accept="image/*"/>    
</form>
  </div>
</template>

<script>
export default {
  name: "Dropzone",
  methods: {
    filesChanged: function(e) {
      let files = e.target.files;
      console.log(files);
      this.$store.commit('addFiles', files);
    }
  }
};
</script>


<style>
.box {
  height: 200px;
  background-color: #c8dadf;
  outline: 2px dashed #92b0b3;
  outline-offset: -5px;
}
.file-input {
  border: 1px solid red;
  opacity: 0;
  height: 100%;
  width: 100%;
}
</style>
