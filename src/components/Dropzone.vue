
<template>

  <div class="dropzone">
      <!-- https://css-tricks.com/drag-and-drop-file-uploading/ -->
    <h2>Drop Zone</h2>
    <form class="box" method="post" action="" enctype="multipart/form-data">

    <input class="file-input" type="file" multiple @change="filesChanged"/>    

</form>
  </div>
</template>

<script>
export default {
  name: "Dropzone",
  methods: {
    filesChanged: function(e) {
      let files = e.target.files
      console.log(files)
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
