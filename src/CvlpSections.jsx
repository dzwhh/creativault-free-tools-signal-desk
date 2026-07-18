// Sections ported from the cvlp landing repo (github.com/dzwhh/cvlp):
// the Features bento grid, sticky-scroll Tools showcase, and Testimonials
// slider. Interactions and assets match the source; surfaces are restyled
// for this site's light theme tokens.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence, motion, useAnimate, useMotionValueEvent, useScroll, useTransform,
} from 'framer-motion'
import createGlobe from 'cobe'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { Eye, Sparkles, Trophy, Users } from 'lucide-react'
import { FaBolt } from 'react-icons/fa'
import { GoCopilot } from 'react-icons/go'
import { TbLocationBolt } from 'react-icons/tb'
import { SiClaude, SiGooglegemini, SiMeta } from 'react-icons/si'
import { BrandIcon } from './brand-icons.jsx'
import { homeCopy } from './home-data.js'
import './cvlp-sections.css'

/* ---------- shared ---------- */

function SectionBadge({ children }) {
  return (
    <div className="cv-badge-perspective" aria-hidden="true">
      <div className="cv-badge">
        <div className="cv-badge-face">{children}</div>
        <i className="cv-badge-glow" />
        <i className="cv-badge-line" />
        <i className="cv-badge-line blur" />
      </div>
    </div>
  )
}

const particlesInit = async (engine) => { await loadSlim(engine) }

function SparklesCore({ id, className, particleColor = '#1677ff', particleDensity = 120, minSize = 0.4, maxSize = 1 }) {
  const options = useMemo(() => ({
    background: { color: { value: 'transparent' } },
    fullScreen: { enable: false },
    fpsLimit: 120,
    particles: {
      color: { value: particleColor },
      move: { enable: true, speed: { min: 0.1, max: 1 }, direction: 'none', outModes: { default: 'out' } },
      number: { density: { enable: true, width: 400, height: 400 }, value: particleDensity },
      opacity: { value: { min: 0.35, max: 1 }, animation: { enable: true, speed: 4, startValue: 'random' } },
      size: { value: { min: minSize, max: maxSize } },
      shape: { type: 'circle' },
    },
    detectRetina: true,
  }), [particleColor, particleDensity, minSize, maxSize])
  return (
    <div className={className}>
      <ParticlesProvider init={particlesInit}>
        <Particles id={id} className="cv-particles" options={options} />
      </ParticlesProvider>
    </div>
  )
}

function AnimatedStrokeGradient({ id }) {
  return (
    <motion.linearGradient
      initial={{ x1: '0%', y1: '0%', x2: '0%', y2: '0%' }}
      animate={{ x1: '100%', y1: '90%', x2: '120%', y2: '120%' }}
      id={id}
      transition={{ duration: Math.random() * 5 + 2, ease: 'linear', repeat: Infinity }}
    >
      <stop stopColor="#001AFF" stopOpacity="0" />
      <stop offset="1" stopColor="#1677ff" />
      <stop offset="1" stopColor="#1677ff" stopOpacity="0" />
    </motion.linearGradient>
  )
}

/* ---------- features: skeleton one (platform icons) ---------- */

const chipRowOne = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Snapchat', 'Google Ads', 'Shopify']
const chipRowTwo = ['Snapchat', 'Google Ads', 'Shopify', 'Instagram', 'TikTok', 'YouTube', 'Facebook']

const connectorPathA = 'M1.00001 -69L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105'
const connectorPathB = 'M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75'

function SkeletonPlatforms() {
  return (
    <div className="cv-skel">
      <div className="cv-skel-platforms">
        <div className="cv-chip-row">
          <svg width="62" height="105" viewBox="0 0 62 105" fill="none" className="cv-connector cv-connector-a">
            <path d={connectorPathA} stroke="currentColor" strokeWidth="1.5" />
            <motion.path d={connectorPathA} stroke="url(#cv-grad-1)" strokeWidth="1.5" />
            <defs><AnimatedStrokeGradient id="cv-grad-1" /></defs>
          </svg>
          <svg width="128" height="69" viewBox="0 0 128 69" fill="none" className="cv-connector cv-connector-b">
            <path d={connectorPathB} stroke="currentColor" strokeWidth="1.5" />
            <motion.path d={connectorPathB} stroke="url(#cv-grad-2)" strokeWidth="1.5" />
            <defs><AnimatedStrokeGradient id="cv-grad-2" /></defs>
          </svg>
          {chipRowOne.map((name) => (
            <div className="cv-icon-chip" key={`a-${name}`}><BrandIcon name={name} size={30} /></div>
          ))}
        </div>
        <div className="cv-chip-row shifted">
          {chipRowTwo.map((name) => (
            <div className="cv-icon-chip" key={`b-${name}`}><BrandIcon name={name} size={30} /></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- features: skeleton two (second-by-second analytics) ---------- */

const graphLinePath = 'M335 151L317.491 36.2214C317.166 34.0879 316.477 32.0245 315.57 30.0659C307.713 13.0898 308.853 1 284 1C257.738 1 244.262 37.1622 218 37.1622C191.738 37.1622 195.262 67.5 169 67.5C142.738 67.5 141.262 37.1622 115 37.1622C88.7381 37.1622 88.7141 76.5675 62.4522 76.5675C36.1902 76.5675 36.1902 54.6756 9.9283 54.6756H0'
// The area is closed off from the exact line path so both always align.
const graphAreaPath = `${graphLinePath} V163 H335 Z`

function SkeletonAnalytics({ stat }) {
  const [scope, animateFn] = useAnimate()
  const [animating, setAnimating] = useState(false)
  const enterAnimation = async () => {
    if (animating) return
    setAnimating(true)
    await animateFn('.cv-graph-message', { scale: [0, 1] }, { duration: 0.4 })
    setAnimating(false)
  }
  return (
    <div className="cv-skel" ref={scope} onMouseEnter={enterAnimation}>
      <div className="cv-skel-graph">
        <div className="cv-graph-message">{stat}</div>
        <svg width="335" height="163" viewBox="0 0 335 163" fill="none" className="cv-graph-line">
          <path opacity="0.32" d={graphAreaPath} fill="url(#cv-grad-area)" />
          <path d={graphLinePath} stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <motion.path d={graphLinePath} stroke="url(#cv-grad-3)" strokeWidth="1.5" />
          <defs>
            <motion.linearGradient
              initial={{ x1: '0%', y1: '0%', x2: '0%', y2: '0%' }}
              animate={{ x1: '100%', y1: '0%', x2: '120%', y2: '0%' }}
              id="cv-grad-3"
              transition={{ duration: Math.random() * 5 + 2, ease: 'linear', repeat: Infinity }}
            >
              <stop stopColor="#001AFF" stopOpacity="0" />
              <stop offset="1" stopColor="#1677ff" />
              <stop offset="1" stopColor="#1677ff" stopOpacity="0" />
            </motion.linearGradient>
            <linearGradient id="cv-grad-area" x1="167.5" y1="163" x2="167.5" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d54c9" stopOpacity="0" />
              <stop offset="0.55" stopColor="#0d54c9" stopOpacity="0.65" />
              <stop offset="1" stopColor="#0d54c9" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" className="cv-graph-cursor">
          <path d="M3.08365 1.18326C2.89589 1.11581 2.70538 1.04739 2.54453 1.00558C2.39192 0.965918 2.09732 0.900171 1.78145 1.00956C1.41932 1.13497 1.13472 1.41956 1.00932 1.78169C0.899927 2.09756 0.965674 2.39216 1.00533 2.54477C1.04714 2.70562 1.11557 2.89613 1.18301 3.0839L5.9571 16.3833C6.04091 16.6168 6.12128 16.8408 6.2006 17.0133C6.26761 17.1591 6.42 17.4781 6.75133 17.6584C7.11364 17.8555 7.54987 17.8612 7.91722 17.6737C8.25317 17.5021 8.41388 17.1873 8.48469 17.0433C8.56852 16.8729 8.65474 16.6511 8.74464 16.4198L10.8936 10.8939L16.4196 8.74489C16.6509 8.655 16.8726 8.56879 17.043 8.48498C17.187 8.41416 17.5018 8.25346 17.6734 7.91751C17.8609 7.55016 17.8552 7.11392 17.6581 6.75162C17.4778 6.42029 17.1589 6.2679 17.0131 6.20089C16.8405 6.12157 16.6165 6.0412 16.383 5.9574L3.08365 1.18326Z" fill="#bcd7ff" stroke="#1677ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

/* ---------- features: skeleton three (AI agents) ---------- */
// OpenAI mark copied from the cvlp repo's icon set (react-icons lacks it).
function OpenAILogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox='0 0 28 28' fill='none' aria-hidden='true'>
      <path
        d='M26.153 11.46a6.888 6.888 0 0 0-.608-5.73 7.117 7.117 0 0 0-3.29-2.93 7.238 7.238 0 0 0-4.41-.454 7.065 7.065 0 0 0-2.41-1.742A7.15 7.15 0 0 0 12.514 0a7.216 7.216 0 0 0-4.217 1.346 7.061 7.061 0 0 0-2.603 3.539 7.12 7.12 0 0 0-2.734 1.188A7.012 7.012 0 0 0 .966 8.268a6.979 6.979 0 0 0 .88 8.273 6.89 6.89 0 0 0 .607 5.729 7.117 7.117 0 0 0 3.29 2.93 7.238 7.238 0 0 0 4.41.454 7.061 7.061 0 0 0 2.409 1.742c.92.404 1.916.61 2.923.604a7.215 7.215 0 0 0 4.22-1.345 7.06 7.06 0 0 0 2.605-3.543 7.116 7.116 0 0 0 2.734-1.187 7.01 7.01 0 0 0 1.993-2.196 6.978 6.978 0 0 0-.884-8.27Zm-10.61 14.71c-1.412 0-2.505-.428-3.46-1.215.043-.023.119-.064.168-.094l5.65-3.22a.911.911 0 0 0 .464-.793v-7.86l2.389 1.36a.087.087 0 0 1 .046.065v6.508c0 2.952-2.491 5.248-5.257 5.248ZM4.062 21.354a5.17 5.17 0 0 1-.635-3.516c.042.025.115.07.168.1l5.65 3.22a.928.928 0 0 0 .928 0l6.898-3.93v2.72a.083.083 0 0 1-.034.072l-5.711 3.255a5.386 5.386 0 0 1-4.035.522 5.315 5.315 0 0 1-3.23-2.443ZM2.573 9.184a5.283 5.283 0 0 1 2.768-2.301V13.515a.895.895 0 0 0 .464.793l6.897 3.93-2.388 1.36a.087.087 0 0 1-.08.008L4.52 16.349a5.262 5.262 0 0 1-2.475-3.185 5.192 5.192 0 0 1 .527-3.98Zm19.623 4.506-6.898-3.93 2.388-1.36a.087.087 0 0 1 .08-.008l5.713 3.255a5.28 5.28 0 0 1 2.054 2.118 5.19 5.19 0 0 1-.488 5.608 5.314 5.314 0 0 1-2.39 1.742v-6.633a.896.896 0 0 0-.459-.792Zm2.377-3.533a7.973 7.973 0 0 0-.168-.099l-5.65-3.22a.93.93 0 0 0-.928 0l-6.898 3.93V8.046a.083.083 0 0 1 .034-.072l5.712-3.251a5.375 5.375 0 0 1 5.698.241 5.262 5.262 0 0 1 1.865 2.28c.39.92.506 1.93.335 2.913ZM9.631 15.009l-2.39-1.36a.083.083 0 0 1-.046-.065V7.075c.001-.997.29-1.973.832-2.814a5.297 5.297 0 0 1 2.231-1.935 5.382 5.382 0 0 1 5.659.72 4.89 4.89 0 0 0-.168.093l-5.65 3.22a.913.913 0 0 0-.465.793l-.003 7.857Zm1.297-2.76L14 10.5l3.072 1.75v3.5L14 17.499l-3.072-1.75v-3.5Z'
        fill='currentColor'
      />
    </svg>
  )
}


function SkeletonAgents() {
  const [scope, animateFn] = useAnimate()
  useEffect(() => {
    const scale = [1, 1.1, 1]
    const transform = ['translateY(0px)', 'translateY(-4px)', 'translateY(0px)']
    const sequence = [1, 2, 3, 4, 5].map((n) => [`.cv-circle-${n}`, { scale, transform }, { duration: 0.8 }])
    const controls = animateFn(sequence, { repeat: Infinity, repeatDelay: 1 })
    return () => controls.stop()
  }, [animateFn])
  return (
    <div className="cv-skel" ref={scope}>
      <div className="cv-skel-agents">
        <div className="cv-ai-row">
          <div className="cv-ai-circle sm cv-circle-1"><GoCopilot size={16} /></div>
          <div className="cv-ai-circle md cv-circle-2"><SiClaude size={24} color="#D97757" /></div>
          <div className="cv-ai-circle lg cv-circle-3"><OpenAILogo size={32} /></div>
          <div className="cv-ai-circle md cv-circle-4"><SiGooglegemini size={24} color="#3186FF" /></div>
          <div className="cv-ai-circle sm cv-circle-5"><SiMeta size={16} color="#0866FF" /></div>
        </div>
        <div className="cv-beam">
          <SparklesCore id="cv-agents-sparkles" className="cv-beam-sparkles" particleColor="#0d54c9" particleDensity={1200} minSize={0.6} maxSize={1.4} />
        </div>
      </div>
    </div>
  )
}

/* ---------- features: skeleton five (creators) ---------- */

const creatorChartPath = 'M0 1C9.88235 1 9.88235 64.1698 19.7647 64.1698C29.6471 64.1698 29.6471 108.623 39.5294 108.623C49.4118 108.623 49.4118 125 59.2941 125C69.1765 125 69.1765 50.1321 79.0588 50.1321C88.9412 50.1321 88.9412 94.5849 98.8235 94.5849C108.706 94.5849 108.706 73.5283 118.588 73.5283C128.471 73.5283 128.471 85.2264 138.353 85.2264C148.235 85.2264 148.235 61.8302 158.118 61.8302C168 61.8302 168 57.1509 177.882 57.1509C187.765 57.1509 187.765 52.4717 197.647 52.4717C207.529 52.4717 207.529 92.2453 217.412 92.2453C227.294 92.2453 227.294 96.9245 237.176 96.9245C247.059 96.9245 247.059 113.302 256.941 113.302C266.824 113.302 266.824 101.604 276.706 101.604C286.588 101.604 286.588 38.434 296.471 38.434C306.353 38.434 306.353 103.943 316.235 103.943C326.118 103.943 326.118 103.943 336 103.943'

const creatorAvatars = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&crop=faces&w=400&q=90',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&crop=faces&w=400&q=90',
]

function CreatorPane({ card, avatar, className }) {
  const gradientId = `cv-creator-grad-${className}`
  return (
    <div className={`cv-creator-pane ${className}`}>
      <div className="cv-creator-avatar"><img src={avatar} alt={card.name} width="64" height="64" /></div>
      <p className="cv-creator-name">{card.name}</p>
      <div className="cv-creator-meta"><span>{card.label}</span><i /><span>{card.value}</span></div>
      <svg width="336" height="126" viewBox="0 0 336 126" fill="none" className="cv-creator-chart">
        <path d={creatorChartPath} stroke={`url(#${gradientId})`} strokeWidth="2" />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="63" x2="336" y2="63" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c7dcff" />
            <stop offset="0.5" stopColor="#94bdff" />
            <stop offset="1" stopColor="#69a4ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function SkeletonCreators({ cards }) {
  return (
    <div className="cv-skel cv-skel-unmasked">
      <div className="cv-skel-creators">
        <CreatorPane card={cards[0]} avatar={creatorAvatars[0]} className="pane-a" />
        <CreatorPane card={cards[1]} avatar={creatorAvatars[1]} className="pane-b" />
      </div>
    </div>
  )
}

/* ---------- features: globe ---------- */

function SkeletonGlobe() {
  const holderRef = useRef(null)
  useEffect(() => {
    const holder = holderRef.current
    if (!holder) return undefined
    // StrictMode remounts break cobe when it reuses the old canvas's WebGL
    // context, so each effect run gets a brand new canvas element.
    const canvas = document.createElement('canvas')
    canvas.className = 'cv-globe-canvas'
    holder.appendChild(canvas)
    let phi = 0
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1200,
      height: 1200,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      // Light mode renders the map dots as darker spots on the baseColor
      // sphere, so use a pale blue base to keep the dot pattern visible.
      baseColor: [0.78, 0.87, 1],
      markerColor: [0.09, 0.47, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => { state.phi = phi; phi += 0.01 },
    })
    return () => {
      globe.destroy()
      // cobe v2 wraps the canvas in a full-height div and destroy() leaves it
      // behind; remove it too or StrictMode remounts stack empty wrappers that
      // push the live canvas out of the clipped card.
      const wrapper = canvas.parentElement
      canvas.remove()
      if (wrapper && wrapper !== holder) wrapper.remove()
    }
  }, [])
  return <div className="cv-skel cv-skel-globe" ref={holderRef} />
}

/* ---------- features section ---------- */

export function FeaturesSection() {
  const copy = homeCopy.capabilities
  return (
    <section className="cv-features" id="features">
      <div className="cv-section-head">
        <SectionBadge><FaBolt size={22} /></SectionBadge>
        <h2 className="cv-heading">{copy.title}</h2>
        <p className="cv-subheading">{copy.description}</p>
      </div>
      <div className="cv-features-grid">
        <article className="cv-card span-2">
          <h3 className="cv-card-title">{copy.dataCard.title}</h3>
          <p className="cv-card-description">{copy.dataCard.description}</p>
          <SkeletonPlatforms />
        </article>
        <article className="cv-card">
          <SkeletonAnalytics stat={copy.dataCard.stat} />
          <h3 className="cv-card-title">{copy.analytics.title}</h3>
          <p className="cv-card-description">{copy.analytics.description}</p>
        </article>
        <article className="cv-card">
          <SkeletonAgents />
          <h3 className="cv-card-title">{copy.agent.title}</h3>
          <p className="cv-card-description">{copy.agent.description}</p>
        </article>
        <article className="cv-card">
          <SkeletonCreators cards={copy.agent.cards} />
          <h3 className="cv-card-title">{copy.creators.title}</h3>
          <p className="cv-card-description">{copy.creators.description}</p>
        </article>
        <article className="cv-card">
          <h3 className="cv-card-title">{copy.global.title}</h3>
          <p className="cv-card-description">{copy.global.description}</p>
          <SkeletonGlobe />
        </article>
      </div>
    </section>
  )
}

/* ---------- tools (sticky scroll) ---------- */

const toolImages = {
  'winning-ads': '/cvlp/winning-ads.png',
  competitor: '/cvlp/advertiser-insight.png',
  creator: '/cvlp/creator02.png',
}
const toolIcons = { 'winning-ads': Trophy, competitor: Eye, creator: Users }

function ToolImageFrame({ module }) {
  return (
    <div className="cv-image-frame">
      <img src={toolImages[module.key]} alt={module.title} loading="lazy" />
      <i className="cv-frame-line" />
      <i className="cv-frame-line indigo" />
    </div>
  )
}

function ScrollContent({ module, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const translate = useTransform(scrollYProgress, [0, 1], [0, 250])
  const translateContent = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.5, 0.7, 1], [0, 1, 1, 0, 0])
  const opacityContent = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0, 1, 1, 0])
  const Icon = toolIcons[module.key] || Sparkles
  return (
    <motion.div ref={ref} transition={{ duration: 0.3 }} className="cv-scroll-item">
      <div>
        <motion.div style={{ y: translate, opacity }}>
          <Icon size={32} className="cv-tool-icon" strokeWidth={1.8} />
          <h3 className="cv-scroll-title">{module.title}</h3>
          <p className="cv-scroll-desc">{module.description}</p>
        </motion.div>
      </div>
      <motion.div style={{ y: translateContent, opacity: index === 0 ? opacityContent : 1 }} className="cv-scroll-visual">
        <ToolImageFrame module={module} />
      </motion.div>
    </motion.div>
  )
}

function ScrollContentMobile({ module }) {
  const Icon = toolIcons[module.key] || Sparkles
  return (
    <div className="cv-scroll-item-mobile">
      <div className="cv-scroll-copy-mobile">
        <Icon size={28} className="cv-tool-icon" strokeWidth={1.8} />
        <h3 className="cv-scroll-title">{module.title}</h3>
        <p className="cv-scroll-desc">{module.description}</p>
      </div>
      <ToolImageFrame module={module} />
    </div>
  )
}

export function ToolsSection({ hideHeading = false }) {
  const copy = homeCopy.showcase
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const backgrounds = ['#ffffff', '#f6f7f8', '#eef4ff']
  const [background, setBackground] = useState(backgrounds[0])
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const breakpoints = copy.modules.map((_, index) => index / copy.modules.length)
    const closest = breakpoints.reduce((acc, breakpoint, index) => (
      Math.abs(latest - breakpoint) < Math.abs(latest - breakpoints[acc]) ? index : acc
    ), 0)
    setBackground(backgrounds[closest % backgrounds.length])
  })
  return (
    <motion.section animate={{ background }} transition={{ duration: 0.5 }} ref={ref} className="cv-tools">
      {!hideHeading && (
        <div className="cv-section-head">
          <SectionBadge><Sparkles size={22} /></SectionBadge>
          <h2 className="cv-heading">{copy.title}</h2>
          <p className="cv-subheading">{copy.description}</p>
        </div>
      )}
      <div className="cv-sticky-desktop">
        {copy.modules.map((module, index) => (
          <ScrollContent key={module.key} module={module} index={index} />
        ))}
      </div>
      <div className="cv-sticky-mobile">
        {copy.modules.map((module) => (
          <ScrollContentMobile key={module.key} module={module} />
        ))}
      </div>
    </motion.section>
  )
}

/* ---------- testimonials ---------- */

const testimonialAvatars = [
  '/cvlp/man01.jpg', '/cvlp/man02.jpg', '/cvlp/woman01.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/men/9.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
]

function TestimonialCard({ item, src }) {
  return (
    <div className="cv-tcard">
      <p className="cv-tcard-quote">{item.quote}</p>
      <div className="cv-tcard-person">
        <img src={src} alt={item.name} width="40" height="40" loading="lazy" />
        <div><strong>{item.name}</strong><small>{item.role}</small></div>
      </div>
    </div>
  )
}

function TestimonialsGridBg({ items }) {
  const columns = [items.slice(0, 4), items.slice(4, 8), items.slice(8, 12), items.slice(12, 16)]
  return (
    <div className="cv-tgrid-bg" aria-hidden="true">
      <div className="cv-tgrid">
        {columns.map((column, columnIndex) => (
          <div className="cv-tgrid-col" key={`col-${columnIndex}`}>
            {column.map((item, itemIndex) => (
              <TestimonialCard key={item.name} item={item} src={testimonialAvatars[columnIndex * 4 + itemIndex]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsSlider({ items }) {
  const [active, setActive] = useState(0)
  const [autorotate, setAutorotate] = useState(true)
  const slides = items.slice(0, 3)

  useEffect(() => {
    if (!autorotate) return undefined
    const interval = setInterval(() => {
      setActive((current) => (current + 1 === slides.length ? 0 : current + 1))
    }, 7000)
    return () => clearInterval(interval)
  }, [autorotate, slides.length])

  return (
    <div className="cv-slider">
      <SparklesCore id="cv-slider-sparkles" className="cv-slider-sparkles" particleColor="#1677ff" particleDensity={100} />
      <div className="cv-slider-disc">
        <div className="cv-slider-halo">
          <AnimatePresence>
            <motion.img
              key={active}
              src={testimonialAvatars[active]}
              alt={slides[active].name}
              width="56"
              height="56"
              className="cv-slider-avatar"
              initial={{ opacity: 0, rotate: -60 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 60 }}
              transition={{ duration: 0.7, ease: [0.68, -0.3, 0.32, 1] }}
            />
          </AnimatePresence>
        </div>
      </div>
      <div className="cv-slider-quote-wrap">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            className="cv-slider-quote"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {slides[active].quote}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="cv-slider-buttons">
        {slides.map((item, index) => (
          <button
            key={item.name}
            className={`cv-slider-btn ${active === index ? 'active' : ''}`}
            onClick={() => { setActive(index); setAutorotate(false) }}
          >
            <strong>{item.name}</strong> <span>—</span> <span>{item.role}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const copy = homeCopy.testimonials
  return (
    <section className="cv-testimonials">
      <div className="cv-section-head">
        <SectionBadge><TbLocationBolt size={22} /></SectionBadge>
        <h2 className="cv-heading">{copy.title}</h2>
        <p className="cv-subheading">{copy.description}</p>
      </div>
      <div className="cv-testimonial-stage">
        <TestimonialsGridBg items={copy.items} />
        <TestimonialsSlider items={copy.items} />
      </div>
    </section>
  )
}
