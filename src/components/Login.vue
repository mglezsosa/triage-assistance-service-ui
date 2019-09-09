<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-container">
        <div class="logo">+</div>Logo
      </div>
      <h1>Acceder</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input
            placeholder="Usuario"
            type="text"
            v-model.trim="$v.username.$model"
            name="username"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.username.$error }"
          />
          <div
            v-if="submitted && !$v.username.required"
            class="invalid-feedback"
          >Username is required</div>
        </div>
        <div class="form-group">
          <input
            placeholder="Contraseña"
            type="password"
            v-model.trim="$v.password.$model"
            name="password"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.password.$error }"
          />
          <div
            v-if="submitted && !$v.password.required"
            class="invalid-feedback"
          >Password is required</div>
        </div>
        <div class="form-group">
          <button :disabled="loading">
            <span class="spinner-border spinner-border-sm" v-show="loading"></span>
            <span>Acceder</span>
          </button>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators"
import { authenticationService } from "../_services/authentication.service"

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            submitted: false,
            loading: false,
            returnUrl: "",
            error: ""
        }
    },
    validations: {
        username: { required },
        password: { required }
    },
    created() {
        // redirect to home if already logged in
        if (authenticationService.currentUserValue) { 
                return this.$router.push('/')
        }

        // get return url from route parameters or default to '/'
        this.returnUrl = this.$route.query.returnUrl || "/"
    },
    methods: {
        onSubmit() {
            this.submitted = true

            // stop here if form is invalid
            this.$v.$touch()
            if (this.$v.$invalid) {
                return
            }

            this.loading = true
            authenticationService.login(this.username, this.password).then(
                () => this.$router.push(this.returnUrl),
                error => {
                    this.error = error
                    this.loading = false
                }
            )
        }
    }
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f1f3f7;
}

.login-card {
  border-top: 5px solid #2e85ff;
  border-radius: 5px;
  background: #fff;
  padding: 30px;
  min-width: 350px;
}

h1 {
  font-size: 1.1em;
}

input {
  border-radius: 5px;
  border: 1px solid #e0e6ed;
  padding: 10px;
  margin: 7px 0;
  width: 100%;
  background: #f7f9fc;
  font-size: 1em;
}

input::placeholder {
  color: #aaa;
}

button {
  margin: 7px 0;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: none;
  background: #2e85ff;
  color: #fff;
  cursor: pointer;
  font-size: 1em;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: 17px;
  text-transform: uppercase;
  height: 80px;
}

.logo {
  height: 50px;
  width: 50px;
  line-height: 48px;
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  background: #2e85ff;
  color: #fff;
  border-radius: 5px;
  margin-right: 15px;
}

.invalid-feedback {
  margin: 7px 0;
  margin-top: -5px;
  color: red;
  font-weight: bold;
  font-size: 11px;
}
</style>