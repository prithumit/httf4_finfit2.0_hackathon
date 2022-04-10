<template>
  <div class="wizard sticky">
    <v-app :style="{ background: gradients }">
      <v-content v-if="wizardConfig.steps" class="wizard--content">
        <v-flex class="container grid-list-lg fluid pa-sm-0">
          <v-layout row wrap>
            <v-flex class="hidden-xs-only" sm1 md1 lg1 xl1></v-flex>
            <v-flex sm12 md10 lg10 xl10 class="stepper-container pa-0 mt-9">
              <v-stepper
                v-model="stepperState"
                :alt-labels="!wizardConfig.settings.vertical"
                :vertical="wizardConfig.settings.vertical"
                class="stepper--content pa-md-2 pa-sm-0"
              >
                <stepper-radial
                  v-if="isRadialHeaderActive"
                  :config="{ steps: wizardConfig.steps, state: stepperState }"
                  class="hidden-lg-and-up wizard--verticalHeader-background"
                />
                <stepper-horizontal
                  v-if="!wizardConfig.settings.vertical"
                  :config="{ steps: wizardConfig.steps, stepperState }"
                  class="hidden-md-and-down"
                />
                <v-row
                  v-if="!(stepperState + 1 > wizardConfig.steps.length - 1)"
                  class="justify-end pt-6"
                >
                  <!-- <a
                        @click="saveContinue({ flag: 'ABORT', redirect: true })"
                        class="mr-6"
                        data-qa="discard-application"
                      >
                        <font
                          class="discard-app-text body-3 discard-app-text--underline"
                          :color="primaryColor"
                          >{{ $t("onboard.save") }}</font
                        >
                      </a> -->
                  <v-btn
                    text
                    small
                    @click="
                      saveContinue({
                        flag: 'CREATE_APPLICATION',
                        redirect: true,
                      })
                    "
                    class=""
                    data-qa="discard-application"
                    :color="primaryColor"
                  >
                    <v-icon small class="pr-1">mdi-content-save-all</v-icon>
                    {{ $t("onboard.save") }}
                  </v-btn>
                  <v-btn
                    text
                    small
                    @click="saveContinue({ flag: 'ABORT', redirect: true })"
                    class="mr-6"
                    data-qa="discard-application"
                    :color="primaryColor"
                  >
                    <v-icon small class="pr-1">mdi-close-circle-outline</v-icon>
                    {{ $t("onboard.abort.discard") }}
                  </v-btn>
                  <!-- <a
                        @click="saveContinue({ flag: 'ABORT', redirect: true })"
                        class="mr-6"
                        data-qa="discard-application"
                      >
                        <font
                          class="discard-app-text body-3 discard-app-text--underline"
                          :color="primaryColor"
                          >{{ $t("onboard.abort.discard") }}</font
                        >
                      </a> -->
                </v-row>
                <dco-stepper
                  v-for="(step, index) in wizardConfig.steps"
                  v-if="step.enabled"
                  :config="{
                    index,
                    stepsNo: wizardConfig.steps.length,
                    settings: wizardConfig.settings,
                  }"
                  :key="index"
                  @changeStepperIndex="stepChange($event)"
                >
                  <stepper-head
                    v-if="wizardConfig.settings.vertical"
                    :config="{
                      step,
                      index,
                      stepperState,
                      isVertical: wizardConfig.settings.vertical,
                    }"
                    slot="header"
                  />
                  <v-row
                    :justify="step.justify"
                    :style="{ height: setHeight }"
                    auto-grow
                    no-gutters
                    slot="content"
                    id="stickyContent"
                  >
                    <v-col
                      v-for="(component, indexC) in step.component"
                      :key="indexC"
                      :cols="component.size.xs"
                      :xs="component.size.xs"
                      :sm="component.size.sm"
                      :md="component.size.md"
                      :lg="component.size.lg"
                      :xl="component.size.xl"
                    >
                      <dco-expandable
                        :config="{
                          isEnabled: component.isExpandable,
                          label: component.label,
                        }"
                        slot="content"
                      >
                        <component
                          v-if="component.enabled"
                          :is="component.name"
                          @getConfig.once="getComponentConfiguration($event)"
                          :config="{
                            componentConfig,
                            label: component.label,
                            schemaName: component.schemaName,
                            icon: component.icon,
                            isEnabled: component.isExpandable,
                            name: component.schemaName,
                            validation: component.validation,
                            state: stepperState,
                            signedOffStatus,
                          }"
                          @continue="saveContinue($event)"
                          @update="handleComponentUpdate($event)"
                          @navigate="navigateTo"
                          slot="expandContent"
                        ></component>
                      </dco-expandable>
                    </v-col>
                    <!-- <v-row
                      v-if="applicationStatus === 'DRAFT'"
                      class="justify-end"
                    >
                      <a
                        @click="saveContinue({ flag: 'ABORT', redirect: true })"
                        class="mr-6"
                        data-qa="discard-application"
                      >
                        <font
                          class="discard-app-text body-3 discard-app-text--underline"
                          :color="primaryColor"
                          >{{ $t("onboard.save") }}</font
                        >
                      </a>
                      <a
                        @click="saveContinue({ flag: 'ABORT', redirect: true })"
                        class="mr-6"
                        data-qa="discard-application"
                      >
                        <font
                          class="discard-app-text body-3 discard-app-text--underline"
                          :color="primaryColor"
                          >{{ $t("onboard.abort.discard") }}</font
                        >
                      </a>
                    </v-row> -->
                  </v-row>
                </dco-stepper>
                <stepper-footer
                  :config="{
                    steps: wizardConfig.steps,
                    component: componentConfig,
                    state: stepperState,
                    applicationStatus,
                    index: stepperState - 1,
                    status: componentConfig.model,
                    failed: failedCustomer,
                    navigate,
                  }"
                  :error="error"
                  @changeStepperIndex="stepChange($event)"
                  @continue="saveContinue($event)"
                  class="mt-0"
                />
              </v-stepper>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Stepper from "@/components/DCO-Stepper/Stepper.vue";
import deviceScreenMixin from "@/_core/mixins/deviceScreenMixin";
import historyMixin from "@/_core/mixins/historyMixin";
import events from "@/_core/helpers/event";
import "@/_styles/components/wizard.scss";

export default {
  name: "Wizard",
  mixins: [deviceScreenMixin, historyMixin],
  components: {
    "dco-stepper": Stepper,
    "stepper-head": () => import("@/components/DCO-Stepper/StepperHead.vue"),
    "stepper-horizontal": () =>
      import("@/components/DCO-Stepper/StepperHorizontal.vue"),
    "stepper-radial": () =>
      import("@/components/DCO-Stepper/StepperRadial.vue"),
    "stepper-footer": () =>
      import("@/components/DCO-Stepper/StepperFooter.vue"),
    "dco-expandable": () =>
      import("@/components/DCO-ExpansionPanel/ExpansionPanel.vue"),
    Form: () => import("@/components/DCO-Form/Form.vue"),
    PhotoCapture: () => import("@/pages/_common/PhotoCapture.vue"),
    CreateCredentials: () =>
      import("@/components/DCO-Credentials/CreateCredentials.vue"),
    ReviewDetailsAndConsent: () =>
      import("@/pages/ReviewAndConsent/ReviewDetailsAndConsent.vue"),
  },
  created() {
    this.saveContinue({ flag: "CREATE_APPLICATION", init: true });
  },
  props: {
    wizardConfig: {
      type: Object,
      default() {
        return {
          steps: [],
          settings: {},
        };
      },
    },
    componentConfig: {
      type: Object,
      default: undefined,
    },
    error: {
      type: Boolean,
    },
  },
  data() {
    return {
      stepperState: 1,
      isRadialHeaderActive: true,
      steps: [],
      reduceStepCountBy: 2,
      customerObject: {},
      componentGetter: {},
      cutomerId: "",
      applicationStatus: "DRAFT",
      componentValidity: {},
      validComponents: {},
      signedOffStatus: false,
      failedCustomer: false,
      display: {},
      navigate: false,
    };
  },
  methods: {
    stepChange(event) {
      if (event.state === "increment" && this.error) {
        this.navigate = false;
        this.stepperState = event
          ? this.stepperState + event.count
          : this.stepperState;
      } else if (event.state === "decrement") {
        this.navigate = true;
        this.stepperState = event
          ? this.stepperState - event.count
          : this.stepperState;
      } else if (event.state === "navigate") {
        this.navigate = true;
        this.stepperState = event.stepperState;
        this.currentstate = this.stepperState;
      }

      this.getComponentConfiguration(this.stepperState);
    },
    getComponentConfiguration(state) {
      const currentState = isNaN(parseInt(state)) ? this.stepperState : state;
      const currentValue = currentState === 0 ? currentState + 1 : currentState;

      this.$emit("componentConfig", {
        components: this.wizardConfig.steps[currentValue - 1].component,
      });
    },
    getEnabledComponents(componentObj) {
      return componentObj.filter((component) => component.enabled);
    },
    handleComponentUpdate({
      data = { applicationStatus: undefined },
      schema = undefined,
      label = undefined,
      schemaName = undefined,
    }) {
      const { applicationStatus } = data;
      const state = 1;
      const display = Object.assign(this.display, {
        [label]: {
          label,
          schema,
          state,
        },
      });

      this.signedOffStatus = this.componentConfig.store
        ? this.componentConfig.store.applicationStatus === "SIGNOFF"
        : false;
      this.failedCustomer = this.componentConfig.store
        ? this.componentConfig.store.failedCustomer
        : false;
      this.applicationStatus = applicationStatus || "DRAFT";
      this.componentGetter = {
        schemaName,
        data,
        state,
        display,
      };
      this.$emit("update", this.componentGetter);
    },
    saveContinue(status) {
      this.$emit("save", status);
    },
    navigateTo(step) {
      this.stepChange({
        state: "navigate",
        stepperState: step,
      });
    },
  },
};
</script>
<style scoped>
.wizard--content {
  background: #f8f8f8;
  -webkit-transition: background-color 0.3s ease;
}
</style>
