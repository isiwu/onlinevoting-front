
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import * as views from './views.js';
import store from '../store/index.js'

export const routePaths = {
  home: '/',
  contestants: '/contestants',
  voting: '/voting',
  votingPresidents: 'presidents',
  votingSenates: 'senates/:state/:district',
  votingHouseOfReps: 'houseofreps/:state/:district/:constitutency',
  confirmVotes: '/confirm-votes',
  voteHistory: '/vote-history',
  result: '/result',
  resultPresidents: 'presidents',
  resultSenates: 'senates/:state',
  resultHouseOfReps: 'house-of-reps/:state',
  createLoginDetails: '/create-account',
  loginDetailsOk: '/registration-ok',
  login: '/login',
  registerVoter: '/register-voter',
  registerContestant: '/register-contestant',
  unlockAccount: '/unlock-account',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
  changePassword: '/change-password',
  about: '/about',
},
routes = [
  {
    path: routePaths.home,
    name: 'home',
    component: views.Home,
    beforeEnter: (to, from, next) => {
      let success = to.query.success,
      message = to.query.message,
      email = to.query.email,
      path = to.query.path;
      
      if (message) {
        if (success === 'false') success = false;
        else if (success === 'true') success = true;

        store.dispatch('setAccountNotification', {success,message});
        if (path) {
          sessionStorage.setItem('normalUrl', 'yes');
          return next(path);
        }

        sessionStorage.removeItem('normalUrl');
        return next()
      }

      if (email) return next(`${path}?email=${email}`);
      if (path) return next(path);
      next();
    }
  },
  {
    path: routePaths.contestants,
    name: 'contestants',
    component: views.ContestantList,
    beforeEnter: (to, from, next) => {
      const voted = sessionStorage.getItem('voted');

      if (voted !== 'true') return next('/not-found');
      next()
    }
  },
  {
    path: routePaths.voting,
    redirect: '/voting/presidents'
  },
  {
    path: routePaths.voting,
    name: 'voting',
    component: views.Voting,
    beforeEnter: (to, from, next) => {
      let id = sessionStorage.getItem('id'),
      voted = sessionStorage.getItem('voted');

      if (!id) {
        store.dispatch('setAccountNotification', {success: false, message: 'Please complete your vote registration!'});
        return next('/register-voter');
      }

      if (voted === 'true') {
        store.dispatch('setVoteStatusNotification', {success: false, message: 'You cannot vote twice. Thanks!'});

        return next('/contestants');
      }

      next();
    },
    children: [
      {
        path: routePaths.votingPresidents,
        name: 'votingPresidents',
        component:views.Presidents,
      },
      {
        path: routePaths.votingSenates,
        name: 'votingSenates',
        props: true,
        component: views.Senates,
      },
      {
        path: routePaths.votingHouseOfReps,
        name: 'votingHouseOfReps',
        props: true,
        component: views.HouseOfReps,
      }
    ]
  },
  {
    path: routePaths.confirmVotes,
    name: 'confirmVotes',
    component: views.VoteList,
  },
  {
    path: routePaths.result,
    redirect: '/result/presidents',
  },
  {
    path: routePaths.result,
    component: views.Result,
    children: [
      {
        path: routePaths.resultPresidents,
        name: 'resultPresidents',
        component: views.ResultPresidents
      },
      {
        path: routePaths.resultSenates,
        name: 'resultSenates',
        props: true,
        component: views.ResultSenates,
      },
      {
        path: routePaths.resultHouseOfReps,
        name: 'resultHouseOfReps',
        props: true,
        component: views.ResultHouseOfReps,
      },
    ]
  },
  {
    path: routePaths.createLoginDetails,
    name: 'createLoginDetails',
    component: views.LoginDetailCreation,
  },
  {
    path: routePaths.loginDetailsOk,
    name: 'loginDetailsOk',
    component: views.LoginDetailsOk,
  },
  {
    path: routePaths.login,
    name: 'login',
    component: views.LoginBox,
  },
  {
    path: routePaths.registerVoter,
    name: 'registerVoter',
    component: views.RegisterVoter,
    beforeEnter: (to, from, next) => {
      let admin = sessionStorage.getItem('admin'),
      normalUrl = sessionStorage.getItem('normalUrl'),
      email = to.query.email,
      register = to.query.register;

      if (normalUrl) {
        sessionStorage.removeItem('normalUrl')
        return next();
      }
      if (admin) return next();
      if (register) return next();

      if (email) {
        axios.get('/api/users/validate', {
          params: {email}, 
          baseURL: process.env.NODE_ENV === 'production'?'https://onlinevoting.herokuapp.com/':'/',
          withCredentials: true,
        })
        .then(response => {
          if (response.data.message) {
            store.dispatch('setAccountNotification', response.data);
            sessionStorage.setItem('normalUrl', 'yes');
            return next(to.path); 
          }

          next('/not-found');
        })
      } else {
        next('/not-found');
      }
    }
  },
  {
    path: routePaths.registerContestant,
    name: 'registerContestant',
    component: views.RegisterContestant,
    beforeEnter: (to, from, next) => {
      let admin = sessionStorage.getItem('role');

      if (admin === 'admin') return next();
      next('/not-found');

    }
  },
  {
    path: routePaths.about,
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: routePaths.unlockAccount,
    component: views.AccountUnlock,
    name: 'unlockAccount',
  },
  {
    path: routePaths.forgetPassword,
    component: views.PasswordForget,
    name: 'forgetPassword',
    beforeEnter: (to, from, next) => {
      next();
    }
  },
  {
    path: routePaths.resetPassword,
    component: views.PasswordReset,
    name: 'resetPassword',
    beforeEnter: (to, from, next) => {
      let email = to.query.email;

      if (email) {
        store.dispatch('updateVoterEmail', email);
      }
      
      next();
    }
  },
  {
    path: routePaths.changePassword,
    component: views.PasswordChange,
    name: 'changePassword',
  },
  {
    path: routePaths.voteHistory,
    component: views.VoteHistory,
    name: 'voteHistory',
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: views.NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'current',
});

router.beforeEach((to, from, next) => {
  if (to.name in routePaths) {
    let loggedIn = sessionStorage.getItem('loggedIn');

    if (!loggedIn) {
      
      if (to.path === '/') return next();
      if (to.path === '/login') return next();
      if (to.path === '/create-account') return next();
      if (to.path === '/register-voter') return next();
      if (to.path === '/registration-ok') return next();
      if (to.name === 'resultPresidents' || to.name === 'resultSenates' || to.name === 'resultHouseOfReps') return next();
      if (to.path === '/unlock-account') return next();
      if (to.path === '/forget-password') return next();
      if (to.path === '/reset-password') return next();
      return next('/login');
    } else {
      return next();
    }
  } else {
    next('/not-found');
  } 
});

export default router
