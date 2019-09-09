<template>
  <header>
    <div class="logo-container">
      <router-link to="/">
        <div class="logo">+</div>Logo
      </router-link>
    </div>
    <nav>
      <div class="router-link">
        <a @click="logout">Cerrar sesión</a>
      </div>
    </nav>
  </header>
</template>

<script>
import { authenticationService } from "../_services/authentication.service";
import router from "../_helpers/router";

export default {
    name: 'NavBar',
    methods: {
        logout() {
            authenticationService.logout();
            router.push("/login");
        }
    }
}
</script>

<style scoped>
header {
  width: 100%;
  min-height: 70px;
  display: flex;
  border-bottom: 1px solid #e0e6ed;
}

header .logo-container {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: 15px;
  text-transform: uppercase;
}

.logo-container a {
  display: inline-block;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo {
  height: 40px;
  width: 40px;
  line-height: 37px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  background: #2e85ff;
  color: #fff;
  border-radius: 5px;
  margin-right: 10px;
}

header nav {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 30px;
}

nav a {
  text-decoration: none;
  color: #2174ea;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  cursor: pointer;
}
</style>