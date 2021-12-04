import axios from 'axios';
axios.defaults.withCredentials = true;

const state = {
  parties: []
},

mutations = {
  UPDATE_PARTIES(state, payload) {
    state.parties = payload;
  }
},

actions = {
  getParties({commit}) {
    return axios.get('/api/parties', {
      baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
    })
    .then(response => {
      commit('UPDATE_PARTIES', response.data.message);
    })
    .catch(() => {
      return Promise.reject();
    })
  }
},

getters = {
  parties: state => state.parties,
},

partiesModule = {
    state,
    mutations,
    actions,
    getters,
};

export default partiesModule;