<template>
  <div>
    <div class="loading-overlay" v-if="loading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <TriageProcess
      :selectedTriage="selectedTriage"
      :step="startingStep"
      @confirmed="onConfirmation"
    ></TriageProcess>
  </div>
</template>

<script>
import TriageProcess from "./TriageProcess"
import { triageService } from '../_services/triage.service'

export default {
    name: "PendingTriageProcess",
    components: {
        TriageProcess
    },
    methods: {
        async fetchNextPending() {
            this.previousPreTriage = await triageService.getNextEnqueued()
        },
        async prepareTriage(id) {
            const rawTriage = await triageService.getById(id)
            this.selectedTriage = {
                chiefComplaint: rawTriage.chiefComplaint,
                steps: [
                    ...rawTriage.algorithm.criticalLevels.map(cl => {
                        cl.isCritical = true
                        return cl
                    }),
                    ...rawTriage.algorithm.intermediateLevels.map(il => {
                        il.isCritical = false
                        return il
                    })
                ].flatMap(l =>
                    l.discriminators.map(d => {
                        return {
                            level: l,
                            discriminator: d
                        }
                    })
                ),
                defaultLevel: rawTriage.algorithm.defaultLevel
            }
            this.loading = false;
        },
        onConfirmation(data) {
            // eslint-disable-next-line
            console.log(
                this.selectedTriage.chiefComplaint.id, 
                data.discriminator ? [data.discriminator.id] : []
            )
            triageService.sendFullEvaluation(
                this.selectedTriage.chiefComplaint.id, 
                data.discriminator ? [data.discriminator.id] : [],
                this.previousPreTriage.id
            )
            this.$router.push('/')
        }
    },
    async created() {
        await this.fetchNextPending()
        await this.prepareTriage(this.previousPreTriage.foundChiefComplaintId)
        const startingStep = this.selectedTriage.steps.findIndex(s => !s.level.isCritical)
        this.startingStep = startingStep != -1 ? startingStep : this.selectedTriage.steps.length
    },
    data() {
        return {
            previousPreTriage: null,
            selectedTriage: {},
            loading: true,
            startingStep: 0
        }
    }
}
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  height: calc(100vh - 142px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #2e85ff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>