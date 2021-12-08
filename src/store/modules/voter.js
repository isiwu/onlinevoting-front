import axios from 'axios';
axios.defaults.withCredentials = true;

const state = {
    user: {},
    votingAccount: {},
    votes: [],
    loading: false,
    notification: null,
    voterEmail: '',
},
mutations = {
    UPDATE_USER(state, payload) {
        state.user = payload;
    },
    UPDATE_VOTER(state, payload) {
        state.votingAccount = payload;
    },
    LOADING_PENDING(state) {
        state.loading = true;
    },
    LOADING_SUCCESS(state) {
        state.loading = false;
    },
    ADD_VOTE(state, payload) {
        state.votes.push(payload);
    },
    RESET_VOTES(state) {
        state.votes = [];
    },
    REMOVE_VOTE(state, payload) {
        state.votes.splice(payload.prevVoteIndex, payload.number);
    },
    UPDATE_VOTES(state, payload) {
        state.votes = payload;
    },
    SET_NOTIFICATION(state, payload) {
        state.notification = payload;
    },
    UPDATE_VOTER_EMAIL(state, payload) {
        state.voterEmail = payload;
    }

},
actions = {
    createAccount({commit}, payload) {
      commit('LOADING_PENDING');

      return axios.post('/api/users/create', payload, {
        baseURL: 'https://onlinevoting.herokuapp.com/'
      })
      .then(response => {
        commit("SET_NOTIFICATION", response.data)
        commit('LOADING_SUCCESS');
      })
      .catch(error => {
        commit("SET_NOTIFICATION", error.response.data)
        commit('LOADING_SUCCESS');
      })
    },
    // POST request for login action
    login({commit}, payload) {
        commit('LOADING_PENDING'); //login pending

        return axios.post('/api/users/login', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then((response) => {
            const [user,votingAccount={}] = response.data.message;

            sessionStorage.setItem('email', user.email);
            sessionStorage.setItem('role', user.role)

            for (const key in votingAccount) {
                if (Object.hasOwnProperty.call(votingAccount, key) ) {
                    if (key === '_id') {
                        sessionStorage['id'] = votingAccount[key];
                    }
                    if (key === 'dateOfBirth' || key === 'nin' || key === 'password' || key === 'email' || key === 'votes') {
                        continue;
                    }

                    if (key === 'name') {
                      sessionStorage['name'] = votingAccount.fullName;

                      continue;
                    }
                    
                    sessionStorage[key] = votingAccount[key];
                }
            }
            
            sessionStorage.setItem('loggedIn', 'loggedIn');

            commit('UPDATE_USER', user);
            commit('UPDATE_VOTER', votingAccount);
            commit('LOADING_SUCCESS');  //login success
        })
        .catch((error) => {
            const [message, user] = error.response.data.message;

            if (user) commit('UPDATE_USER', user);
            commit("SET_NOTIFICATION", {success: error.response.data.success, message})
            commit('LOADING_SUCCESS');  //login complete
            throw new Error();
        })
    },
    logout({commit}) {
        return axios.get('/api/users/logout', {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(() => {
            for (const key in sessionStorage) {
                if (Object.hasOwnProperty.call(sessionStorage, key)) {
                    delete sessionStorage[key];
                }
            }
            commit('UPDATE_VOTER', {});
        })
    },
    registerVoter({commit,state}, payload) {
        commit('LOADING_PENDING'); //loading pending

        return axios.post('/api/voters/create', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then((response) => {
            commit("SET_NOTIFICATION", response.data);
            sessionStorage.setItem('id', state.user._id)
            commit('LOADING_SUCCESS');  //loading success
        })
        .catch((error) => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');  //loading success

            return Promise.reject();
        })
    },
    createLoginDetails({commit}, payload) {
        commit('LOADING_PENDING'); //loading pending

        return axios.post('/api/users/create', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(response => {
            commit("SET_NOTIFICATION", response.data);
            commit('LOADING_SUCCESS');  //loading success
        })
        .catch(error => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');  //loading success

            return Promise.reject();
        })
    },
    addVote({state, commit}, payload) {
        return new Promise((resolve) => {
            if (!state.votes.some(vote => vote.position === payload.position
            )) {
                commit('ADD_VOTE', payload);
            } else {
                let prevVoteIndex = state.votes.findIndex(vote => vote.position === payload.position);

                //Remove previous vote
                commit('REMOVE_VOTE', {prevVoteIndex: prevVoteIndex, number: 1});

                //Add new vote
                commit('ADD_VOTE', payload);
            }

            resolve();
        })
    },
    submitVotes({state, commit}) {
        let filteredVotes = state.votes.map(vote => {
            return {_id: vote.id, position: vote.position}
        }),
        voter = state.votingAccount,
        empty = true;

        for (const key in voter) {
            if (Object.hasOwnProperty.call(voter, key)) {
                empty = false;
                break;
            }
        }

        if (empty) {
            for (const key in sessionStorage) {
                if (Object.hasOwnProperty.call(sessionStorage, key)) {
                    voter[key] = sessionStorage[key];
                }
            }
        }

        return axios.put('/api/voters/vote', {votes: filteredVotes, voter}, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then((response) => {
            const [contestants, voter, message] = response.data.message;

            sessionStorage.setItem('voted', 'true');

            commit('UPDATE_CONTESTANTS', contestants);
            commit('UPDATE_VOTER', voter);
            commit("SET_NOTIFICATION", {success:true,message:message});
        })
        .catch((error) => {
            sessionStorage.removeItem('voted');

            commit("SET_NOTIFICATION", {success:false,message:error.response.data.message});
            return Promise.reject();
        })
    },
    resetVotes({commit}) {
        return new Promise((resolve) => {
            commit('RESET_VOTES');
            resolve()
        })
    },
    getVoterVotes({commit}, payload) {
        return axios.get(`/api/voters/${payload}`, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(response => {
            commit('UPDATE_VOTES', response.data.message)
        })
        .catch(() => {
            return Promise.reject();
        })
    },
    setAccountNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    setVoteStatusNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    setLoginNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    unlockAccount({commit}, payload) {
        commit('LOADING_PENDING');
        return axios.post('/api/users/unlock-account', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(response => {
            commit("SET_NOTIFICATION", response.data);
            commit('LOADING_SUCCESS');
        })
        .catch(error => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');
            return Promise.reject();
        })
    },
    forgetPassword({commit}, payload) {
        commit('LOADING_PENDING');
        return axios.post('/api/users/forget-password', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then((response) => {
            commit("SET_NOTIFICATION", response.data);
            commit('LOADING_SUCCESS');
        })
        .catch(error => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');
            return Promise.reject();
        })
    },
    resetPassword({commit}, payload) {
        commit('LOADING_PENDING');
        return axios.post('/api/users/reset-password', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(response => {
            commit("SET_NOTIFICATION", response.data);
            commit('LOADING_SUCCESS');
        })
        .catch(error => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');
            return Promise.reject();
        })
    },
    changePassword({commit}, payload) {
        commit('LOADING_PENDING');
        return axios.post('/api/users/change-password', payload, {
            baseURL: 'https://onlinevoting.herokuapp.com/'
        })
        .then(response => {
            commit("SET_NOTIFICATION", response.data);
            commit('LOADING_SUCCESS');
        })
        .catch(error => {
            commit("SET_NOTIFICATION", error.response.data);
            commit('LOADING_SUCCESS');
            return Promise.reject();
        })
    },
    updateVoterEmail({commit}, payload) {
        commit('UPDATE_VOTER_EMAIL', payload);
    },
    setUnlockAccountNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    setForgetPasswordNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    setResetPasswordNotification({commit}, payload) {
        commit("SET_NOTIFICATION", payload);
    },
    unsetNotification({commit}) {
        commit('SET_NOTIFICATION', null);
    },
},
getters = {
    voter: state => state.votingAccount,
    voterAccount: state => state.user,
    voterEmail: state => state.voterEmail,
    loading: state => state.loading,
    votesByVoter: state => state.votes,
    notification: state => state.notification,
},

voterModule = {
    state,
    mutations,
    actions,
    getters
};

export default voterModule;