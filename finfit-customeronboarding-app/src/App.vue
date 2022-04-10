<template>
  <div id="app">
    <dco-header :headerConfig="headerConfig" v-if="!isHomeRoute"/>
    <v-overlay
      v-if="loaderEnabled"
      :opacity="0.5"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        class="circular-loader"
      ></v-progress-circular>
    </v-overlay>
    <v-app>
      <router-view/>
    </v-app>
    <dco-toast :config="alertMessage" />
    <dco-idleHandler />
  </div>
</template>

<script>
import deviceScreenMixin from '@/_core/mixins/deviceScreenMixin';
import Header from '@/pages/_common/Header.vue';
import localeMixin from '@/_core/mixins/localeMixin';
import toastMixin from '@/_core/mixins/toastMixin';
import '@/_styles/main.scss';

export default {
  name: 'App',
  mixins: [
    localeMixin,
    deviceScreenMixin,
    toastMixin,
  ],
  components: {
    'dco-header': Header,
    'dco-toast': () => import('@/components/DCO-ErrorHandler/ErrorHandler.vue'),
    'dco-idleHandler': () => import('@/components/DCO-IdleTimeout/IdleTimeout.vue'),
  },
  data() {
    return {
      headerConfig: {},
      isLoaderEnabled: true,
    };
  },
  computed: {
   isHomeRoute() {
      return this.$route.name === 'dco';
   }
  }
};
</script>
