<template>
<div
  v-if="notificationSuccess" 
  class="has-background-success has-text-white"
  >
    {{ notificationMessage }}
</div>
<div
  v-else-if="!notificationSuccess" 
  class="has-background-danger has-text-white"
  >
    {{ notificationMessage }}
</div>
<div class="home mt-6">
  <div class="flex-container">
    <div class="flex-item heading second">
      <div class="container">
        <h2 class="info">Online voting<br><span>for</span><br>general elections</h2>
        <div class="intro">
          <p class="">This outlet is to facilitate election voting; allowing 
            people to vote from anywhere <span class="has-text-success">with 
              live vote update</span> while election is ongoing
          </p>
        </div>
      </div>
    </div>
    <div class="flex-item first">
      <div class="container">
        <img src="@/assets/voting.jpg" alt="">
      </div>
    </div>
  </div>
  <hr>
  <div class="flex-container flex-centered">
    <div class="flex-item item-notice">
      <h2 class="notice">NOTICE 
        <span class="fas fa-exclamation has-text-danger"></span>
        <span class="fas fa-exclamation has-text-danger"></span>
        <span class="fas fa-exclamation has-text-danger"></span>
      </h2>
      <p class="has-text-weight-medium">
        After creating an account, make sure to keep your password save; because the system will 
        allow for a maximum login trail after which it will lock your account. Although you can 
        recover password before the system locks your account through password forget feature.
      </p>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'Home',
  computed: {
    notificationSuccess() {
      return this.$store.getters.notification?.success
    },
    notificationMessage() {
      return this.$store.getters.notification?.message
    },
  },
  beforeRouteLeave() {
    this.$store.dispatch("unsetNotification");
  },
}
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  margin-bottom: 20px;
  justify-content: center;

  @media screen and (max-width: 991px) {
    flex-flow: column;
    align-items: center;
  }

  .flex-item {
    flex: 30%;
    max-width: 30%;

    @media screen and (max-width: 991px) {
      flex: 100%;
      max-width: 100%;

      &.first {
        order: 1;
      }

      &.second {
        order: 2;
      }

      .container {
        width: 90%;
        margin: auto;
      }
    }

    img {
      border-radius: 8px;
    }

    &.heading {
      flex: 55%;
      margin-left: 16px;
      max-width: 55%;

      @media screen and (max-width: 991px) {
        flex: 100%;
        max-width: 100%;

        .container {
          width: 90%;
          margin: auto;
        }
      }

      .info {
        color: #4682B4;
        font-size: 3rem;
        letter-spacing: .1em;
        text: {
          align: center;
        }

        span {
          text-transform: lowercase;
        }

        @media screen and (max-width: 991px) {
          font-size: 1.5rem;
          text-decoration: underline;
          margin: 10px 0 15px 0;
        }
      }

      .intro {
        padding: auto 0px;
        text-align: center;
        

        p {
          color: #000;
          text-align: left;
          text-transform: lowercase;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 1.5rem;

          &::first-letter {
            text-transform: uppercase
          }
        }

      }
    }

    &.register-guideline {
      flex: 50%;
      max-width: 50%;
      margin-left: 16px;

      @media screen and (max-width: 991px) {
        flex: 100%;
        max-width: 100%;
        margin: 0px;
      }

      margin-right: 16px;
      color: #000;
      font: {
        size: 1.5rem;
        family: 'Times New Roman', serif;
      }
      text: {
        align: center;
      }

      .container {
        width: 90%;
        margin: auto;

        h2 {
          text: {
            align: center;
            transform: uppercase;
            decoration: underline;
          }
          letter-spacing: .1em;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: bolder;
          color: #1d6188;
          margin: 50px 0 15px;

          &.guideline {
            margin-top: 0px;
          }

          &.notice {
            text: {
              transform: uppercase;
              decoration: none;
            }
          }
        }

        p {
          text-align: left;

          strong {
            text-transform: uppercase;
            font-weight: bold;
          }
          span {
            font-size: 1.7rem;
            text: {
              transform: lowercase;
            }
          }
        }
      }

    }

    &.item-notice {
      flex: 60%;
      max-width: 60%;
      margin-left: 16px;

      @media screen and (max-width: 991px) {
        flex: 100%;
        max-width: 100%;
        margin: 0px;
      }

      margin-right: 16px;
      color: #000;
      font: {
        size: 1.5rem;
        family: 'Times New Roman', serif;
      }
      text: {
        align: center;
      }

      h2 {
        text: {
          align: center;
          transform: uppercase;
          decoration: underline;
        }
        letter-spacing: .1em;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bolder;
        color: #1d6188;
        margin: 10px 0 15px;

        &.notice {
          text: {
            transform: uppercase;
            decoration: none;
          }
        }
      }

      p {
        color: #000;
        text-align: left;
        text-transform: lowercase;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 1.5rem;

        &::first-letter {
          text-transform: uppercase
        }
      }
    }

    &.has-flex {
      .large-image {
        width: 100%;
        max-width: 100%;
      }
      .flex-container {
        display: flex;

        &.heading-images {
          justify-content: center;

          @media screen and (max-width: 991px) {
            display: none;
          }
        }

        &.small-images {
          justify-content: space-around;

          @media screen and (max-width: 991px) {
            display: none;
          }
        }

        .flex-item {
          flex: 40%;
          max-width: 40%;

          @media screen and (max-width: 991px) {
            flex: 100%;
            max-width: 100%;
          }
        }
      }
    }
  }
}
hr {
  width: 95%;
  margin: 0px auto 10px;
  background: #000;
}
.home-footer {
    margin: 2em 0 0;

    h2 {
      text-decoration: underline;
    }

    .flex-container.states {
      display: flex;
      justify-content: center;
      margin-bottom: 0px;

      @media screen and (max-width: 576px) {
        flex-flow: column;
      }

      .flex-item {
        flex: 20%;
        max-width: 20%;

        @media screen and (max-width: 576px) {
          flex: 100%;
        }
      }
    }

    a {
      display: inline-block;
      color: #191919;
      padding: 10px;
    }
    a:hover,router-link:hover {
      color: #fff;
      background: rgba(19, 7, 189, 0.801);
      text-decoration: underline;
    }
  }

</style>
