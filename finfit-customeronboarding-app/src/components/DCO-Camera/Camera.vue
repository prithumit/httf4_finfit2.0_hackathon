<template>
  <div ref="wrapper" class="camera">
    <div class="camera-wrapper">
      <video ref="camera" id="preview" width="100%" height="auto" autoplay></video>
      <img v-show="blob" ref="photo" id="photo" alt="photo" width="100%" height="auto" />
    </div>
    <div class="buttons-wrapper">
      <div v-if="!isRecording && !isAlreadyRecorded" @click="takePhoto" class="record-button">
        <v-icon class="white--text" aria-hidden="true">mdi-camera-iris</v-icon>
      </div>
      <div v-if="isRecording" @click="stopRecording" class="record-button">
        <i class="fa fa-stop" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
import '@/_styles/components/camera.scss';

export default {
  name: 'Camera',
  data() {
    return {
      smallPreview: false,
      blob: null,
      devices: [],
      constraints: {},
      selected: null,
      isRecording: false,
      isAlreadyRecorded: false,
      stream: undefined,
    };
  },
  props: {
    isCameraStopped: {
      type: Boolean,
    },
  },
  methods: {
    takePhoto() {
      const { photo } = this.$refs;
      navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
        const mediaStreamTrack = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(mediaStreamTrack);
        imageCapture.takePhoto().then((blob) => {
          this.blob = blob;
          this.isAlreadyRecorded = true;
          photo.src = URL.createObjectURL(blob);
          this.$emit('blobURL', { image: photo.src, stream: this.stream });
          photo.onload = () => {
            URL.revokeObjectURL(this.src);
          };
        });

        setTimeout(() => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }, 100);
      });
    },
    stopCamera() {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    },
    handleWindowResize() {
      this.smallPreview = this.$refs.wrapper.offsetWidth < 740;
    },
    handleOnPlay() {
      this.$emit('isCameraActive', true);
    },
    loadDevices() {
      const { camera } = this.$refs;
      window.addEventListener('resize', this.handleWindowResize);
      this.handleWindowResize();
      camera.addEventListener('play', this.handleOnPlay);
      this.constraints = { video: true };
      const gotDevices = (mediaDevices) => {
        this.devices = JSON.parse(JSON.stringify(mediaDevices)).filter(
          d => d.kind === 'videoinput',
        );
        const { deviceId } = this.devices;
        const videoConstraints = {};
        videoConstraints.deviceId = { exact: deviceId };
        this.constraints = {
          video: videoConstraints,
          audio: false,
        };
      };
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then((stream) => {
          camera.srcObject = stream;
          this.stream = stream;
          return navigator.mediaDevices.enumerateDevices();
        })
        .then(gotDevices)
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.loadDevices();
  },
  beforeDestroy() {
    const { camera } = this.$refs;
    window.removeEventListener('resize', this.handleWindowResize);
    camera.removeEventListener('play', this.handleOnPlay);
  },
  watch: {
    isCameraStopped: {
      handler() {
        if (this.isCameraStopped) {
          this.stopCamera();
        } else {
          this.loadDevices();
        }
      },
    },
    deep: true,
  },
};
</script>
