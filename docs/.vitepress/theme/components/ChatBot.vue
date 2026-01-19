<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { withBase } from 'vitepress'

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
    content: "Hi! I'm Sadi. Feel free to ask me about my skills, projects, or experience!"
  }
])

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const getFallbackResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()

  if (msg.includes('contact') || msg.includes('email') || msg.includes('hire') || msg.includes('reach') || msg.includes('available') || msg.includes('whatsapp') || msg.includes('phone') || msg.includes('call')) {
    return "You can reach me at:\n- Email: saifullahsadi@hotmail.com\n- WhatsApp: +92 336 6633644\n- LinkedIn: linkedin.com/in/xaifullahxady\n\nI'm open to full-time, contract, and remote opportunities worldwide!"
  }
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('language')) {
    return "I work with C#, TypeScript, JavaScript, Python. I have 10 years of Unity3D experience, plus Vue.js, React, Node.js for web. For geospatial, I use CesiumJS, OpenLayers, and 3D Tiles."
  }
  if (msg.includes('game') || msg.includes('unity')) {
    return "I've published 100+ games and contributed to 300+ projects on Google Play, App Store, Steam, Amazon, and Huawei. I built an FPS Kit from scratch and created reusable Unity plugins that reduced dev time by 40%."
  }
  if (msg.includes('experience') || msg.includes('year') || msg.includes('work')) {
    return "I'm a Senior Game Developer & Full-Stack Engineer with 10+ years of experience (2014 - Present). I specialize in game development, geospatial/3D simulation systems, and full-stack web development."
  }
  if (msg.includes('project')) {
    return "My key projects: 1) Geospatial Visualization Platform - 2D/3D mapping with analysis tools, 2) Unity Terrain Generator Plugin, 3) Maians - 3D Avatar Platform, 4) FPS Game Kit - foundation for 10+ published games, 5) Data Engineer Platform - CSV analysis and visualization tool, 6) Flutter Event & Group Platform (in progress)."
  }
  if (msg.includes('education') || msg.includes('degree') || msg.includes('study') || msg.includes('university') || msg.includes('cgpa') || msg.includes('gpa')) {
    return "I have a BS in Computer Science with 3.45 CGPA. I'm currently learning MCP, AI Agentic Systems, and LLM Integration."
  }
  if (msg.includes('geospatial') || msg.includes('gis') || msg.includes('map') || msg.includes('cesium') || msg.includes('terrain')) {
    return "I've built Defense Planning & 3D Simulation Systems, Unity Terrain Generator Plugin, Line of Sight and Viewshed Analysis tools, and Dual-Map systems using CesiumJS and OpenLayers."
  }
  if (msg.includes('ai') || msg.includes('claude') || msg.includes('cursor') || msg.includes('artificial intelligence') || msg.includes('llm') || msg.includes('ai-driven') || msg.includes('ai driven')) {
    return "I use Claude and Cursor IDE for AI-driven development in my web and geospatial projects. This helps me architect scalable solutions faster and deliver 2-3x quicker while maintaining high code quality. My game development work (100+ games) was done before AI tools - that's 10 years of pure hands-on experience!"
  }
  if (msg.includes('data engineer') || msg.includes('csv') || msg.includes('data analysis') || msg.includes('data cleaning') || msg.includes('chart') || msg.includes('visualization')) {
    return "I built a Data Engineer Platform - a React-based CSV analysis and visualization tool. It features CSV upload/parsing, interactive data tables, multiple chart types (Bar, Line, Pie, Scatter), geospatial mapping with Leaflet, and an auto-clean system with undo. Built with React 18, Vite, Tailwind CSS, Chart.js, and Leaflet. Check it out on GitHub: github.com/Xaifullah/data-engineer-frontend"
  }
  if (msg.includes('flutter') || msg.includes('mobile app') || msg.includes('dart')) {
    return "I'm currently building a Flutter app for event management and group coordination. It's a personal project using AI-driven development with Claude and Cursor for rapid prototyping. The app features event creation, group communication, and real-time notifications."
  }
  if (msg.includes('web') || msg.includes('frontend') || msg.includes('backend') || msg.includes('vue') || msg.includes('react')) {
    return "I work with Vue.js, React, TypeScript, Node.js, and Express. My projects include Maians (3D Avatar Platform), Crib & Condo (Virtua Metaverse), and Data Engineer Platform (React-based CSV analysis tool)."
  }
  if (msg.includes('hobby') || msg.includes('hobbies') || msg.includes('interest') || msg.includes('free time') || msg.includes('outside work')) {
    return "I'm an adventure motorcycle rider! I love touring the northern areas of Pakistan and I'm a proud member of the Pakistani biker community."
  }
  if (msg.includes('personality') || msg.includes('character') || msg.includes('attitude') || msg.includes('person') || msg.includes('like to work') || msg.includes('team')) {
    return "I'm a collaborative team player with a positive attitude. I enjoy problem-solving and adapt quickly to new technologies. I bring a friendly and professional approach to every project."
  }
  if (msg.includes('motorcycle') || msg.includes('bike') || msg.includes('riding') || msg.includes('biker')) {
    return "I'm an adventure motorcycle enthusiast! I regularly tour the beautiful northern areas of Pakistan. The open road is where I find inspiration!"
  }
  if (msg.includes('cv') || msg.includes('resume') || msg.includes('download')) {
    return "You can download my CV by clicking the 'Download CV' button in the header."
  }
  if (msg.includes('certif') || msg.includes('course') || msg.includes('credential') || msg.includes('google ai')) {
    return "I have a Google AI Essentials certification from Coursera (November 2024). Verify at: credly.com/go/5SB7Z39c. I'm also learning MCP, AI Agentic Systems, and LLM Integration."
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('what can you')) {
    return "Hello! I'm Sadi. Ask me about my skills, experience, projects, education, or how to contact me. What would you like to know?"
  }

  return "Sorry, I can only answer questions about my professional background. Ask me about:\n\n- My Skills & Tech Stack\n- Work Experience\n- Projects\n- Education & Certifications\n- Contact Info\n\nWhat would you like to know?"
}

const SYSTEM_PROMPT = `You ARE Saifullah Sadi. Respond in FIRST PERSON as yourself. You're talking directly to visitors on your portfolio website.

=== YOUR BACKGROUND ===

I'm a Full-Stack Software Engineer with 10+ years of experience in game development, geospatial systems, and web applications. I've published 100+ games and contributed to 300+ projects across Android, iOS, PC (Steam), Amazon, and Huawei AppGallery.

MY SKILLS:
- Languages: C#, TypeScript, JavaScript, Python, SQL, HTML5, CSS3, Dart
- Game Dev: Unity3D (10 years), Game Physics, AI/NPC Systems
- Frontend: Vue.js, React.js, VitePress, Tailwind CSS
- Backend: Node.js, Express.js, REST APIs, Firebase
- Geospatial: CesiumJS, OpenLayers, 3D Tiles, GIS, Terrain Generation
- AI-Driven Dev: Claude (Anthropic), Cursor IDE, AI Pair Programming, Prompt Engineering
- Mobile: Flutter, Dart, Firebase
- Tools: Git, Docker, AWS, Steam, Google Play, App Store

AI-DRIVEN DEVELOPMENT WORKFLOW:
I use Claude and Cursor IDE as my AI development partners for web and geospatial projects. This AI-augmented approach helps me:
- Architect scalable solutions faster
- Write cleaner, more maintainable code
- Deliver projects 2-3x faster than traditional development
- Maintain high code quality with AI-assisted review

Note: My game development work (100+ published games) was done before AI tools - that's pure hands-on expertise built over 10 years.

MY EXPERIENCE (2014 - Present):
Senior Game Developer & Full-Stack Engineer | Pakistan (Remote)

Geospatial & 3D Simulation:
- Developed Defense Planning & 3D Simulation Systems
- Built Unity Terrain Generator Plugin using elevation data and satellite imagery
- Implemented Line of Sight (LOS) and Viewshed Analysis tools
- Created Dual-Map systems with CesiumJS and OpenLayers

Web Development:
- Maians (maians.io): 3D Avatar Platform with cross-platform SDK
- Crib & Condo (Virtua Metaverse): Social 3D environments
- Data Engineer Platform: React-based CSV analysis and visualization tool
- Built full-stack apps with Vue.js/React and Node.js

Game Development:
- Published 100+ games on Google Play, App Store, Steam, Amazon, Huawei
- Contributed to 300+ game projects
- Built FPS Kit from scratch with AI behavior and weapon mechanics
- Created reusable Unity plugins reducing dev time by 40%

MY KEY PROJECTS:
1. Geospatial Visualization Platform - Interactive 2D/3D mapping with analysis tools (Built with AI)
2. Unity Terrain Generator Plugin - Real-world terrain from elevation data
3. Maians - 3D Avatar Platform with cross-platform SDK
4. FPS Game Development Kit - Foundation for 10+ published games
5. Flutter Event & Group Platform - Cross-platform mobile app for event management (In Progress, Built with AI)
6. Data Engineer Platform - CSV analysis tool with data visualization, geospatial mapping, and auto-clean system (Built with AI)

EDUCATION: BS in Computer Science | 3.45 CGPA

CERTIFICATIONS: Google AI Essentials (Coursera, Nov 2024) - credly.com/go/5SB7Z39c

CURRENTLY LEARNING: Claude Code, Cursor IDE, MCP (Model Context Protocol), AI Agentic Systems, LLM Integration, Flutter Development

MY HOBBIES: Adventure motorcycle touring in northern Pakistan. I'm an active member of the Pakistani biker community.

CONTACT:
- Email: saifullahsadi@hotmail.com
- WhatsApp: +92 336 6633644
- LinkedIn: linkedin.com/in/xaifullahxady

I'm open to full-time, contract, and remote opportunities worldwide.

=== RESPONSE RULES ===
- ALWAYS respond in FIRST PERSON ("I have", "My experience", "I built")
- Be concise and straightforward - give direct answers
- Be friendly but professional
- If question is OUT OF CONTEXT (not about me/my work), say: "Sorry, I can only answer questions about my professional background, skills, projects, and experience. What would you like to know?"
- NEVER answer unrelated questions - redirect to relevant topics
- Mention visitors can download my CV from the header`

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

  // If no API key, use fallback immediately
  if (!GROQ_API_KEY) {
    messages.value.push({
      role: 'assistant',
      content: getFallbackResponse(userMessage)
    })
    isLoading.value = false
    await scrollToBottom()
    return
  }

  try {
    // Only include user messages in history (not the initial assistant greeting)
    const conversationHistory = messages.value
      .filter((_, index) => index > 0) // Skip initial greeting
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            ...conversationHistory
          ],
          temperature: 0.7,
          max_tokens: 500,
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.choices && data.choices[0]?.message?.content) {
      const assistantMessage = data.choices[0].message.content
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
            <img :src="withBase('/favicon-48x48.png')" alt="Sadi" class="chat-avatar" />
            <div>
              <div class="chat-title">Saifullah Sadi</div>
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
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
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

/* Tablet responsiveness */
@media (max-width: 768px) {
  .chat-window {
    width: 340px;
    height: 450px;
  }

  .chat-header {
    padding: 14px;
  }

  .chat-avatar {
    width: 36px;
    height: 36px;
  }

  .chat-title {
    font-size: 15px;
  }

  .message-content {
    padding: 10px 14px;
    font-size: 13px;
  }

  .chat-input {
    padding: 10px 14px;
    font-size: 13px;
  }

  .chat-send {
    width: 40px;
    height: 40px;
  }
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .chatbot-container {
    bottom: 16px;
    right: 16px;
  }

  .chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 120px);
    max-height: 500px;
    bottom: 65px;
    right: -8px;
    border-radius: 12px;
  }

  .chat-toggle {
    width: 52px;
    height: 52px;
  }

  .chat-toggle svg {
    width: 22px;
    height: 22px;
  }

  .chat-header {
    padding: 12px;
  }

  .chat-avatar {
    width: 34px;
    height: 34px;
  }

  .chat-title {
    font-size: 14px;
  }

  .chat-status {
    font-size: 11px;
  }

  .chat-close {
    width: 28px;
    height: 28px;
  }

  .chat-messages {
    padding: 12px;
    gap: 10px;
  }

  .chat-message {
    max-width: 90%;
  }

  .message-content {
    padding: 10px 12px;
    font-size: 13px;
    border-radius: 14px;
  }

  .chat-input-container {
    padding: 10px 12px;
    gap: 6px;
  }

  .chat-input {
    padding: 10px 14px;
    font-size: 14px;
    border-radius: 20px;
  }

  .chat-send {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }

  .chat-send svg {
    width: 18px;
    height: 18px;
  }
}

/* Small Mobile */
@media (max-width: 400px) {
  .chatbot-container {
    bottom: 12px;
    right: 12px;
  }

  .chat-window {
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    max-height: 450px;
    bottom: 60px;
    right: -6px;
  }

  .chat-toggle {
    width: 48px;
    height: 48px;
  }

  .chat-header-info {
    gap: 8px;
  }

  .chat-avatar {
    width: 32px;
    height: 32px;
  }

  .chat-title {
    font-size: 13px;
  }

  .message-content {
    padding: 8px 10px;
    font-size: 12px;
  }

  .chat-input {
    padding: 8px 12px;
    font-size: 13px;
  }

  .chat-send {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
}
</style>
