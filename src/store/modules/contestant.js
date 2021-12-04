import axios from 'axios';
axios.defaults.withCredentials = true;

const state = {
    contestants: [],
    newVote: false,
},

mutations = {
    UPDATE_CONTESTANTS(state, payload) {
        state.contestants = payload;
    },
    UPDATE_VOTE_STATUS(state, payload) {
        state.newVote = payload;
    }
},
actions = {
    getContestants({commit}) {
        return axios.get('/api/contestants', {
            baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
        })
        .then(response => {
            commit('UPDATE_CONTESTANTS', response.data.message);
        })
        .catch((error) => {
            console.log(`contestants error: ${error.message}`)
            commit('SET_NOTIFICATION', error.response.data);
            return Promise.reject();
        })
    },
    registerContestant({commit}, payload) {
        commit('LOADING_PENDING'); //loading pending

        return axios.post('/api/contestants/register', payload, {
            baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
        })
        .then(response => {
            commit('SET_NOTIFICATION', response.data);
            commit('LOADING_SUCCESS');  //loading complete
        })
        .catch(error => {
            commit('SET_NOTIFICATION', error.response.data);
            commit('LOADING_SUCCESS');  //loading complete
        })
    },
    updateContestants({commit}, payload) {
        commit('UPDATE_CONTESTANTS', payload);
    },
    updateVoteStatus({commit}, payload) {
        commit('UPDATE_VOTE_STATUS', payload);
    }
},
getters = {
    contestants: state => state.contestants,
    contestantsByPosition: state => (position, ...args) => {
        if (position === 'president') {
            return state.contestants.filter(contestant => {
                return contestant.position.toLowerCase() === position.toLowerCase();
            }) 

        } else if (position === 'senate') {
            if (!args[1]) { // get senate candidates by state
                return state.contestants.filter(contestant => contestant.position.toLowerCase() === position.toLowerCase() && contestant.state.toLowerCase() === args[0].toLowerCase()) 
            }
            
            // get senate candidates by state and district
            return state.contestants.filter(contestant => contestant.position.toLowerCase() === position.toLowerCase() && contestant.state.toLowerCase() === args[0].toLowerCase() && contestant.district.toLowerCase().replace(/-|\//g,' ') === args[1].toLowerCase())

        } else if (position === 'house of representative') {
            if (!args[1]) { // get house candidates by state
                return state.contestants.filter(contestant => contestant.position.toLowerCase() === position.toLowerCase() && contestant.state.toLowerCase() === args[0].toLowerCase())
            }

            // get house candidates by state and constitutency
            if (!args[2]) { 
                return state.contestants.filter(contestant => contestant.position.toLowerCase() === position.toLowerCase() && contestant.state.toLowerCase() === args[0].toLowerCase() && contestant.constitutency.toLowerCase().replace(/-|\//g, ' ') === args[1].toLowerCase().replace(/-|\//g,' '))
            }

            // get house candidates by state and district and constitutency
            return state.contestants.filter(contestant => {
                return contestant.position.toLowerCase() === position.toLowerCase() && contestant.state.toLowerCase() === args[0].toLowerCase() && contestant.district.toLowerCase() === args[1].toLowerCase() && contestant.constitutency.toLowerCase() === args[2].toLowerCase();
            })
        } 
    },
    voteStatus: state => state.newVote,
},
contestantModule = {
    state,
    mutations,
    actions,
    getters
}

export default contestantModule;