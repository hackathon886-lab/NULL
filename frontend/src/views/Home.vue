<template>
  <div class="home-container fixed inset-0 w-screen h-screen overflow-hidden text-black select-none" style="font-family: var(--font-body);">
    <!-- Interactive Background Canvas (0-latency preloaded frame sequence) -->
    <canvas
      ref="canvasRef"
      width="1920"
      height="1085"
      class="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none transition-transform duration-500 ease-out"
      style="object-position: left center; transform: scale(1.1); transform-origin: left center;"
    ></canvas>

    <!-- Subtle vignette gradient on the left to ensure text pops with high legibility -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"></div>

    <!-- Centered Fixed Wordmark Logo (does not scroll) -->
    <header class="fixed top-2 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex justify-center items-center">
      <img
        src="../assets/logo/lokantra_wordmark.png"
        alt="LOK&#256;NTRA"
        class="h-14 sm:h-18 md:h-22 lg:h-26 max-w-[85vw] w-auto object-contain cursor-pointer select-none filter drop-shadow-[0_3px_16px_rgba(0,0,0,0.08)] hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
        @click="activeModal = null"
        title="LOK&#256;NTRA"
      />
    </header>

    <!-- HERO SECTION (Fixed full-screen, no scrolling) -->
    <main class="h-full w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-28 pt-24 pb-12 relative z-10 overflow-hidden">
      <div class="w-full max-w-xl lg:max-w-2xl relative z-10 flex flex-col items-start text-left">
        <!-- 1. Blurred intro label -->
        <div
          class="pointer-events-none select-none mb-3 sm:mb-4"
          style="font-size: clamp(16px, 2.1vw, 22px); line-height: 1.35; font-weight: 400; color: rgba(0, 0, 0, 0.7); filter: blur(1.5px); font-family: var(--font-body);"
        >
          Hey there, meet LOK&#256;NTRA,<br />
          {{ $t('home.tagline') }}
        </div>

        <!-- 2. CRAZY BOLD HERO HIGHLIGHT: "Upload Reports, Predict The Unseen" -->
        <div class="hero-highlight-wrap mb-4 sm:mb-6 select-none">
          <h1 class="hero-highlight-title">
            <span class="hero-text-dark">Upload Reports,</span>
            <span class="hero-text-gold">Predict The Unseen</span>
          </h1>
        </div>

        <!-- 3. Blurred normal content (Typewriter text) -->
        <p
          class="text-black mb-6 sm:mb-8 select-text pointer-events-none"
          style="font-size: clamp(17px, 2.3vw, 24px); line-height: 1.45; font-weight: 400; min-height: 64px; font-family: var(--font-body); letter-spacing: -0.01em; filter: blur(1.5px);"
        >
          {{ displayedText }}<span v-if="!typewriterDone" class="inline-block w-[2px] h-[1.15em] bg-black align-middle ml-[2px] cursor-blink"></span>
        </p>

        <!-- 3. Action pill buttons -->
        <div
          class="flex flex-wrap items-center gap-2.5 sm:gap-7.5 transition-all duration-500 ease-out pt-2"
          :style="{
            opacity: showPills ? 1 : 0,
            transform: showPills ? 'translateY(0)' : 'translateY(12px)'
          }"
        >
          <button
            @click="activeModal = 'console'"
            class="inline-flex items-center justify-center bg-yellow-400 backdrop-blur-md text-shadow-mist-400 border border-yellow-900 hover:border-white hover:bg-yellow-500 hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[18px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            style="font-family: var(--font-body);"
          >
            Start Simulation
          </button>

          <button
            @click="activeModal = 'workflow'"
            class="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[18px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            style="font-family: var(--font-body);"
          >
            Explore Workflow
          </button>

          <button
            @click="activeModal = 'history'"
            class="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[18px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            style="font-family: var(--font-body);"
          >
            History Database
          </button>

          <button
            @click="activeModal = 'status'"
            class="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[18px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            style="font-family: var(--font-body);"
          >
            System Architecture
          </button>
</div>
      </div>
    </main>

    <!-- Modal Overlays for Features (Keeps page 100% fixed with zero scrolling) -->
    <Transition name="modal-fade">
      <div 
        v-if="activeModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm"
        @click.self="activeModal = null"
      >
        <div class="modal-dialog relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
          <!-- Modal Header Bar -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span class="font-mono text-sm tracking-wider uppercase text-gray-700 font-semibold">
                {{ 
                  activeModal === 'console' ? 'Simulation Console' :
                  activeModal === 'workflow' ? 'Swarm Workflow Architecture' :
                  activeModal === 'history' ? 'Simulation History Database' :
                  'System Status & Architecture'
                }}
              </span>
            </div>
            <button 
              @click="activeModal = null"
              class="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-black hover:text-white flex items-center justify-center text-lg transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="overflow-y-auto p-6 sm:p-8 space-y-6">
            <!-- Modal Content 1: Simulation Console -->
            <div v-if="activeModal === 'console'" class="console-box">
              <!-- Upload Area -->
              <div class="console-section">
                <div class="console-header">
                  <span class="console-label">{{ $t('home.realitySeed') }}</span>
                  <span class="console-meta">{{ $t('home.supportedFormats') }}</span>
                </div>
                
                <div 
                  class="upload-zone"
                  :class="{ 'drag-over': isDragOver, 'has-files': files.length > 0 }"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept=".pdf,.md,.txt"
                    @change="handleFileSelect"
                    style="display: none"
                    :disabled="loading"
                  />
                  
                  <div v-if="files.length === 0" class="upload-placeholder">
                    <div class="upload-icon">&uarr;</div>
                    <div class="upload-title">{{ $t('home.dragToUpload') }}</div>
                    <div class="upload-hint">{{ $t('home.orBrowse') }}</div>
                  </div>
                  
                  <div v-else class="file-list">
                    <div v-for="(file, index) in files" :key="index" class="file-item">
                      <span class="file-icon">&#128196;</span>
                      <span class="file-name">{{ file.name }}</span>
                      <button @click.stop="removeFile(index)" class="remove-btn">&times;</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="console-divider">
                <span>{{ $t('home.inputParams') }}</span>
              </div>

              <!-- Input Area -->
              <div class="console-section">
                <div class="console-header">
                  <span class="console-label">{{ $t('home.simulationPrompt') }}</span>
                </div>
                <div class="input-wrapper">
                  <textarea
                    v-model="formData.simulationRequirement"
                    class="code-input"
                    :placeholder="$t('home.promptPlaceholder')"
                    rows="5"
                    :disabled="loading"
                  ></textarea>
                  <div class="model-badge">{{ $t('home.engineBadge') }}</div>
                </div>
              </div>

              <!-- Start Button -->
              <div class="console-section btn-section">
                <button 
                  class="start-engine-btn"
                  @click="startSimulation"
                  :disabled="!canSubmit || loading"
                >
                  <span v-if="!loading">{{ $t('home.startEngine') }}</span>
                  <span v-else>{{ $t('home.initializing') }}</span>
                  <span class="btn-arrow">&rarr;</span>
                </button>
              </div>
            </div>

            <!-- Modal Content 2: Workflow Sequence -->
            <div v-if="activeModal === 'workflow'" class="steps-container">
              <div class="steps-header">
                <span class="diamond-icon">&#9671;</span> {{ $t('home.workflowSequence') }}
              </div>
              <div class="workflow-list">
                <div class="workflow-item">
                  <span class="step-num">01</span>
                  <div class="step-info">
                    <div class="step-title">{{ $t('home.step01Title') }}</div>
                    <div class="step-desc">{{ $t('home.step01Desc') }}</div>
                  </div>
                </div>
                <div class="workflow-item">
                  <span class="step-num">02</span>
                  <div class="step-info">
                    <div class="step-title">{{ $t('home.step02Title') }}</div>
                    <div class="step-desc">{{ $t('home.step02Desc') }}</div>
                  </div>
                </div>
                <div class="workflow-item">
                  <span class="step-num">03</span>
                  <div class="step-info">
                    <div class="step-title">{{ $t('home.step03Title') }}</div>
                    <div class="step-desc">{{ $t('home.step03Desc') }}</div>
                  </div>
                </div>
                <div class="workflow-item">
                  <span class="step-num">04</span>
                  <div class="step-info">
                    <div class="step-title">{{ $t('home.step04Title') }}</div>
                    <div class="step-desc">{{ $t('home.step04Desc') }}</div>
                  </div>
                </div>
                <div class="workflow-item">
                  <span class="step-num">05</span>
                  <div class="step-info">
                    <div class="step-title">{{ $t('home.step05Title') }}</div>
                    <div class="step-desc">{{ $t('home.step05Desc') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Content 3: History Database -->
            <div v-if="activeModal === 'history'" class="pt-2">
              <HistoryDatabase />
            </div>

            <!-- Modal Content 4: System Architecture & Status -->
            <div v-if="activeModal === 'status'" class="space-y-6">
              <div class="panel-header">
                <span class="status-dot">&#9632;</span> {{ $t('home.systemStatus') }}
              </div>
              <h2 class="section-title">{{ $t('home.systemReady') }}</h2>
              <p class="section-desc">
                {{ $t('home.systemReadyDesc') }}
              </p>
              
              <!-- Data Metrics Card -->
              <div class="metrics-row">
                <div class="metric-card">
                  <div class="metric-value">{{ $t('home.metricLowCost') }}</div>
                  <div class="metric-label">{{ $t('home.metricLowCostDesc') }}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ $t('home.metricHighAvail') }}</div>
                  <div class="metric-label">{{ $t('home.metricHighAvailDesc') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import HistoryDatabase from '../components/HistoryDatabase.vue'

const router = useRouter()

// UI state
const activeModal = ref(null)
const showPills = ref(false)

// Interactive Head Rotation Canvas Engine (0-latency preloaded WebP sequence)
const canvasRef = ref(null)
const TOTAL_FRAMES = 97
const frameImages = []
let loadedFrames = 0
let currentFrame = 48
let targetFrame = 48
let animId = null
let hasDrawnInitial = false

// Typewriter state
const fullTypewriterText = 'Auto-Generate Parallel World. Million-Scale Agents. God\'s-Eye View. Optimal Solution in Complex Dynamics.'
const displayedText = ref('')
const typewriterDone = ref(false)

const drawFrame = (index) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return

  const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)))
  const img = frameImages[idx]
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
}

const preloadFrames = () => {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image()
    img.src = `/frames/f_${String(i).padStart(3, '0')}.webp`
    img.onload = () => {
      loadedFrames++
      if ((i === Math.round(currentFrame) || !hasDrawnInitial) && canvasRef.value) {
        drawFrame(i)
        hasDrawnInitial = true
      }
    }
    frameImages.push(img)
  }
}

const startRenderLoop = () => {
  const render = () => {
    const diff = targetFrame - currentFrame
    if (Math.abs(diff) > 0.02) {
      const factor = Math.abs(diff) > 15 ? 0.45 : 0.28
      currentFrame += diff * factor
      drawFrame(currentFrame)
    }
    animId = requestAnimationFrame(render)
  }
  animId = requestAnimationFrame(render)
}

const handleMouseMove = (e) => {
  const ratio = Math.max(0, Math.min(1, e.clientX / window.innerWidth))
  targetFrame = ratio * (TOTAL_FRAMES - 1)
}

const handleTouchMove = (e) => {
  if (e.touches && e.touches.length > 0) {
    const ratio = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth))
    targetFrame = ratio * (TOTAL_FRAMES - 1)
  }
}

const handleMouseLeave = () => {
  // Preserve current position
}

// Form and file upload logic
const formData = ref({
  simulationRequirement: ''
})
const files = ref([])
const loading = ref(false)
const error = ref('')
const isDragOver = ref(false)
const fileInput = ref(null)

const canSubmit = computed(() => {
  return formData.value.simulationRequirement.trim() !== '' && files.value.length > 0
})

const triggerFileInput = () => {
  if (!loading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  addFiles(selectedFiles)
}

const handleDragOver = (e) => {
  if (!loading.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = (e) => {
  isDragOver.value = false
}

const handleDrop = (e) => {
  isDragOver.value = false
  if (loading.value) return
  const droppedFiles = Array.from(e.dataTransfer.files)
  addFiles(droppedFiles)
}

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase()
    return ['pdf', 'md', 'txt'].includes(ext)
  })
  files.value.push(...validFiles)
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const startSimulation = () => {
  if (!canSubmit.value || loading.value) return
  
  import('../store/pendingUpload.js').then(({ setPendingUpload }) => {
    setPendingUpload(files.value, formData.value.simulationRequirement)
    router.push({
      name: 'Process',
      params: { projectId: 'new' }
    })
  })
}

// Lifecycle hooks
onMounted(() => {
  // Show pill buttons after 400ms independently
  setTimeout(() => {
    showPills.value = true
  }, 400)

  // Start typewriter after 600ms startDelay at 38ms speed
  let timer = null
  let interval = null
  timer = setTimeout(() => {
    let currentIndex = 0
    interval = setInterval(() => {
      if (currentIndex < fullTypewriterText.length) {
        displayedText.value = fullTypewriterText.slice(0, currentIndex + 1)
        currentIndex++
      } else {
        typewriterDone.value = true
        if (interval) clearInterval(interval)
      }
    }, 38)
  }, 600)

  // Initialize canvas frame sequence & render loop
  preloadFrames()
  startRenderLoop()

  // Attach mouse and touch scrub listeners to window
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('mouseleave', handleMouseLeave)

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    if (interval) clearInterval(interval)
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
  })
})
</script>

<style scoped>
:root {
  --black: #000000;
  --white: #FFFFFF;
  --orange: #FF4500;
  --gray-light: #F5F5F5;
  --gray-text: #666666;
  --border: #E5E5E5;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Space Grotesk', 'Noto Sans SC', system-ui, sans-serif;
}

.home-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--white);
  color: var(--black);
}

/* --- Bold Unique Hero Highlight Line --- */
.hero-highlight-wrap {
  position: relative;
  user-select: none;
}

.hero-highlight-title {
  font-family: var(--font-display, 'Syne', 'ClashDisplay', sans-serif);
  font-size: clamp(32px, 5.2vw, 62px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.038em;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  margin: 0;
}

.hero-text-dark {
  color: #050505;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
}

.hero-text-gold {
  background: linear-gradient(125deg, #92400e 0%, #b45309 18%, #d97706 38%, #f59e0b 58%, #fef08a 78%, #f59e0b 90%, #d97706 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gold-shimmer 6s linear infinite;
  filter: drop-shadow(0 2px 18px rgba(245, 158, 11, 0.35));
  display: inline-block;
}

@keyframes gold-shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.modal-dialog {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Left panel */
.panel-header {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.status-dot {
  color: var(--orange);
  font-size: 0.8rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 520;
  margin: 0 0 15px 0;
}

.section-desc {
  color: var(--gray-text);
  margin-bottom: 25px;
  line-height: 1.6;
}

.metrics-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.metric-card {
  border: 1px solid var(--border);
  padding: 20px 30px;
  min-width: 150px;
  background: #ffffff;
}

.metric-value {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 520;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 0.85rem;
  color: #999;
}

/* Project simulation steps intro */
.steps-container {
  border: 1px solid var(--border);
  padding: 30px;
  position: relative;
  background: #ffffff;
}

.steps-header {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.diamond-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.workflow-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.workflow-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.step-num {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--black);
  opacity: 0.3;
}

.step-info {
  flex: 1;
}

.step-title {
  font-weight: 520;
  font-size: 1rem;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 0.85rem;
  color: var(--gray-text);
}

/* Console Box */
.console-box {
  border: 1px solid #CCC;
  padding: 8px;
  background: #ffffff;
}

.console-section {
  padding: 20px;
}

.console-section.btn-section {
  padding-top: 0;
}

.console-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #666;
}

.upload-zone {
  border: 1px dashed #CCC;
  height: 180px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #FAFAFA;
}

.upload-zone.has-files {
  align-items: flex-start;
}

.upload-zone:hover {
  background: #F0F0F0;
  border-color: #999;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  width: 40px;
  height: 40px;
  border: 1px solid #DDD;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: #999;
}

.upload-title {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.upload-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #999;
}

.file-list {
  width: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  background: var(--white);
  padding: 8px 12px;
  border: 1px solid #EEE;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.file-name {
  flex: 1;
  margin: 0 10px;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
}

.console-divider {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.console-divider::before,
.console-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #EEE;
}

.console-divider span {
  padding: 0 15px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #BBB;
  letter-spacing: 1px;
}

.input-wrapper {
  position: relative;
  border: 1px solid #DDD;
  background: #FAFAFA;
}

.code-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  min-height: 130px;
}

.model-badge {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #AAA;
}

.start-engine-btn {
  width: 100%;
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 18px;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.start-engine-btn:not(:disabled) {
  background: var(--black);
  border: 1px solid var(--black);
  animation: pulse-border 2s infinite;
}

.start-engine-btn:hover:not(:disabled) {
  background: var(--orange);
  border-color: var(--orange);
}

.start-engine-btn:disabled {
  background: #E5E5E5;
  color: #999;
  cursor: not-allowed;
  transform: none;
  border: 1px solid #E5E5E5;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2); }
  70% { box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
}
</style>
