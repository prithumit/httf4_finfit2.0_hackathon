<template>
  <div class="header ma-0">
    <v-content>
      <v-app-bar
        dense
        fixed
      >
        <v-icon
          v-if="showDrawerButton"
          @click="toggleDrawer()"
          :color="primaryColor"
        >mdi-menu</v-icon>
        <div
          v-if="displayLogo"
          class="header__logo hidden-sm-and-down"
        ></div>
        <v-spacer></v-spacer>
        <!--TODO: This will be picked up later -->
        <!--         <v-btn icon>
          <v-icon
          v-if="showAddButton"
          @click="addSteps"
          :color="primaryColor"
          >mdi mdi-plus-circle-outline</v-icon>
        </v-btn>-->
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn icon>
                <v-icon
                  @click="handleFullScreen()"
                  :color="primaryColor"
                >mdi mdi-fullscreen</v-icon>
              </v-btn>
            </div>
          </template>
          <span> {{$t('header.tooltip_fullScreen')}} </span>
        </v-tooltip>
        <v-icon
          v-if="headerLogoutIcon && headerConfig.showLogoutButton"
          @click="logoutConfirm"
          :color="primaryColor"
          >mdi-power</v-icon
        >&nbsp;
      </v-app-bar>
      <dco-modal
        :config="modalConfig"
        @save="logout"
      >
        <span
          slot="modalContent"
          class="font-weight-bold">
          {{ $t("common.confirmation_message") }}
        </span>
      </dco-modal>
    </v-content>
  </div>
</template>
<script>
import '@/_styles/pages/appbar.scss';
import event from "@/_core/helpers/event";

export default {
  name: 'Header',
  props: {
    headerConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  created() {
    event.$on('Hide_header_logo', () => {
      this.displayLogo = !this.displayLogo;
      this.headerLogoutIcon = !this.headerLogoutIcon;
    });
  },
  data() {
    return {
      // TODO: This will be picked up later
      // showAddButton: this.headerConfig.showAddButton || false,
      appName: this.$appSettings.applicationSettings.applicationName,
      displayLogo: true,
      headerLogoutIcon: true,
      showDrawerButton: this.headerConfig.showDrawerButton || false,
      modalConfig: {
        enabled: false,
        persistent: true,
        title: this.$t('admin.logoutDialog_title'),
        saveButton: 'Yes',
        cancelButton: 'No',
        width: 200,
      },
    };
  },
  methods: {
    addSteps() {
      event.$emit('add_step');
    },
    toggleDrawer() {
      event.$emit('APP_DRAWER_TOGGLED', true);
    },
    handleFullScreen() {
      const doc = window.document;
      const docEl = doc.documentElement;
      const requestFullScreen = docEl.requestFullscreen
        || docEl.mozRequestFullScreen
        || docEl.webkitRequestFullScreen
        || docEl.msRequestFullscreen;
      const cancelFullScreen = doc.exitFullscreen
        || doc.mozCancelFullScreen
        || doc.webkitExitFullscreen
        || doc.msExitFullscreen;
      if (
        !doc.fullscreenElement
        && !doc.mozFullScreenElement
        && !doc.webkitFullscreenElement
        && !doc.msFullscreenElement
      ) {
        if (requestFullScreen)
        requestFullScreen.call(docEl);
      } else {
        if (cancelFullScreen)
        cancelFullScreen.call(doc);
      }
    },
    logout() {
      this.$router.push('/');
    },
    logoutConfirm() {
      this.modalConfig.enabled = true;
    },
  },
};
</script>
<style scoped>
.logoutButton {
  position: absolute;
  width: 90%;
  bottom: 15px;
  right: 5%;
  text-align: center;
}
</style>
