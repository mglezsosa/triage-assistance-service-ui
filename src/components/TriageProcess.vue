<template>
    <div class="page">
        <div class="container">
        <aside>
            <ol class="nobull">
                <label>Pasos del proceso:</label>
                <li v-for="(stp, index) in this.selectedTriage.steps" :key="index">
                    <button @click="goToStep(index)" :disabled="finishing"
                    :class="{ active: isActive(index), finishing: finishing }">{{index + 1}}. {{ stp.discriminator.title }}</button>
                </li>
                <li>
                    <button @click="goToStep(selectedTriage.steps.length)" :disabled="finishing"
                    :class="{ active: this.step >= this.selectedTriage.steps.length, finishing: this.finishing }">Finalizar triaje</button>
                </li>
            </ol>
        </aside>
        <main>
            <div class="content">
                <h1>{{ this.selectedTriage.chiefComplaint.title }}</h1>
                <div v-if="this.step < this.selectedTriage.steps.length && !this.finishing">
                    <h2>{{ this.currentStep.discriminator.title }}</h2>
                    <div class="definition">
                        <h3>Definición: {{ this.currentStep.discriminator.definition }}</h3>
                    </div>
                    <ul class="questions">
                        <label>Preguntas sugeridas:</label>
                        <li v-for="(qst, index) in this.currentStep.discriminator.questions" :key="index">
                            {{ qst }}
                        </li>
                    </ul>
                </div>
                <div v-else-if="!this.finishing">
                    No hay mas discriminantes para esta queja principal. ¿Quieres finalizar el proceso?
                </div>
                <div v-if="this.finishing">
                    <h2>{{ this.currentStep.level.levelTitle }}</h2>
                    <p>
                        <ul class="questions">
                            <label>Recomendaciones:</label>
                            <li v-for="(adv, index) in this.currentStep.level.advices" :key="index">
                                {{ adv }}
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
            <div class="answer-container" v-if="!this.finishing">
                <div class="inner-answer-container">
                    <button :disabled="this.step < 1" class="answer-return" @click="goToPrevStep()">
                        <i class="icon ion-md-arrow-back"></i>Volver
                        </button>
                    <button :disabled="this.step >= this.selectedTriage.steps.length" class="answer-no" @click="goToNextStep()">
                        <i class="icon ion-md-close red bigger"></i>No
                        </button>
                    <button class="answer-yes" @click="discriminatorFound()">
                        <i class="icon ion-md-checkmark green bigger"></i>Sí
                    </button>
                    <button :disabled="this.step >= this.selectedTriage.steps.length" class="answer-skip" @click="goToNextStep()">
                        <i class="icon ion-md-arrow-forward"></i>Omitir
                    </button>
                </div>
            </div>

            <div class="answer-container" v-if="this.finishing">
                <div class="inner-answer-container confirmation">
                    <button class="answer-return" @click="undoFinishing()">
                        <i class="icon ion-md-arrow-back"></i>Volver
                        </button>
                    <button class="answer-yes" @click="confirm()">
                        <i class="icon ion-md-checkmark green bigger"></i>Confirmar y finalizar
                    </button>
                </div>
            </div>
        </main>
    </div>
    </div>
</template>

<script>

export default {
    name: 'TriageProcess',
    computed: {
        currentStep: function() {
            if (this.step >= this.selectedTriage.steps.length) {
                return {
                    level: this.selectedTriage.defaultLevel
                }
            }
            return this.selectedTriage.steps[this.step]
        }
    },
    props: {
        selectedTriage: Object,
        step: {
            type: Number,
            default: 0
        }
    },
    methods: {
        getStateStep: function (step) {
            return this.selectedTriage.steps[step]
        },
        goToStep: function (step) {
            this.step = step
            if(this.step >= this.selectedTriage.steps.length) {
                this.finishing = true;
            }
        },
        isActive: function (index) {
            return index == this.step
        },
        goToNextStep: function () {
            this.goToStep(++this.step)
        },
        goToPrevStep: function() {
            this.step--
        },
        discriminatorFound() {
            this.finishing = true;
        },
        undoFinishing() {
            if (this.step >= this.selectedTriage.steps.length) {
                this.step--;
            }
            this.finishing = false;
        },
        confirm() {
            this.$emit('confirmed', this.currentStep)
        },
        beforeunloadListener(event) {
            event.returnValue =
                "El proceso no ha sido finalizado. ¿Está seguro de que quiere abandonar el proceso?"
        }
    },
    data() {
        return {
            finishing: false,
        }
    },
    created() {
        window.addEventListener("beforeunload", this.beforeunloadListener)
    },
    destroyed() {
        window.removeEventListener("beforeunload", this.beforeunloadListener)
    }
}
</script>

<style scoped>
.page {
    display: flex;
    flex-flow: column;
    height: calc(100vh - 71px);
}

.container {
    flex: 1;
    width: 100%;
    display: flex;
    color: #324b72;
    height: 100%;
}

h1 {
    font-size: 2.75em;
}

h3 {
    font-size: 0.83em;
    margin: 0;
}

.definition {
    padding: 30px;
    background: #f1f3f7;
    border-radius: 10px;
}

.definition h5 {
    margin: 0;
}

aside {
    flex: 0 0 400px;
    padding: 50px;
    height: 100%;
    background: #f1f3f7;
}

aside button {
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    font-size: 1em;
    text-align: start;
    color: inherit;
}

aside button.finishing {
    cursor: not-allowed;
}

aside ol {
    padding: 0;
    margin: 0;
}

.active {
    background: #2e85ff;
    color: #fff;
}

main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.content {
    padding: 20px 50px;
    overflow-y: auto;
}

.nobull {
    list-style: none;
    padding-left: 0;
}

.answer-container {
    padding: 0 50px;
    flex: 0 0 100px;
    background: rgba(0, 0, 0, 0);
    position: relative;
}

.answer-container::before {
    content: '';
    position: absolute;
    top: -50px;
    right: 0;
    left: 0;
    height: 50px;
    background-image: linear-gradient(0deg, #fff 10%, transparent 100%);
}

.inner-answer-container {
    background-color: transparent;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding: 20px 30px 30px 30px;
}

.inner-answer-container button {
    font-size: 1.1em;
    font-family : inherit;
    font-weight: 400;
    padding: 20px 20px;
    width: calc(25% - 20px);
    min-width: 200px;
    background: #f1f3f7;
    color: #324b72;
    border-radius: 40px;
    border: none;
    text-align: start;
    cursor: pointer;
}

.inner-answer-container.confirmation button {
    width: calc(50% - 50px);
}

.inner-answer-container button:disabled {
    color: #888;
}

button .icon {
    font-size: 1.5em;
    top: 5px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
}

button .icon.bigger {
    font-size: 1.6em;
}

.green {
    color: green;
}

.red {
    color: red;
}

button span.vertically-aligned {
    display: inline-block;
    vertical-align: middle;
}

.questions {
    margin: 20px 30px;
    padding: 0;
}

.questions li {
    padding: 10px;
    margin: 5px 0;
}

</style>