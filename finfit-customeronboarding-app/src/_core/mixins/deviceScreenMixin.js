/* eslint-disable no-unused-vars */
import store from '@/_core/store';

const deviceScreenMixin = {
  data() {
    return {
      setHeight: '',
    };
  },
  mounted() {
    this.getUserCountry();
    this.loadscreenWidth();
    window.addEventListener('beforeunload', this.handler);
  },
  created() {
    // this.persistSessionAlert();
    window.addEventListener('resize', this.screenHeight);
    this.screenHeight();
    this.loadscreenWidth();
  },
  destroyed() {
    window.removeEventListener('resize', this.screenHeight);
  },
  methods: {
    persistSessionAlert() {
      window.addEventListener('beforeunload', (e) => {
        const confirmationMessage = 'o/';

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      });
    },
    loadscreenWidth() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth < 800) {
        this.setIsMobile(true);
      } else {
        this.setIsMobile(undefined);
      }
    },
    getUserCountry() {
      if (navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          store.dispatch('appSettings/setAppConfig', {
            coords: {
              latitude,
              longitude,
            },
          });
        });
      }
    },
    setIsMobile(isMobile) {
      store.dispatch('appSettings/setAppConfig', {
        isMobile,
      });
    },
    // eslint-disable-next-line consistent-return
    screenHeight(e) {
      if (window.matchMedia('(orientation: portrait)').matches) {
        const currentHeight = window.innerHeight;
        if (currentHeight <= 667) {
          this.setHeight = `${currentHeight / 10.1}vh`;
        } else if (currentHeight >= 668 && currentHeight <= 736) {
          this.setHeight = `${currentHeight / 10.4}vh`;
        } else if (currentHeight >= 737 && currentHeight <= 1023) {
          this.setHeight = `${currentHeight / 11}vh`;
        } else {
          return 0;
        }
      } else {
        this.setHeight = '';
      }
    },
  },
};

export default deviceScreenMixin;
