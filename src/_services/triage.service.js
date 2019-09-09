import { requestOptions } from "../_helpers/request-options"
import { handleResponse } from "../_helpers/handle-response"

function getAll() {
    return fetch(`http://localhost:8080/triage/`, requestOptions.get()).then(handleResponse)
}

function getById(id) {
    return fetch(`http://localhost:8080/triage/` + id, requestOptions.get()).then(handleResponse)
}

function getQueueSize() {
    return fetch(`http://localhost:8080/triage/queue-size`, requestOptions.get()).then(handleResponse)
}

function getNextEnqueued() {
    return fetch(`http://localhost:8080/triage/next-enqueued`, requestOptions.get()).then(handleResponse)
}

function sendCriticalOnlyEvaluation(triageChiefComplaintId, findingIds) {
    return fetch(`http://localhost:8080/triage/critical-only`, requestOptions.post({
        triageChiefComplaintId, findingIds
    })).then(handleResponse)
}

function sendFullEvaluation(triageChiefComplaintId, findingIds, previousPreTriageId = null) {
    return fetch(`http://localhost:8080/triage/full`, requestOptions.post({
        previousPreTriageId, triageChiefComplaintId, findingIds
    })).then(handleResponse)
}

export const triageService = {
    getAll,
    getById,
    getQueueSize,
    getNextEnqueued,
    sendCriticalOnlyEvaluation,
    sendFullEvaluation
}