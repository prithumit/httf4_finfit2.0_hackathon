<template>
  <div class="postcode-lookup">
    <dco-modal
      v-if="enable"
      @save="onSave()"
      @cancel="onClose()"
      :config="config"
      class="postcode-lookup__hide-overflow"
    >
      <div slot="modalContent">
        <v-card class="mx-auto" tile>

          <v-list class="postcode-lookup__enable-overflow">
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                @click="onSave(i)"
                :key="i"
                :color="primaryColor"
                class="postcode-lookup--list-value"
              >
                <v-list-item-content
                  class="postcode-lookup__spacing"
                >
                  <v-list-item-title
                    v-text="item.text"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

        </v-card>
      </div>
      <div slot="modalContent" class="subheading font-weight-bold">
        <v-checkbox
          v-model="manualAddress"
          @change="enableManualAddress($event)"
          :color="primaryColor"
          :label="$t('postCodeLookUp.add_manually')"
          class="postcode-lookup__manualAddress"
        ></v-checkbox>
      </div>
    </dco-modal>
  </div>
</template>

<script>
import '@/_styles/components/postCodeLookUp.scss';
import CommonService from '@/_core/services/commonService';
import formFieldsMixin from '@/_core/mixins/formFieldsMixin';

export default {
  name: 'postcode-lookup',
  components: {
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  mixins: [formFieldsMixin],
  props: {
    enable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    inputData: String,
  },
  data() {
    return {
      manualAddress: false,
      postalCode: undefined,
      config: {
        enabled: this.enable,
        persistent: true,
        width: '700px',
        title: this.$t('postCodeLookUp.address_lookup.title'),
        icon: 'mdi-home-modern',
        close: true,
        addressList: [],
      },
      item: 0,
      items: [],
      selectedAdress: [],
      addressProps: [
        'postalCode',
        'buildingNumber',
        'line1',
        'line2',
        'line3',
        'line4',
        'townOrCity',
        'line5',
        'line7',
        'line6',
        // 'country',
      ],
    };
  },
  methods: {
    onSave(index) {
      this.toggleDisable(false);
      if (!this.manualAddress) {
        if (!this.selectedAdress.length) {
          this.onSelectAddress(index);
        }
        this.$emit('value', {
          ...this.selectedAdress, enabled: false, value: this.inputData, disabled: true,
        });
      } else {
        this.$emit('value', {
          0: this.addressProps, enabled: false, value: this.inputData, disabled: false,
        });
      }
    },
    onClose() {
      this.$emit('value', { enabled: false, value: this.inputData });
    },
    enableManualAddress(e) {
      this.toggleDisable(e);
      this.manualAddress = true;
    },
    toggleDisable(e) {
      this.$store.dispatch('appSettings/setAppConfig', {
        manualAddress: e,
      });
      this.$emit('value', {
        enable: e,
        fields: ['addressID', 'buildingNumber', 'addressLine1', 'addressLine2', 'addressLine3', 'addressLine4', 'townOrCity', 'addressLine5', 'addressLine7', 'addressLine6'],
      });
    },
    onSelectAddress(index) {
      const replaceMap = {
        postalCode: '',
        buildingNumber: '',
        line1: 'addressLine1',
        line2: 'addressLine2',
        line3: 'addressLine3',
        line4: 'addressLine4',
        townOrCity: '',
        line5: 'addressLine5',
        line6: 'addressLine6',
        addressId: 'addressID'
        // country: '',
      };

      this.selectedAdress.push(this.mapAddressKeys(this.addressList[index], replaceMap));
    },
    getAddress() {
      CommonService.getAddress(this.inputData).then((data) => {
        this.items = [];
        this.addressList = data;
        data.map((item) => {
          let itemsArray = Object.values(item);
          itemsArray = itemsArray.filter(Boolean);
          const itemObj = Object.assign({}, { text: itemsArray.join(', ') });
          this.items.push(itemObj);
        });
      }).catch((e) => {
        this.items = [{ text: this.$t('postCodeLookUp.address_lookup.failed') }];
      });
    },
  },
  created() {
    this.items = [{ text: this.$t('postCodeLookUp.address_lookup.loading') }];
    if (this.inputData !== this.postalCode) {
      this.postalCode = this.inputData;
      this.getAddress();
    }
  },
};
</script>
