import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Safiullah Sadi",
  description: "Full-Stack Software Engineer | Game Developer | Geospatial & Real-Time Simulation Specialist",
  base: '/portfolio/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Safiullah Sadi - Full-Stack Software Engineer' }],
    ['meta', { property: 'og:description', content: '10+ years experience in Unity game development, full-stack web development, and geospatial simulation systems' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Safiullah Sadi',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Projects', link: '/projects' },
      { text: 'Skills', link: '/skills' },
      { text: 'Contact', link: '/contact' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Xaifullah/Intro' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/xaifullahxady' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright 2024-present Safiullah Sadi'
    },

    search: {
      provider: 'local'
    }
  }
})
