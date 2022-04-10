<template>
  <div>
    <component
      v-if="config.component"
      :is="config.component"
      :config="getSettings()"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'dco-errorHandler',
  components: {
    'dco-snackbar': () => import('@/components/DCO-ErrorHandler/Snackbar.vue'),
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  data() {
    return {
      settingsObj: {
        'dco-snackbar': {
          enabled: false,
          content: '',
          color: '',
          timeout: 2000,
          topPosition: true,
          rightPosition: true,
          bottomPosition: false,
          leftPosition: false,
        },
        'dco-modal': {
          enabled: true,
          name: 'DCO',
          values: '',
          saveButton: 'OK',
          close: true,
          title: '',
          'max-height': '50px',
          width: '500px',
          persistent: false,
        },
      },
      colorMap: {
        error: {
          color: '#E57373',
        },
        success: {
          color: '#66BB6A', // green lighten-1
        },
      },
    };
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    getColorByType(messageType) {
      return this.colorMap[messageType].color;
    },
    getSettings() {
      const {
        content, type, title, component,
        saveButton, cancelButton, timeout, saveCallback, cancelCallback, close, persistent,
      } = this.config;
      const settingObj = this.settingsObj[component];
      const getColorCode = this.getColorByType(type);

      settingObj.enabled = true;

      if (component === 'dco-modal') {
        settingObj.values = content;
        settingObj.title = title;
        settingObj.saveButton = saveButton;
        settingObj.cancelButton = cancelButton;
        settingObj.saveCallback = saveCallback;
        settingObj.cancelCallback = cancelCallback;
        settingObj.close = close;
        settingObj.persistent = persistent;
      } else if (component === 'dco-snackbar') {
        settingObj.content = content;
        settingObj.color = getColorCode;
        settingObj.timeout = timeout;
      }

      return settingObj;
    },
  },
};
</script>
