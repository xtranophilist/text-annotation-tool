<template>
  <div id="editor">
    <div id="canvas-wrapper">
    <canvas id="canvas">
    </canvas>
    <div v-if="selected && selected.enabled" id="clips">
      <div v-for="obj in selected.data.objects" :key="obj.guid">
        <img :src="obj.dataURL" @click="selectObject(obj)"/>
        <input :value="obj.text" @input="updateText(obj, $event.target.value)" v-focus/>
      </div>
    </div>
    </div>
    <canvas id="tmp-canvas"></canvas>
    <img id="hidden"/>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import Crop from "./Crop.vue";

import { fabric } from "fabric-browseronly";

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

// Save additional attributes in Serialization - https://stackoverflow.com/a/40940437/328406
fabric.Annotator = fabric.util.createClass(fabric.Rect, {
  type: "annotator",

  initialize: function(element, options) {
    options || (options = {});
    this.callSuper("initialize", element, options);
    this.set("uid", options.uid || element.uid || guidGenerator());
    this.set("text", options.text || element.text || "");
    this.set("dataURL", element.dataURL || options.dataURL || "");
  },

  _render: function(ctx) {
    this.callSuper("_render", ctx);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      uid: this.uid,
      text: this.text,
      dataURL: this.dataURL
    });
  }
});

fabric.Annotator.fromObject = function(object, callback) {
  var rect = new fabric.Annotator(object);
  callback && callback(rect); //?//
  return rect;
};
fabric.Annotator.async = true;

window.fabric = fabric;

fabric.Group.prototype.hasControls = false;
fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.lockMovementX = true;
fabric.Group.prototype.lockMovementY = true;
fabric.Group.prototype.lockUniScaling = true;
fabric.Group.prototype.lockRotation = true;

export default {
  name: "Editor",
  components: { Crop },
  data() {
    return {
      hiddenImg: null,
      canvas: null,
      canvasEl: null,
      cnt: 0
    };
  },
  mounted() {
    let canvas = new fabric.Canvas("canvas");

    window.c = canvas;

    canvas.includeDefaultValues = false;
    window.onfocus = () => {
      canvas.renderAll();
    };
    this.hiddenImg = document.getElementById("hidden");
    let wrapper = document.getElementById("canvas-wrapper");
    wrapper.tabIndex = 1000;
    wrapper.addEventListener("keydown", this.keyDown, false);
    this.canvas = canvas;
    document.addEventListener("keydown", this.navigation);
  },
  methods: {
    selectObject(obj) {
      let canvasObj = this.canvas.getObjects().find(o => o.uid == obj.uid);
      if (canvasObj) {
        this.canvas.setActiveObject(canvasObj);
        this.canvas.renderAll();
      }
    },
    updateText(obj, value) {
      let canvasObj = this.canvas.getObjects().find(o => o.uid == obj.uid);
      if (canvasObj) {
        canvasObj.set("text", value);
      }
      this.$store.commit("updateText", [obj.uid, value]);
    },
    dataURL(left, top, width, height) {
      let tmpCanvas = new fabric.Canvas("tmp-canvas");
      let img = this.hiddenImg;
      let newImage = new fabric.Image(img, {
        width: this.newWidth,
        height: this.newHeight,
        left: 0,
        top: 0
      });
      tmpCanvas.setWidth(this.newWidth);
      tmpCanvas.setHeight(this.newHeight);
      tmpCanvas.add(newImage);
      tmpCanvas.renderAll();
      let url = tmpCanvas.toDataURL({
        format: "jpg",
        quality: 1,
        left: left,
        top: top,
        width: width,
        height: height
      });
      tmpCanvas.dispose();
      return url;
    },
    update() {
      let obj = this.canvas.getActiveObject();
      if (obj) {
        obj.dataURL = this.dataURL(
          obj.left,
          obj.top,
          obj.getWidth(),
          obj.getHeight()
        );
      }
      // this.selected.data = this.canvas.toJSON();
      this.$store.commit("updateData", this.canvas.toJSON());
    },
    navigation(e) {
      if (e.target.tagName != "INPUT") {
        if (e.key == "d" || e.key == "D") {
          this.$store.commit("next");
        }
        if (e.key == "a" || e.key == "A") {
          this.$store.commit("previous");
        }
      }
    },
    keyDown(e) {
      if (e.target.tagName == "INPUT") {
        return;
      }

      const STEP = 2;
      let canvas = this.canvas;
      let code = e.code;
      let obj = canvas.getActiveObject();
      if (obj) {
        e.preventDefault();
        if (code == "Delete" || code == "Escape") {
          canvas.remove(obj);
          this.update();
        } else if (code == "ArrowLeft") {
          obj.setLeft(obj.getLeft() - STEP);
        } else if (code == "ArrowRight") {
          obj.setLeft(obj.getLeft() + STEP);
        } else if (code == "ArrowUp") {
          obj.setTop(obj.getTop() - STEP);
        } else if (code == "ArrowDown") {
          obj.setTop(obj.getTop() + STEP);
        }
        this.canvas.renderAll();
      }
    },
    setDimensions() {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      let editor = document.getElementById("editor");
      // let widthRatio = editor.clientWidth / hiddenImg.width,
      //   heightRatio = editor.clientHeight / hiddenImg.height;
      // let ratio;
      // if (widthRatio < heightRatio) {
      //   ratio = widthRatio;
      // } else {
      //   ratio = heightRatio;
      //   ratio = ratio * 0.7;
      // }
      // if (ratio > 10) {
      //   ratio = 10;
      // }

      // (this.newWidth = hiddenImg.width * ratio),
      //   (this.newHeight = hiddenImg.height * ratio);
      this.newWidth = 1200;
      this.newHeight = hiddenImg.height * this.newWidth / hiddenImg.width;
      canvas.setWidth(this.newWidth);
      canvas.setHeight(this.newHeight);
    },
    lock_object(obj) {
      obj.lockMovementX = true;
      obj.lockMovementY = true;
      obj.lockScalingX = true;
      obj.lockScalingY = true;
      obj.lockUniScaling = true;
      obj.lockRotation = true;
      obj.hasControls = false;
      return obj;
    },
    addImage(data) {
      let canvas = this.canvas;
      let hiddenImg = this.hiddenImg;
      this.setDimensions();
      fabric.Image.fromURL(data, img => {
        img = img.set({
          width: this.newWidth,
          height: this.newHeight
        });
        // img = this.lock_object(img)
        canvas.setBackgroundImage(img).renderAll();
        canvas.calcOffset();
        this.listenEvents();
      });
    },
    setObjectsSelectable(bool) {
      this.canvas.getObjects().forEach(o => {
        o.selectable = bool;
      });
    },
    random_rgba() {
      var o = Math.round,
        r = Math.random,
        s = 255;
      return (
        "rgba(" +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        "0.35" +
        ")"
      );
    },
    listenEvents() {
      let start;
      let canvas = this.canvas;
      if (canvas.__eventListeners) {
        canvas.__eventListeners["mouse:down"] = [];
        canvas.__eventListeners["mouse:move"] = [];
        canvas.__eventListeners["mouse:up"] = [];
      }
      canvas.on("mouse:down", options => {
        // if the current cursor isn't over an object, disable selection
        if (
          !this.canvas._searchPossibleTargets(
            this.canvas.getObjects(),
            canvas.getPointer(options.e)
          )
        ) {
          this.setObjectsSelectable(false);
        }
        start = canvas.getPointer(options.e);
      });
      canvas.on("mouse:up", options => {
        if (start && !canvas.getActiveObject() && !canvas.getActiveGroup()) {
          let end = canvas.getPointer(options.e);
          let left, top;

          if (start.x < end.x) {
            left = start.x;
          } else {
            left = end.x;
          }
          if (start.y < end.y) {
            top = start.y;
          } else {
            top = end.y;
          }

          let width = Math.abs(end.x - start.x);
          let height = Math.abs(end.y - start.y);

          if (width > 3 && height > 3) {
            let dataURL = this.dataURL(left, top, width, height);
            let text = "";
            if (this.getPresets && this.getPresets.length > this.cnt) {
              text = this.getPresets[this.cnt];
            }

            var rect = new fabric.Annotator({
              left: left,
              top: top,
              width: width,
              height: height,
              // fill: "rgba(255,127,39,0.35)",
              fill: this.random_rgba(),
              hasControls: true,
              dataURL: dataURL,
              text: text
            });
            rect.on("modified", this.update);
            canvas.add(rect);
            this.cnt++;
            canvas.renderAll();
            // this.addImage()
            this.update();
          }
          this.setObjectsSelectable(true);
        }
      });
    }
  },
  watch: {
    selected() {
      let canvas = this.canvas;
      canvas.clear();
      this.cnt = 0;
      let file = this.selected.file;
      let canvasData = this.$store.getters.getImage(this.selected.id).data;
      if (canvasData.objects) {
        canvas.loadFromJSON(
          canvasData,
          canvas.renderAll.bind(canvas),
          (o, object) => {
            object.on("modified", this.update);
            this.cnt++;
          }
        );
      }
      // else {
      let reader = new FileReader();
      reader.onload = f => {
        var data = f.target.result;
        this.hiddenImg.onload = () => {
          this.addImage(data);
        };
        this.hiddenImg.src = data;
      };
      if (file instanceof Blob) {
        reader.readAsDataURL(file);
      }
      // }
    }
  },

  computed: {
    ...mapState(["selected"]),
    ...mapGetters(["getPresets"])
  }
};
</script>


<style>
#hidden {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
}
#tmp-canvas {
  visibility: hidden;
}
#canvas-wrapper {
  outline: none;
}

#clips div {
  float: left;
  padding: 0.5em;
}
</style>
