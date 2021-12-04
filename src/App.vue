<script>
import { io } from 'socket.io-client';
import {routePaths} from './router/index.js';

export default {
  name: 'App',
  data() {
    return {
      states: [],
      navbarBurgersClicked: false,
      menuOpen: false,
      dropMenuClicked: false,
      hideNav: false,
      hideFooter: false,
      loggedIn: false,
      isAdmin: false,
      hasVoted: false,
      hideHeaderMenu: false,
      user: '',
    }
  },
  watch: {
    $route(to) {
      if (!routePaths[to.name]) this.hideHeaderMenu = true;

      this.user = sessionStorage.getItem('email');
      this.loggedIn = sessionStorage.getItem('loggedIn')? true:false;
      this.isAdmin = sessionStorage.getItem('role') === 'admin'? true:false;
      this.hasVoted = sessionStorage.getItem('voted') === 'true'? true:false;

      if (to.path === '/registration-ok') {
        this.hideFooter = true
      }
      
      if (!routePaths[to.name]) {
        this.hideNav = true; 
        this.hideFooter = true;
      }

      if (this.$route.name === 'contestants' && sessionStorage.getItem('voted') === 'true') {
        for (const ref in this.$refs) {
          if (Object.hasOwnProperty.call(this.$refs, ref) && this.$refs[ref].nodeName?.toLowerCase() === 'a') {
            this.$refs[ref].classList.remove('current');
          }
        }

        this.$refs.result.classList.add('current');
      }
    }
  },
  created() {
    if (!this.$store.getters.contestants.length) {
      this.$store.dispatch('getContestants');
    }

    if (!this.$store.getters.statesUnderContestants.length) {
      this.$store.dispatch('getStates')
      .then(() => {
        this.states = this.$store.getters.states;
      })
    } else {
      this.states = this.$store.getters.states;
    }

    window.onclick = (evt) => {
      const userMenuEl = this.$refs.userMenu;
      if (!evt.target.parentNode.classList.contains('user-menu')) userMenuEl.classList.remove('show');
    }

    //set up client socket io 
    const socketUrl = process.env.NODE_ENV === 'production'?'onlinevoting.herokuapp.com':'ws://localhost:3000',
    socket = io(socketUrl);

    socket.on('new vote', (data) => {
      this.$store.dispatch('updateContestants', data);
      this.$store.dispatch('updateVoteStatus');
    })
  },
  methods: {
    districtByState(state, data) {
      return this.$store.getters.dataByState(state, data);
    },
    showUserMenu() {
      const menuEl = this.$refs.userMenu;
      menuEl.classList.toggle('show');
    },
    hideMenu(evt) {
      let target = evt.target;

      if (target.classList.contains('vote') && sessionStorage.getItem('voted') === 'true') {
        target.classList.remove('current');
        this.$refs.result.classList.add('current');
      }

      if (target.nodeName.toLowerCase() === 'a') {

        if (target.parentNode.classList.contains('dropside')) {

          let nextElementSibling = this.getNextElement(target);
          nextElementSibling.classList.toggle('open-menu');

        } else {
          this.targetNotDropSide();

        }

      } else if (target.nodeName.toLowerCase() === 'i') {

        if (target.parentNode.parentNode.classList.contains('dropside')) {

          let nextElementSibling = this.getNextElement(target);
          nextElementSibling.classList.toggle('open-menu');

        } else {

          this.targetNotDropSide();

        }
      }
    },
    openMainMenuOnClick(evt) {
      this.toggleMenu(evt.target, 'dropdown-content');
    },
    openSubMenuOnClick(evt) {
      evt.stopPropagation();
      this.toggleMenu(evt.target, 'dropside-content');
    },
    openMenuOnSmallScreen() {
      if (this.navbarBurgersClicked) {
        this.navbarBurgersClicked = false;
        this.menuOpen = false;
      } else {
        this.navbarBurgersClicked = true;
        this.menuOpen = true;
      }
    },
    toggleMenu(target, className) {
      let nextElementSibling = this.getNextElement(target);
      let dropEls = document.getElementsByClassName(className);
      
      for (let index = 0; index < dropEls.length; index++) {
        if (dropEls[index] !== nextElementSibling) {
          dropEls[index].classList.remove('open-menu');
        }
      }

      nextElementSibling.classList.toggle('open-menu');
    },
    updateActiveLink(evt) {
      const target = evt.target,
      mainLinks = document.getElementsByClassName('current');

      for (const navitem in mainLinks) {
        if (Object.hasOwnProperty.call(mainLinks, navitem)) {
          mainLinks[navitem].classList.remove('current');
        }
      }

      if (target.nodeName.toLowerCase() === 'i') {
        const parentEl = target.parentNode;
        if (!parentEl.classList.contains('main-navitem')) {
          parentEl.parentNode.previousSibling.classList.add('current');
          parentEl.classList.add('current')
        } else {
          parentEl.classList.add('current');
        }
      } else {
        if (!target.classList.contains('main-navitem')) {
          target.parentNode.previousSibling.classList.add('current');
          target.classList.add('current');
        } else {
          target.classList.add('current');
        }
      } 
    },
    getNextElement(target) {
      if (target.nodeName.toLowerCase() === 'a') {
        return target.nextElementSibling
      } else if (target.nodeName.toLowerCase() === 'i') {
        return target.parentNode.nextElementSibling
      }
    },
    targetNotDropSide() {
      this.dropMenuClicked = true;

      /*reset dropMenuClicked data at the next tick to hide menu after click */
      this.$nextTick(() => {
        setTimeout(() => {
          this.dropMenuClicked = false;
        },10);
      })
    },
    voteHistory() {
      const voted = sessionStorage.getItem('voted') === 'true'?true:false;
      const userMenuEl = this.$refs.userMenu;
      userMenuEl.classList.toggle('show');

      if (!voted) return this.$router.push({name: 'votingPresidents'});

      this.$router.push({name: 'voteHistory'})
    },
    changePassword() {
      const menuEl = this.$refs.userMenu;
      menuEl.classList.toggle('show');
      
      this.$router.push({name: 'changePassword'})
    },
    logout() {
      this.$store.dispatch('logout')
      .then(() => {
        const userMenuEl = this.$refs.userMenu;
        userMenuEl.classList.toggle('show');

        this.$router.push({name: 'login'});
      })
    },
  }
}
</script>

<template>
<div v-show="!hideHeaderMenu" class="container-login">
  <div class="position-right">
    <div v-show="loggedIn" class="user-menu">
      <button class="button is-link dropbtn" @click.prevent="showUserMenu">{{user}} <i class="fas fa-caret-down ml-2"></i></button>
      <div ref="userMenu" class="dropdown-user-menu">
        <div class="box">
          <p class="level-left"><a @click.prevent="voteHistory" class="">VOTED <span class="tag has-text-right ml-6" :class="{'is-success':hasVoted,'is-link':!hasVoted}">{{ hasVoted }}</span></a></p>
          <p><a @click.prevent="changePassword">CHANGE PASSWORD</a></p>
          <p><a class="" @click="logout">LOGOUT</a></p>
        </div>
      </div>
    </div>
    <button v-show="!loggedIn" class="button is-link is-outlined"><router-link to="/login">SIGN IN</router-link></button>
    <button v-show="!loggedIn" class="button is-link is-outlined"><router-link to="/create-account">REGISTER</router-link></button>
  </div>
</div>
<nav role="navigation" v-show="!hideNav">
  <ul id="navbar" :class="{admin:isAdmin}">
    <li class="nav" id="home" @click.capture="updateActiveLink"><router-link to="/" ref="home" class="navitem main-navitem">HOME</router-link></li>
    <li :class="[{responsive:navbarBurgersClicked},'dropdown','nav']" @click.prevent.capture="openMainMenuOnClick">
      <a ref="party" href="javascript:void(0);" class="navitem dropbtn main-navitem">PARTIES <i class="fas fa-chevron-down"></i></a>
      <div @click.capture="hideMenu" :class="[{hide:dropMenuClicked},'dropdown-content', 'parties']">
        <a href="javascript:void(0);" class="navitem party">pdp</a>
        <a href="javascript:void(0);" class="navitem party">apc</a>
        <a href="javascript:void(0);" class="navitem party">apga</a>
      </div>
    </li>
    <li :class="[{responsive:navbarBurgersClicked},'nav']" @click.capture="hideMenu"><router-link ref="vote" to="/voting/presidents" class="navitem main-navitem vote">VOTE</router-link></li>
    <li :class="[{responsive:navbarBurgersClicked},'dropdown','nav']" >
      <a ref="result" href="javascript:void(0);" class="navitem dropbtn main-navitem" @click.prevent="openMainMenuOnClick">RESULT <i class="fas fa-chevron-down"></i></a>  
      <div  :class="[{hide:dropMenuClicked},'dropdown-content']" data-ref="results">
        <span @click.capture="hideMenu"><router-link to="/result/presidents" class="navitem">presidents</router-link></span>
        <div class="dropside senates" >
          <a class="navitem" @click.prevent="openSubMenuOnClick">senates <i class="fas fa-chevron-right"></i></a>
          <div @click.capture="hideMenu" :class="[{hide:dropMenuClicked},'dropside-content']">
            <div class="flex-container">
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index<=8" :to="{name: 'resultSenates', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>8 && index<=17" :to="{name: 'resultSenates', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>17 && index<=26" :to="{name: 'resultSenates', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>26" :to="{name: 'resultSenates', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="dropside house-of-reps">
          <a class="navitem" @click.capture="openSubMenuOnClick">house of reps <i class="fas fa-chevron-right"></i></a>
          <div @click.capture="hideMenu" :class="[{hide:dropMenuClicked},'dropside-content']">
            <div class="flex-container">
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index<=8" :to="{name: 'resultHouseOfReps', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>8 && index<=17" :to="{name: 'resultHouseOfReps', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>17 && index<=26" :to="{name: 'resultHouseOfReps', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
              <div class="flex-item">
                <template v-for="(state,index) in states" :key="state">
                  <router-link v-if="index>26" :to="{name: 'resultHouseOfReps', params: {state: state.toLowerCase().replace(/ |\//g, '-')}}" class="navitem">{{ state }}</router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li v-if="loggedIn && isAdmin" :class="[{responsive:navbarBurgersClicked},'nav']" @click.capture="hideMenu"><router-link ref="reg-contestant" to="/register-contestant" class="navitem main-navitem" >REGISTER CONTESTANT</router-link></li>
    <li :class="[{responsive:navbarBurgersClicked},'nav-bars','nav']" @click.capture.prevent="openMenuOnSmallScreen"><a href="javascript:void(0);" class="icon-bar"><i class="fas fa-bars"></i></a></li>
  </ul>
</nav>

<router-view/>

<footer class="p-4" v-show="!hideFooter">
<div class="footer-links">
  <div class="">
    <h2 class="quick-title">Quick Links</h2>
    <ul class="quick-links">
      <li><router-link to="">Contact Us</router-link></li>
      <li><a href="">About Us</a></li>
      <li><a href="">News</a></li>
      <li><router-link to="">FAQs</router-link></li>
    </ul>
  </div>
  <div>
    <h2 class="social-title">Social Links</h2>
    <ul class="social-links">
      <li class=""><a href="">Facebook</a></li>
      <li class=""><a href="">Twitter</a></li>
      <li class=""><a href="">Instagram</a></li>
    </ul>
  </div>
</div>
<hr>
<div class="has-text-white pb-3">
  <p>Online Voting &copy; 2021</p>
</div>
</footer>
</template>

<style lang="scss">
body {
  margin: 0px;
  background: #f9f9f9;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container-login {
  background-color: #000;
  position: relative;
  height: 60px;

  .position-right {
    position: absolute;
    right: 6px;
    top: 10px;

    button {
      margin-left: 16px;

      a {
        color: #f9f9f9;

        &:hover {
          color: #fff;
          font-size: 1.1rem;
        }

        @media screen and (max-width: 576px) {
          color: #fff;
          font-size: 1.1rem;
        }
      }
    }

    .user-menu {
      position: relative;

      .dropdown-user-menu {
        display: none;
        position: absolute;
        right: 9px;
        background-color: #f9f9f9;
        border-radius: 8px;
        min-width: 190px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;

        .box {
          padding: 0px;

          p {
            padding: 5px;
            border-bottom: 1px solid #000;

            &:last-child {
              border-bottom: none;
            }

            a {
              color: #000;
              display: block;
              text-align: left;
            }

            &:hover {
            background: #f1f1f1; 
            }
          }
        }

        &.show {
          display: block;
        }
      }
    }
  }
}
nav {
  background: #080808;
  margin-bottom: 1px;

  ul#navbar {
    list-style: none;
    margin: 0px;
    padding: 0px 0px 0px 100px;
    text-align: left;

    &.admin {
      padding: 0px 0px 0px 10px;
    }

    @media screen and (max-width:991px) {
      padding: 2px 8px;
      position: relative;
    }

    li.nav {
      display: inline-block;
      margin: 0 10px;

      &.right {
        float: right;
        margin: 0px 4px 0px 0px;
        @media screen and (max-width:991px) {
          margin-left: 10px;
          float: none;
        }
      }

      &.nav-bars {
        display: none;
      }

      @media screen and (max-width:991px) {
        &:first-child { padding: 0px;}
        &:not(:first-child) {display: none;}
        &.nav-bars {
          float: right;
          display: block;
          padding: 10px 0;

          &.responsive {
            position: absolute;
            top: 10px;
            right: 3px;
          }

          .fas {
            color: #f2f2f2;

            @media screen and (max-width:991px) {
              &.fa-bars {color: #eee !important;}
            }
          }
        }

        &.responsive {
          display: block;
          text-align: left;
          padding: 0px 0px;
        }

        &:not(:last-child):hover {
          background:#2454f3;
          color: #fff;
        }
      }

      .main-navitem {
        font-size: 20px;
        color: #eee;
        text-transform: capitalize;
        padding: 10px;
        display: block;

        &:hover {
          background:#2454f3;
          color: #eee;
          border-radius: 2px;
        }

        &.current {
          background:#2454f3;
          color: #f1f1f1;
          border-radius: 2px;
        }

        .fas {
          font-size: 15px;
          padding-left: 4px;
        }
      }

      .dropdown-content {
        display: none;
        position: absolute;
        text-align: center;
        background-color: #f9f9f9;
        min-width: 180px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 100;

        &.hide {
          display: none;
        }

        &.parties {
          min-width: 120px;
        }

        .navitem {
          display: block;
          margin-top: 10px;
          padding: 5px 0px;
          color: black;
          position: relative;

          .fas {
            @media screen and (min-width: 992px) {
              transition: padding-left .7s;
            }
          }

          &.party {
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          &:hover {
            background:#2454f3;
            color: #fffafa;
            border-radius: 2px;

            .fas {
              @media screen and (min-width: 992px) {
                padding-left: 7px;
              }
            }
          }

          &.current {
            background:#2454f3;
            color: #fffafa;
            border-radius: 2px;
          }
        }

        
        .dropside { 
          position: relative;

          .fas {
            @media screen and (max-width: 991px) {
              position: absolute;
              padding-left: 5px;
              top: -6px;
              transform: rotate(90deg);
            }
          }

          .dropside-content {
            display: none;
            position: absolute;
            top: 0px;
            left: 180px;
            min-width: 300px;
            background-color: #f9f9f9;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            height: 200px;
            overflow-y: scroll;
            overflow-x: hidden;

            .flex-container {
              display: flex;
              flex-wrap: wrap;

              .flex-item {
                flex: 50%;

                ul.states {

                  @media screen and (max-width: 576px) {
                    margin: 0px;
                    text-align: left;
                    text-indent: 1.5em;
                  }
              
                  li.state {
                    padding:5px 0;

                    a {
                      cursor: default;
                      color: black;
                      display: block; 

                      @media screen and (max-width: 576px) {
                        color: #f2f2f2;

                        &:hover {
                          color: #008b8b;
                        }
                      }

                      @media screen and (min-width: 576px) and (max-width: 991px) {
                        color: #fff;
                      }

                      &:hover {
                        background:#2454f3;
                        color: #fffafa;
                      }
                    }

                    ul.districts {
                      background: #e1e1e1;
                      display: none;
                      padding: 0px;
                      text-align: left;
                      text-indent: .8em;

                      @media screen and (max-width: 576px) {
                        position: relative;
                        display: block;
                        text-align: left;
                        left: 20px;
                        background: transparent;
                      }

                      @media screen and (min-width: 576px) and (max-width: 991px) {
                        position: relative;
                        display: block;
                        text-align: left;
                        left: 20px;
                        background: transparent;
                      }

                      li.district {
                        padding: 0px;

                        a{
                          cursor: pointer;

                          @media screen and (max-width:576px) {
                            color: #f2f2f2;
                            padding: .2em;
                          }
                        }
                      }
                    }

                    @media screen and (min-width: 992px) {
                      &:hover ul.districts {
                        display: block;
                      }
                    }
                  }
                }
              }
            }

            @media screen and (max-width: 991px) {
              &.open-menu {
                position: relative;
                left: 0px;
                display: block;
                background: #080808;
              }
            }
          }

          @media screen and (min-width: 992px) {
            &:hover .dropside-content {
              display: block;
            }
          }
        }

        @media screen and (max-width: 567px) {
          &.open-menu {
            position: relative;
            background: #8ba1a1;
            display: block;

            .navitem {
              color: #f2f2f2;
              text-align: left;
              text-indent: .9em;
              padding: 0 10px;
            }
          }
        }

        @media screen and (min-width: 576px) and (max-width: 991px) {
          &.open-menu {
            position: relative;
            background: #637a7a;
            display: block;

            .navitem {
              color: #f2f2f2;
              text-align: left;
              text-indent: .9em;
              padding: 0 10px;
            }
          }
        }
      }      
    }

    @media screen and (min-width:992px) {
      .dropdown:hover .dropdown-content {
        display: block;
      }
    }
  }
}

footer {
  background: #eee url('assets/bg-footer.jpg') no-repeat center;
  background-size: cover;
  margin-top: 20px;

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    @media screen and (max-width: 576px) {
      flex-direction: column;
    }

    .quick-title {
      color: #fff;
      font-size: 1.3rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      letter-spacing: .3em;
    }

    .social-title {
      @extend .quick-title;
    }
    // .registration-center-title {
    //   @extend .quick-title;
    // }

  .quick-links {
    list-style: none;
    padding: 0px;
    margin: 0px;

    li {
      //display: inline-block;
      padding: 5px 20px;
      font-size: 1.2rem;

      a {
        color: #fff;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .social-links {
    @extend .quick-links;
    padding-top: 15px;
  }
  }

  hr {
    width: 95%;
    margin: 0 auto 10px auto;
    background: #7499dc;
  }
}
</style>
