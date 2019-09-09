<template>
  <div id="app">
    <NavBar v-if="currentUser"></NavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import { authenticationService } from "./_services/authentication.service";
import NavBar from './components/NavBar'

export default {
  name: "app",
  components: {
      NavBar
  },
  data() {
    return {
      currentUser: null
    }
  },
  created() {
    authenticationService.currentUser.subscribe(x => (this.currentUser = x));
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

body,
input,
textarea,
button {
  font-family: "Inter", Helvetica, Arial, sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
