import axios from "axios";
axios.defaults.withCredentials = true;

const state = {
  states: [],
  statesUnderContestants: [],
},

mutations = {
  UPDATE_STATES(state, payload) {
    state.states = payload;
  },
  UPDATE_STATESUNDERCONTESTANTS(state, payload) {
    state.statesUnderContestants = payload;
  },
  SET_NOTIFICATION(state, payload) {
    state.stateNotification = payload;
  }
},

actions = {
  getStates({commit}) {
    return axios.get('/api/states', {
      baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
    })
    .then(response => {
      commit('UPDATE_STATES', response.data.message);

      return axios.get('/api/states/under-contestants', {
        baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
      })
    })
    .then(response => {
      commit('UPDATE_STATESUNDERCONTESTANTS', response.data.message);
    })
    .catch(error => {
      console.log(error)
      commit('SET_NOTIFICATION', error.response.data);

      return Promise.reject();
    })
  },
},
getters = {
  states: state => state.states.map(state => state.name),
  dataByState: state => (byState,data) => {
    let mainState = state.states.find(currentState => {
      return currentState.name.toLowerCase().replace(/-/g, ' ') === byState.toLowerCase().replace(/-/g, ' ');
    });

    if (data === 'districts') return mainState.districts;
    if (data === 'constituencies') return mainState.constituencies;
    if (data === 'localGovts') return mainState.localGovts;
  },
  statesUnderContestants: state => state.statesUnderContestants.map(state => state.name),
  dataByVoterState: state => (voterState, data) => {
    let mainState = state.statesUnderContestants.find(currentState => {
      return currentState.name === voterState;
    });
    
    if (data === 'districts') return mainState.districts;
    if (data === 'constituencies') return mainState.constituencies;
    if (data === 'localGovts') return mainState.localGovts;
  },
},

stateModule = {
    state,
    mutations,
    actions,
    getters
};

export default stateModule