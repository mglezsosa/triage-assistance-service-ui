<template>
  <div class="page">
    <div class="container">
      <div class="row">
        <span class="welcome">
          Bienvenido,
          <span class="userName">{{ userFirstName }} {{ userLastName }}.</span>
        </span>
        <div class="content">
          <section v-if="this.isAdmin || this.isHealthProfessional">
            <h2>Triajes pendientes</h2>
            <div class="actions">
              <button
                @click="goToPendingTriage"
                :disabled="!this.allowCompletePendingTriage"
              >Evaluar un caso pendiente</button>
            </div>
            <QueueSizeMonitor @updated="onQueueSizeUpdate" />
          </section>
          <section>
            <h2>Nuevo triaje</h2>
            <div class="search-cc">
              <v-select
                :filterable="true"
                :options="this.chiefComplaintOptions"
                class="v-select"
                v-model="selectedTriage"
                :placeholder="'Buscar queja principal'"
              >
                <template slot="option" slot-scope="option">{{ option.chiefComplaint.title }}</template>
              </v-select>
            </div>
            <div class="actions">
              <button
                v-if="this.isAdmin || this.isTelephoneOperator"
                :disabled="nothingSelected"
                @click="goToNewPartialTriage"
              >Nuevo triaje parcial</button>
              <button
                v-if="this.isAdmin || this.isHealthProfessional"
                :disabled="nothingSelected"
                @click="goToNewFullTriage"
              >Nuevo triaje completo</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import { Role } from '../_helpers/role'
import { authenticationService } from '../_services/authentication.service'
import { triageService } from '../_services/triage.service'
import QueueSizeMonitor from './QueueSizeMonitor'

vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('i', {
      class: [ 'icon', 'ion-md-close' ],
      style: {
        color: 'rgba(60,60,60,.5)'
      }
    })
  },
  OpenIndicator: {
    render: createElement => createElement('i', {
      class: [ 'icon', 'ion-md-arrow-dropdown' ],
      style: {
        fontSize: '20px',
        color: 'rgba(60,60,60,.5)'
      }
    })
  },
})

export default {
    name: 'Home',
    components: {
        vSelect,
        QueueSizeMonitor
    },
    methods: {
        goToNewFullTriage() {
            this.$router.push({
                path: '/full-triage/' + this.selectedTriage.chiefComplaint.id
            })
        },
        goToNewPartialTriage() {
            this.$router.push({
                path: '/partial-triage/' + this.selectedTriage.chiefComplaint.id
            })
        },
        goToPendingTriage() {
            this.$router.push('/pending-triage')
        },
        onQueueSizeUpdate(value) {
            if (value != 0) {
                this.allowCompletePendingTriage = true
            } else {
                this.allowCompletePendingTriage = false
            }
        }
    },
    data() {
        return {
            chiefComplaintOptions: [],
            selectedTriage: null,
            allowCompletePendingTriage: false
        }
    },
    computed: {
        isAdmin() {
            return authenticationService.currentUserValue.role == Role.Admin
        },
        isHealthProfessional() {
            return authenticationService.currentUserValue.role == Role.HealthProfessional
        },
        isTelephoneOperator() {
            return authenticationService.currentUserValue.role == Role.TelephoneOperator
        },
        nothingSelected() {
            return this.selectedTriage == null
        },
        userFirstName() {
            return authenticationService.currentUserValue.firstName;
        },
        userLastName() {
            return authenticationService.currentUserValue.lastName;
        }
    },
    created() {
        triageService.getAll().then(r => {
                this.chiefComplaintOptions = r.map(o => {
                        o.label = o.chiefComplaint.title
                        return o
                    })
            })
    }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.row {
  width: 960px;
  display: flex;
  flex-direction: column;
}

.welcome {
  display: inline-block;
  margin: 10px 0;
  font-size: 48px;
  font-weight: bold;
}

.userName {
  font-size: 30px;
}

.content {
  flex: 1;
}

.search-cc {
  margin: 30px 0;
  width: 100%;
}

.actions {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

button {
  margin: 7px 0;
  padding: 20px 30px;
  border-radius: 5px;
  border: none;
  background: #2e85ff;
  color: #fff;
  cursor: pointer;
  font-size: 1em;
}

button:disabled {
  background: rgb(46, 133, 255, 0.4);
  cursor: not-allowed;
}

section {
  margin-top: 30px;
}
</style>

<style>
.vs__search::placeholder {
  color: #999;
}

.vs__dropdown-toggle {
  background: #f1f3f7;
  padding: 20px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
}

input[type="search"]::-webkit-search-cancel-button {
  display: none;
}

.vs__dropdown-option--highlight {
  background: #2e85ff;
}
</style>