const data = {
  config: {},
};

const getters = {
  config: state => state.config,
};

const mutations = {
  updateAppConfig(state, payload) {
    state.config = Object.assign(state.config, payload);
  },
  removeAppConfig(state) {
    state.config = {};
  },
};

const actions = {
  setAppConfig({ commit }, payload) {
    commit('updateAppConfig', payload);
  },
  removeAppConfig({ commit }) {
    commit('removeAppConfig');
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  mutations,
  actions,
};
