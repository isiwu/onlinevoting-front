import axios from 'axios'

const state = {
  user: {},
  createAccountNotification: null,
},
mutations = {
  UPDATE_USER(state, payload) {
    state.user = payload;
  },
  CREATE_ACCOUNT_NOTIFICATION(state, payload) {
    state.createAccountNotification = payload;
  },
},
actions = {
  createUser({commit}, payload) {
    commit('LOADING_PENDING');

    return axios.post('/api/users/create', payload, {
      baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/'
    })
    .then(response => {
      commit('CREATE_ACCOUNT_NOTIFICATION', response.data);
      commit('LOADING_SUCCESS');
    })
    .catch(error => {
      commit('CREATE_ACCOUNT_NOTIFICATION', error.response.data);
      commit('LOADING_SUCCESS');
    })
  },
  getUser({commit}, payload) {
    commit('LOADING_PENDING');

    return axios.get(`/api/users/${payload}`, {
      baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/'
    })
    .then(response => {
      commit('UPDATE_USER', response.data);
      commit('LOADING_SUCCESS');
    })
    .catch(error => {
      console.log(error.response.data.message);
      commit('LOADING_SUCCESS');
    })
  },
},
getters = {
  user: state => state.user,
  notificationCreateAccount: state => state.createAccountNotification,
},
userModule = {
    state,
    mutations,
    actions,
    getters,
};

export default userModule