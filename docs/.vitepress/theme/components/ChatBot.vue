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

const GEMINI_API_KEY = 'AIzaSyDNpJ2ZOdYJkXKs1xZypXoTc9n0wNWspV8'

const SYSTEM_PROMPT = `You are a friendly and professional AI assistant for Safiullah Sadi's portfolio website. Your role is to help visitors and recruiters learn about Sadi's experience and skills.

About Safiullah Sadi:
- Full-Stack Software Engineer with 10+ years of experience
- Specializes in three key areas:
  1. Unity Game Development (10 years)
  2. Geospatial & 3D Simulation (CesiumJS, OpenLayers)
  3. Full-Stack Web Development (Vue.js, React, Node.js)

Game Development Experience:
- Published 100+ games from scratch
- Participated in 300+ game projects
- Platforms: Android, iOS, PC (Steam), Amazon, Huawei AppGallery
- Created reusable Unity packages and plugins
- Built FPS Kit from scratch with modern controls and realistic physics
- Developed AI/NPC behavior systems for action games
- Genres: Simulation, Hyper-Casual, Action, Shooting, Arcade

Geospatial & GIS Work:
- Defense Planning & 3D Simulation Systems
- Unity Terrain Generator Plugin (generates real-world terrains from online data)
- Custom spatial analysis tools: Line of Sight, Viewshed Analysis
- Dual-Map systems with 2D/3D synchronization
- Technologies: CesiumJS, OpenLayers, 3D Tiles

Web Development:
- Maians (maians.io) - 3D Avatar Platform with cross-platform SDK
- Crib & Condo (Virtua Metaverse) - Social 3D environments
- Full-stack with Vue.js, React, TypeScript, Node.js

Currently Learning:
- MCP (Model Context Protocol)
- AI Agentic Systems
- LLM Integration

Contact: saifullahsadi@hotmail.com
GitHub: github.com/Xaifullah
LinkedIn: linkedin.com/in/xaifullahxady

Instructions:
- Be concise but informative
- Be friendly and professional
- If asked about hiring, availability, or contact, provide the email
- If you don't know something specific, say so politely
- Keep responses focused on Sadi's professional experience`

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
    } else if (data.error) {
      messages.value.push({
        role: 'assistant',
        content: `Sorry, I encountered an error. Please try again later. (${data.error.message || 'Unknown error'})`
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again."
      })
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: "Sorry, I'm having trouble connecting. Please try again later."
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
