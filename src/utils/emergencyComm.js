const EMERGENCY_STORAGE = 'ue-stc-emergency'
const EMERGENCY_TRIGGERED_STORAGE = 'ue-stc-emergency-triggered'

const thresholds = [10, 20, 50]
const payloadByThreshold = {
  10: {
    itemName: '三型阻尼器',
    sku: 'DMP-III-884',
    text: '需要...滋滋...对抗二级重力异常...申请三型阻尼器...快！',
    durationSec: 120,
  },
  20: {
    itemName: '偏振锚栓',
    sku: 'PAB-44X-12',
    text: '...波前坍缩...请求 44X 偏振锚栓...重复，44X...连接正在衰减',
    durationSec: 60,
  },
  50: {
    itemName: '局域相位笼',
    sku: 'LPC-9A-770',
    text: '信道残片：L...P...C 九系...若听见，立即出库，否则我们将...（静默）',
    durationSec: 30,
  },
}

function readJson(key, fallback) {
  const raw = sessionStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function readEmergency() {
  return readJson(EMERGENCY_STORAGE, null)
}

export function writeEmergency(value) {
  sessionStorage.setItem(EMERGENCY_STORAGE, JSON.stringify(value))
}

export function readTriggeredThresholds() {
  return readJson(EMERGENCY_TRIGGERED_STORAGE, [])
}

function writeTriggeredThresholds(list) {
  sessionStorage.setItem(EMERGENCY_TRIGGERED_STORAGE, JSON.stringify(list))
}

export function maybeTriggerEmergency(points) {
  const current = readEmergency()
  if (current && (current.status === 'active' || current.status === 'approved')) {
    return current
  }

  const triggered = readTriggeredThresholds()
  const nextThreshold = thresholds.find((t) => points >= t && !triggered.includes(t))
  if (!nextThreshold) return current

  const payload = payloadByThreshold[nextThreshold]
  const now = Date.now()
  const emergency = {
    id: `emg-${nextThreshold}-${now}`,
    threshold: nextThreshold,
    itemName: payload.itemName,
    sku: payload.sku,
    text: payload.text,
    startAt: now,
    deadlineAt: now + payload.durationSec * 1000,
    status: 'active',
    agentStatus: 'IN DANGER',
  }

  writeEmergency(emergency)
  writeTriggeredThresholds([...triggered, nextThreshold])
  return emergency
}

export function failEmergency(reason) {
  const current = readEmergency()
  if (!current || current.status === 'resolved' || current.status === 'failed') return current
  const next = { ...current, status: 'failed', failReason: reason, agentStatus: 'MIA' }
  writeEmergency(next)
  return next
}

export function approveEmergencyDispatch() {
  const current = readEmergency()
  if (!current || current.status !== 'active') return current
  const next = { ...current, status: 'approved' }
  writeEmergency(next)
  return next
}

export function resolveEmergency() {
  const current = readEmergency()
  if (!current || (current.status !== 'approved' && current.status !== 'active')) return current
  const next = { ...current, status: 'resolved', agentStatus: 'STABLE' }
  writeEmergency(next)
  return next
}

export function checkEmergencyTimeout() {
  const current = readEmergency()
  if (!current || current.status !== 'active') return current
  if (Date.now() <= current.deadlineAt) return current
  return failEmergency('timeout')
}
