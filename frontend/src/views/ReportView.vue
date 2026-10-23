<template>
  <div class="main-view">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="brand" @click="router.push('/home')"><img src="../assets/logo/lokantra_wordmark.png" alt="LOKĀNTRA" class="brand-wordmark" /></div>
      </div>

      <div class="header-right">
        
        <div class="workflow-step">
          <span class="step-num">Step 4/5</span>
          <span class="step-name">{{ $tm('main.stepNames')[3] }}</span>
        </div>
        <div class="step-divider"></div>
        <span class="status-indicator" :class="statusClass">
          <span class="dot"></span>
          {{ statusText }}
        </span>
      </div>
    </header>

    <main class="content-area" ref="contentAreaRef" :class="{ dragging: isDragging }">
      <div class="panel-wrapper left" :style="{ width: `${leftPanelWidth}%` }">
        <GraphPanel 
          :graphData="graphData"
          :loading="graphLoading"
          :currentPhase="4"
          :isSimulating="false"
          @refresh="refreshGraph"
          @toggle-maximize="toggleMaximize('graph')"
        />
      </div>

      <div class="splitter" @pointerdown.prevent="startDragging" aria-label="Resize panels" title="Drag to resize panels"></div>

      <div class="panel-wrapper right" :style="{ width: `${100 - leftPanelWidth}%` }">
        <Step4Report
          :reportId="currentReportId"
          :simulationId="simulationId"
          :systemLogs="systemLogs"
          @add-log="addLog"
          @update-status="updateStatus"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GraphPanel from '../components/GraphPanel.vue'
import Step4Report from '../components/Step4Report.vue'
import { getProject, getGraphData } from '../api/graph'
import { getSimulation } from '../api/simulation'
import { getReport } from '../api/report'
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Props
const props = defineProps({
  reportId: String
})

const MIN_PANEL_WIDTH = 25
const MAX_PANEL_WIDTH = 75
const contentAreaRef = ref(null)
const leftPanelWidth = ref(50)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartWidth = ref(50)
const animationFrame = ref(null)

// Data State
const currentReportId = ref(route.params.reportId)
const simulationId = ref(null)
const projectData = ref(null)
const graphData = ref(null)
const graphLoading = ref(false)
const systemLogs = ref([])
const currentStatus = ref('processing') // processing | completed | error

const clampPanelWidth = (value) => Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, value))

const applyPanelWidth = (nextWidth) => {
  if (animationFrame.value) cancelAnimationFrame(animationFrame.value)

  animationFrame.value = requestAnimationFrame(() => {
    leftPanelWidth.value = clampPanelWidth(nextWidth)
    animationFrame.value = null
  })
}

const startDragging = (event) => {
  if (!contentAreaRef.value) return
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartWidth.value = leftPanelWidth.value

  window.addEventListener('pointermove', handleDrag)
  window.addEventListener('pointerup', stopDragging)
  window.addEventListener('pointercancel', stopDragging)
}

const handleDrag = (event) => {
  if (!isDragging.value || !contentAreaRef.value) return

  const rect = contentAreaRef.value.getBoundingClientRect()
  const deltaPercent = ((event.clientX - dragStartX.value) / rect.width) * 100
  applyPanelWidth(dragStartWidth.value + deltaPercent)
}

const stopDragging = () => {
  isDragging.value = false
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
    animationFrame.value = null
  }
  window.removeEventListener('pointermove', handleDrag)
  window.removeEventListener('pointerup', stopDragging)
  window.removeEventListener('pointercancel', stopDragging)
}

// --- Status Computed ---
const statusClass = computed(() => {
  return currentStatus.value
})

const statusText = computed(() => {
  if (currentStatus.value === 'error') return 'Error'
  if (currentStatus.value === 'completed') return 'Completed'
  return 'Generating'
})

// --- Helpers ---
const addLog = (msg) => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + new Date().getMilliseconds().toString().padStart(3, '0')
  systemLogs.value.push({ time, msg })
  if (systemLogs.value.length > 200) {
    systemLogs.value.shift()
  }
}

const updateStatus = (status) => {
  currentStatus.value = status
}

// --- Layout Methods ---
const toggleMaximize = (target) => {
  if (target === 'graph') {
    leftPanelWidth.value = 68
  }
}

// --- Data Logic ---
const loadReportData = async () => {
  try {
    addLog(t('log.loadReportData', { id: currentReportId.value }))

    // Get report info to obtain simulation_id
    const reportRes = await getReport(currentReportId.value)
    if (reportRes.success && reportRes.data) {
      const reportData = reportRes.data
      simulationId.value = reportData.simulation_id

      if (simulationId.value) {
        // Get simulation info
        const simRes = await getSimulation(simulationId.value)
        if (simRes.success && simRes.data) {
          const simData = simRes.data

          // Get project info
          if (simData.project_id) {
            const projRes = await getProject(simData.project_id)
            if (projRes.success && projRes.data) {
              projectData.value = projRes.data
              addLog(t('log.projectLoadSuccess', { id: projRes.data.project_id }))

              // Get graph data
              if (projRes.data.graph_id) {
                await loadGraph(projRes.data.graph_id)
              }
            }
          }
        }
      }
    } else {
      addLog(t('log.getReportInfoFailed', { error: reportRes.error || t('common.unknownError') }))
    }
  } catch (err) {
    addLog(t('log.loadException', { error: err.message }))
  }
}

const loadGraph = async (graphId) => {
  graphLoading.value = true
  
  try {
    const res = await getGraphData(graphId)
    if (res.success) {
      graphData.value = res.data
      addLog(t('log.graphDataLoadSuccess'))
    }
  } catch (err) {
    addLog(t('log.graphLoadFailed', { error: err.message }))
  } finally {
    graphLoading.value = false
  }
}

const refreshGraph = () => {
  if (projectData.value?.graph_id) {
    loadGraph(projectData.value.graph_id)
  }
}

// Watch route params
watch(() => route.params.reportId, (newId) => {
  if (newId && newId !== currentReportId.value) {
    currentReportId.value = newId
    loadReportData()
  }
}, { immediate: true })

onMounted(() => {
  addLog(t('log.reportViewInit'))
  loadReportData()
})

onUnmounted(() => {
  stopDragging()
})
</script>

<style scoped>
.main-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFF;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans SC', system-ui, sans-serif;
}

/* Header */
.app-header {
  height: 64px;
  border-bottom: 1px solid #EAEAEA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #FFF;
  z-index: 100;
  position: relative;
}

.brand-wordmark {
  height: 44px;
  width: auto;
  object-fit: contain;
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.brand-wordmark:hover {
  transform: scale(1.03);
}

.brand {
  display: flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.workflow-step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.step-num {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #999;
}

.step-name {
  font-weight: 700;
  color: #000;
}

.step-divider {
  width: 1px;
  height: 14px;
  background-color: #E0E0E0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #CCC;
}

.status-indicator.processing .dot { background: #FF9800; animation: pulse 1s infinite; }
.status-indicator.completed .dot { background: #4CAF50; }
.status-indicator.error .dot { background: #F44336; }

@keyframes pulse { 50% { opacity: 0.5; } }

/* Content */
.content-area {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.content-area.dragging .panel-wrapper,
.content-area.dragging .splitter {
  user-select: none;
  -webkit-user-select: none;
}

.panel-wrapper {
  height: 100%;
  overflow: hidden;
  transition: width 0.08s ease;
}

.panel-wrapper.left {
  min-width: 25%;
  max-width: 75%;
  border-right: 1px solid #EAEAEA;
}

.splitter {
  position: relative;
  width: 12px;
  min-width: 12px;
  cursor: col-resize;
  background: transparent;
  border-left: 1px solid #EAEAEA;
  border-right: 1px solid #EAEAEA;
  z-index: 2;
  transition: background-color 0.15s ease;
}

.splitter::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 40px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.18);
  transition: background 0.15s ease, transform 0.15s ease;
}

.splitter:hover::before,
.splitter:active::before {
  background: rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%) scaleY(1.08);
}
</style>
