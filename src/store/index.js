import { createStore } from 'vuex';
import user from './modules/user.js';
import contestant from './modules/contestant.js';
import voter from './modules/voter.js';
import states from './modules/state.js';
import parties from './modules/parties.js';

export default createStore({
  modules: {
    user,
    contestant,
    voter,
    states,
    parties,
  }
})
