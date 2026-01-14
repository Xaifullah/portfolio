<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const message = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: "Hi! I'm Sadi's AI assistant. Ask me anything about his skills, projects, or experience!"
  }
])

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const getFallbackResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()

  if (msg.includes('contact') || msg.includes('email') || msg.includes('hire') || msg.includes('reach') || msg.includes('available')) {
    return "You can reach Sadi at saifullahsadi@hotmail.com. He's open to full-time, contract, and remote opportunities worldwide. You can also connect on LinkedIn: linkedin.com/in/xaifullahxady"
  }
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('language')) {
    return "Sadi's technical skills include: C#, TypeScript, JavaScript, Python | Unity3D (10 years), Vue.js, React, Node.js | CesiumJS, OpenLayers, 3D Tiles | Git, Docker, AWS, Firebase. He's experienced with Steam, Google Play, App Store, and more platforms."
  }
  if (msg.includes('game') || msg.includes('unity')) {
    return "Sadi has published 100+ games and contributed to 300+ projects on Google Play, App Store, Steam, Amazon, and Huawei. He built an FPS Kit from scratch, created reusable Unity plugins (reducing dev time by 40%), and implemented AI/NPC systems with pathfinding and state machines."
  }
  if (msg.includes('experience') || msg.includes('year') || msg.includes('work')) {
    return "Sadi is a Senior Game Developer & Full-Stack Engineer with 10+ years of experience (2014 - Present). He specializes in game development, geospatial/3D simulation systems, and full-stack web development."
  }
  if (msg.includes('project')) {
    return "Key projects: 1) Geospatial Visualization Platform (CesiumJS, Vue.js) - 2D/3D mapping with analysis tools, 2) Unity Terrain Generator Plugin - real-world terrain from elevation data, 3) Maians - 3D Avatar Platform with SDK, 4) FPS Game Kit - foundation for 10+ published games."
  }
  if (msg.includes('education') || msg.includes('degree') || msg.includes('study') || msg.includes('university') || msg.includes('cgpa') || msg.includes('gpa')) {
    return "Sadi holds a Bachelor of Science in Computer Science with a 3.45 CGPA from Pakistan. He continues learning through game jams, hackathons, and is currently exploring MCP, AI Agentic Systems, and LLM Integration."
  }
  if (msg.includes('geospatial') || msg.includes('gis') || msg.includes('map') || msg.includes('cesium') || msg.includes('terrain')) {
    return "In geospatial development, Sadi has built Defense Planning & 3D Simulation Systems, a Unity Terrain Generator Plugin, Line of Sight and Viewshed Analysis tools, and Dual-Map systems with synchronized 2D/3D views using CesiumJS and OpenLayers."
  }
  if (msg.includes('web') || msg.includes('frontend') || msg.includes('backend') || msg.includes('vue') || msg.includes('react')) {
    return "For web development, Sadi works with Vue.js, React, TypeScript, Node.js, and Express. Notable projects include Maians (3D Avatar Platform) and Crib & Condo (Virtua Metaverse). He builds full-stack apps with REST APIs, WebSocket features, and Firebase."
  }
  if (msg.includes('hobby') || msg.includes('hobbies') || msg.includes('interest') || msg.includes('free time') || msg.includes('outside work')) {
    return "Outside of work, Sadi is an adventure motorcycle rider! He loves touring the stunning northern areas of Pakistan on his bike and is a proud member of the Pakistani biker community."
  }
  if (msg.includes('personality') || msg.includes('character') || msg.includes('attitude') || msg.includes('person') || msg.includes('like to work') || msg.includes('team')) {
    return "Sadi is a collaborative team player with a positive attitude. He's known for analytical thinking, creative problem-solving, and adapting quickly to new technologies. He brings a friendly and professional approach to every project."
  }
  if (msg.includes('motorcycle') || msg.includes('bike') || msg.includes('riding') || msg.includes('biker')) {
    return "Sadi is an adventure motorcycle enthusiast! He regularly tours the beautiful northern areas of Pakistan and is an active member of the Pakistani biker community. The open road is where he finds inspiration!"
  }
  if (msg.includes('cv') || msg.includes('resume') || msg.includes('download')) {
    return "You can download Sadi's full CV/Resume by clicking the 'Download CV' button in the website header. It includes detailed information about his experience, skills, and projects."
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('what can you')) {
    return "Hello! I'm here to help you learn about Sadi. You can ask me about his skills, experience, projects, education, personality, hobbies, or how to contact him. What would you like to know?"
  }

  return "Sadi is a Full-Stack Engineer with 10+ years of experience in game development (100+ published games), geospatial systems, and web development. He holds a BS in Computer Science (3.45 CGPA) and is open to remote opportunities. Feel free to ask specific questions or reach out at saifullahsadi@hotmail.com!"
}

const SYSTEM_PROMPT = `You are a friendly and professional AI assistant for Safiullah Sadi's portfolio website. Your role is to help visitors and recruiters learn about Sadi's experience, skills, and background.

=== RESUME/CV DATA ===

PROFESSIONAL SUMMARY:
Full-Stack Software Engineer with 10+ years of experience in game development, geospatial systems, and web applications. Published 100+ games and contributed to 300+ projects across Android, iOS, PC (Steam), Amazon, and Huawei AppGallery. Expert in Unity3D, C#, Vue.js, React, TypeScript, and Node.js. Strong problem-solver with collaborative mindset.

TECHNICAL SKILLS:
- Languages: C#, TypeScript, JavaScript, Python, SQL, HTML5, CSS3
- Game Development: Unity3D (10 years), Game Physics, AI/NPC Systems, Mobile & PC Publishing
- Frontend: Vue.js, React.js, VitePress, Tailwind CSS, SPA, State Management (Vuex, Redux)
- Backend: Node.js, Express.js, REST APIs, Firebase, Real-time Databases, Authentication
- Geospatial: CesiumJS, OpenLayers, 3D Tiles, GIS, Terrain Generation, Spatial Analysis
- Tools: Git, Docker, AWS, Steam, Google Play, App Store, Amazon Appstore, Huawei AppGallery

PROFESSIONAL EXPERIENCE (2014 - Present):
Senior Game Developer & Full-Stack Engineer | Various Studios & Independent Development | Pakistan (Remote)

Geospatial & 3D Simulation:
- Developed Defense Planning & 3D Simulation Systems for strategic visualization
- Built Unity Terrain Generator Plugin using online elevation data and satellite imagery
- Implemented Line of Sight (LOS) and Viewshed Analysis tools for terrain evaluation
- Created Dual-Map systems with synchronized 2D/3D views using CesiumJS and OpenLayers
- Developed real-time 3D visualization using 3D Tiles for large-scale geospatial rendering

Web Development:
- Maians (maians.io): 3D Avatar Platform with cross-platform SDK for web/mobile integration
- Crib & Condo (Virtua Metaverse): Social 3D environments with real-time multiplayer
- Built full-stack applications with Vue.js/React frontend and Node.js backend
- Developed RESTful APIs and real-time features using WebSocket connections

Game Development:
- Published 100+ games from concept to release on Google Play, App Store, Steam, Amazon, Huawei
- Contributed to 300+ game projects as lead developer, gameplay programmer, and technical consultant
- Built FPS Kit from scratch with modern controls, realistic physics, weapon mechanics, and AI behavior
- Created reusable Unity packages and plugins reducing development time by 40%
- Implemented AI/NPC systems including pathfinding, decision trees, and state machines
- Developed games across genres: Simulation, Hyper-Casual, Action, Shooting, Racing, Arcade
- Integrated analytics, monetization (ads, IAP), and social features into mobile games

KEY PROJECTS:
1. Geospatial Visualization Platform (CesiumJS, OpenLayers, Vue.js) - Interactive 2D/3D mapping with Line of Sight and Viewshed analysis tools, real-time data overlay
2. Unity Terrain Generator Plugin (Unity3D, C#, REST APIs) - Generates real-world terrain meshes from elevation data with automatic satellite texture mapping. Used in defense simulation applications
3. 3D Avatar Platform - Maians (Vue.js, Node.js, WebGL) - Web-based avatar creation platform with cross-platform SDK and real-time rendering system
4. FPS Game Development Kit (Unity3D, C#) - Comprehensive first-person shooter framework with weapon system, AI enemies, level progression. Foundation for 10+ published games

EDUCATION:
Bachelor of Science in Computer Science | 3.45 CGPA | Pakistan

CURRENTLY LEARNING:
- MCP (Model Context Protocol)
- AI Agentic Systems
- LLM Integration
- Regular participation in game jams and hackathons
- Active contributor to Unity developer community

PERSONALITY & WORK STYLE:
- Collaborative team player with positive attitude
- Analytical thinking and creative problem-solver
- Friendly and professional in workplace interactions
- Comfortable working in fast-paced environments
- Adapts quickly to new technologies

LANGUAGES:
- English (Professional)
- Urdu (Native)

HOBBIES & INTERESTS:
- Adventure motorcycle touring across northern Pakistan
- Active and proud member of Pakistani biker community
- Loves exploring new places and the thrill of the open road

AVAILABILITY:
Open to full-time, contract, and remote opportunities worldwide

CONTACT:
- Email: saifullahsadi@hotmail.com
- GitHub: github.com/Xaifullah
- LinkedIn: linkedin.com/in/xaifullahxady
- Location: Pakistan

=== INSTRUCTIONS ===
- Be concise but informative
- Be friendly and professional
- Answer questions based on the CV data above
- If asked about hiring, availability, or contact, provide the email and mention he's open to remote work
- If asked about personality or work style, highlight his friendly nature, problem-solving skills, and collaborative mindset
- If asked about hobbies or interests, share his passion for adventure motorcycle riding in northern Pakistan
- If asked about education, mention BS in Computer Science with 3.45 CGPA
- If asked about specific technologies, refer to the technical skills section
- If you don't know something specific not covered in the CV, say so politely
- Visitors can download the full CV from the website header`

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!message.value.trim() || isLoading.value) return

  const userMessage = message.value.trim()
  messages.value.push({ role: 'user', content: userMessage })
  message.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const conversationHistory = messages.value.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }]
            },
            {
              role: 'model',
              parts: [{ text: 'Understood! I am ready to help visitors learn about Safiullah Sadi.' }]
            },
            ...conversationHistory
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    )

    const data = await response.json()

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const assistantMessage = data.candidates[0].content.parts[0].text
      messages.value.push({ role: 'assistant', content: assistantMessage })
    } else {
      // API error or no response - use fallback
      messages.value.push({
        role: 'assistant',
        content: getFallbackResponse(userMessage)
      })
    }
  } catch (error) {
    // Network error or other issue - use fallback
    messages.value.push({
      role: 'assistant',
      content: getFallbackResponse(userMessage)
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="chatbot-container">
    <!-- Chat Window -->
    <Transition name="chat">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">SS</div>
            <div>
              <div class="chat-title">Sadi's Assistant</div>
              <div class="chat-status">Ask me anything!</div>
            </div>
          </div>
          <button class="chat-close" @click="toggleChat" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="chat-messages" ref="chatContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-message', msg.role]"
          >
            <div class="message-content">{{ msg.content }}</div>
          </div>
          <div v-if="isLoading" class="chat-message assistant">
            <div class="message-content typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <div class="chat-input-container">
          <input
            v-model="message"
            type="text"
            placeholder="Type your message..."
            class="chat-input"
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
          <button
            class="chat-send"
            @click="sendMessage"
            :disabled="isLoading || !message.trim()"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      class="chat-toggle"
      @click="toggleChat"
      :class="{ 'is-open': isOpen }"
      aria-label="Toggle chat"
    >
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--vp-font-family-base);
}

.chat-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.chat-toggle.is-open {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  height: 500px;
  max-height: calc(100vh - 120px);
  background: var(--vp-c-bg);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.chat-title {
  font-weight: 600;
  font-size: 16px;
}

.chat-status {
  font-size: 12px;
  opacity: 0.9;
}

.chat-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  max-width: 85%;
  animation: messageIn 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user {
  align-self: flex-end;
}

.chat-message.assistant {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-message.user .message-content {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.assistant .message-content {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 4px;
}

.typing {
  display: flex;
  gap: 4px;
  padding: 16px 20px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--vp-c-text-3);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); }
  40% { transform: scale(1.2); }
}

.chat-input-container {
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  gap: 8px;
  background: var(--vp-c-bg);
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  font-size: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: var(--vp-c-brand-1);
}

.chat-input::placeholder {
  color: var(--vp-c-text-3);
}

.chat-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;
}

.chat-send:hover:not(:disabled) {
  transform: scale(1.05);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 16px;
    right: 16px;
  }

  .chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    bottom: 65px;
    right: -8px;
  }

  .chat-toggle {
    width: 50px;
    height: 50px;
  }
}
</style>
