<template>
<h2 class="title has-text-centered mb-0 mt-6">{{ vote.position }}</h2>
<div class="vote">
  <img :src="imageUrl" :alt="vote.name">
  <p class="block">Name: <span class="name">{{ vote.fullName }}</span></p>
</div>
</template>

<script>
export default {
    name: 'VotesListItem',
    data() {
        return {
           partyImage: '',
           imageUrl: '', 
        }
    },
    props: ['vote'],
    created() {
        const url = process.env.NODE_ENV === 'production'?`https://onlinevoting.herokuapp.com/api/parties/image/${this.vote.partyImage}`:`http://localhost:3000/api/parties/image/${this.vote.partyImage}`;
        this.imageUrl = url;
    }
}
</script>
<style lang="scss" scoped>
div.vote {
    width: 200px;
    margin: 4px auto;
    .title {
        text: {
            transform: uppercase;
            align: center;
        }
        font-size: 2rem;
    }
    p span.name {
        font-weight: bold;
    }
}
</style>