<template>
  <div class="content">
    Casos en cola:
    <span>{{ this.queueSize }}</span>
  </div>
</template>

<script>
import { authenticationService } from '../_services/authentication.service'
import { triageService } from '../_services/triage.service'
import { Client } from '@stomp/stompjs'

export default {
    name: 'QueueSizeMonitor',
    data() {
        return {
            queueSize: '-',
            stompClient: null
        }
    },
    methods: {
        async fetchQueueSize() {
            this.queueSize = await triageService.getQueueSize()
            this.$emit('updated', this.queueSize)
        },
        connectionSuccess(frame) {
            // eslint-disable-next-line
			console.log(frame)
			this.stompClient.subscribe('/topic/queue-size', this.onMessageReceived, {
				authorization: 'Bearer ' + authenticationService.currentUserValue.token
			});
		},
		onMessageReceived(payload) {
            // eslint-disable-next-line
            console.log(payload)
            this.queueSize = payload.body
            this.$emit('updated', this.queueSize)
		},
        subscribeToTopic() {
            this.stompClient = new Client({
				brokerURL: "ws://localhost:8080/ws-connect",
				reconnectDelay: 5000,
				debug: function(e) {
                    // eslint-disable-next-line
					console.log(e)
				},
				heartbeatIncoming: 4000,
				heartbeatOutgoing: 4000
			});
				
			this.stompClient.onConnect = this.connectionSuccess
			this.stompClient.onStompError = function(e) {
                // eslint-disable-next-line
				console.error(e)
            }
            
			this.stompClient.activate()
        }
    },
    created() {
        this.fetchQueueSize()
        this.subscribeToTopic()
    }
}
</script>

<style scoped>
.content {
  font-size: 18px;
  text-align: center;
}
</style>