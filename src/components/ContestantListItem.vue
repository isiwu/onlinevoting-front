<template>
<div class="contestant">
<div class="box">
  <div :class="[{ypp: isYpp},'box-image']">
    <figure class="">
    <img :src="imageUrl" :alt="fullName" width="100" height="" class="">
    </figure>
  </div>
  <div class="box-content">
    <p class="align-right has-text-weight-bold" v-if="voting">Votes: {{ votes }}</p>
    <div class="box-content-wrapper">
      <p class="has-text-left"><span class="has-text-weight-bold">Name:</span> {{fullName}}</p>
      <p class="has-text-left"><span class="has-text-weight-bold">Party:</span> {{party.toUpperCase()}}</p>
      <p class="has-text-left votes" v-if="!voting"><span class="has-text-weight-bold">Votes:</span> {{ votes }}</p>
      <slot></slot>
    </div>
  </div>
</div> 
</div> 
</template>

<script>
export default {
    name: 'ContestantListItem',
    data() {
      return {
        image: '',
        imageUrl: '',
        voting: true,
        isYpp: false,
      }
    },
    props: ['id', 'fullName', 'position', 'party', 'partyImage', 'votes'],
    created() {
      const url = process.env.NODE_ENV === 'production'?`https://onlinevoting.herokuapp.com/api/parties/image/${this.partyImage}`:`http://localhost:3000/api/parties/image/${this.partyImage}`;
      this.imageUrl = url;

      if (this.$route.path === '/contestants' || this.$route.path === '/result/presidents' || this.$route.path === `/result/senates/${this.$route.params.state}` || this.$route.path === `/result/house-of-reps/${this.$route.params.state}`) {
        this.voting = false;
      }

      if (this.party === 'ypp') this.isYpp = true;
    },
}
</script>

<style lang="scss" scoped>
div.contestant {
  width: 380px;
  margin: 4px auto;


  .box {
    padding: 8px;
    height: 120px;
    margin-right: 8px;

    &:first-child {
      border: 2px solid #05993eca;
    }

    .box-image {
      float: left;
      margin-right: 16px;
      //border: 2px solid red;

      &.ypp {
        padding-top: 40px;
      }
    }
    .box-content {
      position: relative;
      padding-top: 1px;

      p.align-right {
        background: #f0f0f0;
        width: 5em;
        position: absolute;
        right: 6px;
        font-size: 10px;
        padding: .2em;
        border-radius: 2px;
        margin-bottom: 10px;

      }

      .box-content-wrapper {
        padding-top: 15px;

        p.votes {
          padding-top: 0px;
        }
      }
      
    }
  }

  
}
</style>