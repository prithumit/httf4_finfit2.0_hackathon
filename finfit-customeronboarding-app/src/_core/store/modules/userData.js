const data = {
  userData: {},
};

const getters = {
  userData: state => state.userData,
};

const mutations = {
  updateUserData(state, payload) {
    state.userData = Object.assign(state.userData, payload);
  },
  removeUserData(state) {
    state.userData = {};
  },
};

const actions = {
  setUserData({ commit }, payload) {
    commit('updateUserData', payload);
  },
  removeUserData({ commit }) {
    commit('removeUserData');
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  mutations,
  actions,
};
