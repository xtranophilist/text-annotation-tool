<template>
  <div id="editor">
    <canvas id="canvas">
    </canvas>
    <img id="hidden"/>
  </div>
</template>

<script>
import { mapState } from "vuex";

// import {fabric} from "fabric";

import { fabric } from "fabric-browseronly";
window.fabric = fabric;

export default {
  name: "Editor",
  data() {
    return {
      // canvas: null,
      // hiddenImg: null
    };
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");
    this.hiddenImg = document.getElementById("hidden");
  },
  methods: {
    setDimensions() {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      let editor = document.getElementById("editor");
      let widthRatio = editor.clientWidth / hiddenImg.width,
        heightRatio = editor.clientHeight / hiddenImg.height;
      let ratio;
      if (widthRatio < heightRatio) {
        ratio = widthRatio;
      } else {
        ratio = heightRatio;
      }
      if (ratio > 10) {
        ratio = 10;
      }
      let newWidth = hiddenImg.width * ratio,
        newHeight = hiddenImg.height * ratio;
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      hiddenImg.width=newWidth;
      hiddenImg.width=newHeight;
    },
    addImage(data) {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      this.setDimensions();
      fabric.Image.fromURL(data, function(img) {
        img = img.set({
          left: 0,
          top: 0,
          angle: 0,
          width: hiddenImg.width,
          height: hiddenImg.height
        });
        canvas.add(img).renderAll();
      });
    }
  },
  watch: {
    selected() {
      let canvas = this.canvas;
      canvas.clear();
      let file = this.selected.file;
      let reader = new FileReader();
      reader.onload = f => {
        var data = f.target.result;
        this.hiddenImg.onload = () => {
          this.addImage(data);
        };
        this.hiddenImg.src = data;
      };
      reader.readAsDataURL(file);
    }
  },

  computed: {
    ...mapState(["selected"])
  }
};
</script>


<style>
#canvas {
  border: 1px solid red;
}
#hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
}
</style>
