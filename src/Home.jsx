import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, ChevronRight,
  Globe2, Mail, Menu, X,
} from 'lucide-react'
import { homeCopy } from './home-data.js'
import { PageHero, ExtensionPage, BlogPage, ContactPage, SkillsPage } from './Pages.jsx'
import { FeaturesSection, ToolsSection, TestimonialsSection } from './CvlpSections.jsx'
import './home.css'

function ArrowButtonIcon() {
  return <span className="button-icon"><ArrowRight size={17} aria-hidden="true" /></span>
}

export function BrandLogo({ navigate }) {
  return (
    <button className="brand" onClick={() => navigate('/')} aria-label="CreatiVault home">
      <img className="brand-mark-img" src="/logo-mark.png" alt="" width="26" height="26" />CreatiVault
    </button>
  )
}


// Shared site header — used verbatim by the homepage and the Free Tools pages
// so both surfaces stay visually consistent and can jump to each other.
export function SiteHeader({ navigate, active = 'home', locale = 'en', onSwitchLocale }) {
  const { nav } = homeCopy
  const [open, setOpen] = useState(false)
  const base = locale === 'zh' ? '/zh' : ''
  const go = (item) => {
    setOpen(false)
    if (item.route) navigate(item.route === '/free-tools' ? `${base}${item.route}` : item.route)
  }
  const isActive = (item) => active !== 'home' && item.route === `/${active}`
  return (
    <header className="site-header home-header">
      <BrandLogo navigate={navigate} />
      <nav className="desktop-nav home-nav" aria-label="Primary navigation">
        {nav.items.map((item) => (
          <button key={item.label} className={isActive(item) ? 'active' : ''} onClick={() => go(item)}>
            {item.label}
            {item.badge && <em className="nav-badge">{item.badge}</em>}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        {onSwitchLocale
          ? <button className="language-button" onClick={onSwitchLocale} aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}><Globe2 size={16} /><span>{locale === 'zh' ? 'EN' : '中文'}</span></button>
          : <button className="language-button">{nav.signIn}</button>}
        <button className="button dark header-cta">{nav.signUp}<ArrowButtonIcon /></button>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="mobile-nav">
          {nav.items.map((item) => (
            <button key={item.label} onClick={() => go(item)}>
              <span>{item.label}{item.badge && <em className="nav-badge">{item.badge}</em>}</span>
              <ChevronRight size={16} />
            </button>
          ))}
          {onSwitchLocale
            ? <button onClick={() => { setOpen(false); onSwitchLocale() }}>{locale === 'zh' ? 'English' : '中文'}<Globe2 size={16} /></button>
            : <button onClick={() => setOpen(false)}>{nav.signIn}<ChevronRight size={16} /></button>}
        </div>
      )}
    </header>
  )
}

function Hero({ navigate }) {
  const { hero } = homeCopy
  return (
    <section className="home-hero ambient-section">
      <div className="hub-title-wrap">
        <h1>{hero.titleLead}<br /><em>{hero.brand}</em></h1>
        <p className="hero-description">{hero.subtitle}</p>
        <div className="home-hero-ctas">
          {hero.ctas.map((cta) => <button key={cta.label} className={`button ${cta.kind} hero-cta`}>{cta.label}<ArrowButtonIcon /></button>)}
        </div>
      </div>
    </section>
  )
}

// Market Insight showcase — mirrors creativault.ai's hero screenshot: a dark
// device-style frame with a scroll-driven 3D tilt (rotateX eases from 20° to 0°
// as the frame scrolls into view).
function MarketInsight() {
  const frameRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const el = frameRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const raw = (window.innerHeight - rect.top) / (window.innerHeight * 0.85)
      setProgress(Math.max(0, Math.min(1, raw)))
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  const rotate = 20 * (1 - progress)
  const scale = 1 + 0.05 * (1 - progress)
  return (
    <section className="home-insight" aria-label="Market Insight preview">
      <div className="insight-perspective">
        <div className="insight-frame" ref={frameRef} style={{ transform: `rotateX(${rotate}deg) scale(${scale})` }}>
          <div className="insight-screen">
            <img src="/pic/market-insight.png" alt="CreatiVault Market Insight dashboard" width="1400" height="798" loading="lazy" draggable="false" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const copy = homeCopy.pricing
  const [cycle, setCycle] = useState('monthly')
  return (
    <section className="home-pricing ambient-section" id="pricing">
      <div className="page-container">
        <div className="home-section-heading">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="pricing-toolbar">
          <span className="section-kicker">{copy.kicker}</span>
          <p className="pricing-subtitle">{copy.subtitle}</p>
          <div className="billing-toggle" role="tablist" aria-label="Billing period">
            <button role="tab" aria-selected={cycle === 'monthly'} className={cycle === 'monthly' ? 'active' : ''} onClick={() => setCycle('monthly')}>{copy.billing.monthly}</button>
            <button role="tab" aria-selected={cycle === 'yearly'} className={cycle === 'yearly' ? 'active' : ''} onClick={() => setCycle('yearly')}>{copy.billing.yearly}</button>
          </div>
        </div>
        <div className="pricing-grid">
          {copy.plans.map((plan) => (
            <article className={`pricing-card ${plan.featured ? 'featured' : ''}`} key={plan.key}>
              {plan.featured && <span className="pricing-flag">Recommended</span>}
              <h3>{plan.name}</h3>
              <div className="pricing-price"><strong>{plan.price[cycle]}</strong><span>{plan.period[cycle]}</span></div>
              <p className="pricing-description">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}
              </ul>
              <button className={`button ${plan.featured ? 'dark' : 'light'}`}>{plan.cta}<ArrowButtonIcon /></button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeFaq() {
  const copy = homeCopy.faq
  const [open, setOpen] = useState(0)
  return (
    <section className="faq page-container home-faq" id="faq">
      <div className="section-heading"><div><span className="section-kicker">FAQ</span><h2>{copy.title}</h2></div></div>
      <div className="faq-list">
        {copy.items.map(([question, answer], index) => (
          <div className={open === index ? 'open' : ''} key={question}>
            <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={18} /></button>
            <p>{answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Newsletter() {
  const copy = homeCopy.newsletter
  const [email, setEmail] = useState('')
  return (
    <section className="home-newsletter ambient-section">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
        <span className="newsletter-mail" aria-hidden="true"><Mail size={16} /></span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.placeholder} required aria-label={copy.placeholder} />
        <button className="button dark" type="submit">{copy.button}<ArrowButtonIcon /></button>
      </form>
    </section>
  )
}

const footerRoutes = { Features: '/features', Pricing: '/pricing', Blog: '/blog', Skills: '/skills', Contact: '/contact', FAQ: '/#faq' }

function HomeFooter({ navigate }) {
  const copy = homeCopy.footer
  return (
    <footer className="home-footer page-container">
      <div className="home-footer-top">
        <div className="home-footer-brand">
          <BrandLogo navigate={navigate} />
          <p>{copy.tagline}</p>
          <small>{copy.copyright}<br />{copy.rights}</small>
        </div>
        <div className="home-footer-columns">
          {copy.columns.map((column) => (
            <div key={column.title}>
              <strong>{column.title}</strong>
              {column.items.map((item) => (
                <button key={item} onClick={() => {
                  if (item === 'FAQ' && document.getElementById('faq')) { document.getElementById('faq').scrollIntoView({ behavior: 'smooth' }); return }
                  if (footerRoutes[item]) navigate(footerRoutes[item])
                }}>{item}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="home-footer-bottom">
        {copy.social.map((item) => <button key={item}>{item}</button>)}
      </div>
    </footer>
  )
}

export default function HomePage({ navigate, page = 'home' }) {
  // Support anchor jumps (e.g. /#faq) when arriving from another route.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [page])

  const content = {
    home: (
      <>
        <Hero navigate={navigate} />
        <MarketInsight />
        <FeaturesSection />
        <ToolsSection />
        <TestimonialsSection />
        <Pricing />
        <HomeFaq />
        <Newsletter />
      </>
    ),
    features: (
      <>
        <PageHero title={homeCopy.showcase.title} subtitle={homeCopy.showcase.description} />
        <ToolsSection hideHeading />
        <FeaturesSection />
        <TestimonialsSection />
        <Newsletter />
      </>
    ),
    pricing: (
      <>
        <Pricing />
        <TestimonialsSection />
        <Newsletter />
      </>
    ),
    extension: <ExtensionPage />,
    blog: <BlogPage />,
    contact: <ContactPage />,
    skills: <SkillsPage />,
  }[page]

  return (
    <>
      <SiteHeader navigate={navigate} active={page} />
      <main>{content}</main>
      <HomeFooter navigate={navigate} />
    </>
  )
}
