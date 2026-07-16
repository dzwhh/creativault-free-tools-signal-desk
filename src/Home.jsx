import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, BarChart3, Bot, Check, ChevronDown, ChevronLeft, ChevronRight,
  Globe2, LineChart, Mail, Menu, Play, Radar, Search, ShoppingBag, Sparkles,
  Store, TrendingUp, UserCheck, Users, Video, X, Zap,
} from 'lucide-react'
import { homeCopy } from './home-data.js'
import { PageHero, ExtensionPage, BlogPage, ContactPage, SkillsPage } from './Pages.jsx'
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

const platformIcons = {
  TikTok: Video, YouTube: Play, Facebook: Users, Snapchat: Zap, 'Google Ads': Search, Shopify: ShoppingBag,
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

function PlatformMarquee({ platforms }) {
  const loop = [...platforms, ...platforms]
  return (
    <div className="platform-marquee" aria-label="Supported platforms">
      <div className="platform-track">
        {loop.map((name, index) => {
          const Icon = platformIcons[name] || Radar
          return <span className="platform-chip" key={`${name}-${index}`} aria-hidden={index >= platforms.length}><Icon size={15} />{name}</span>
        })}
      </div>
    </div>
  )
}

function Capabilities() {
  const copy = homeCopy.capabilities
  return (
    <section className="home-capabilities page-container" id="features">
      <div className="home-section-heading">
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="capability-grid">
        <article className="capability-card span-2">
          <span className="icon-badge blue"><BarChart3 size={20} strokeWidth={1.9} /></span>
          <h3>{copy.dataCard.title}</h3>
          <p>{copy.dataCard.description}</p>
          <div className="capability-stat"><TrendingUp size={15} /><strong>{copy.dataCard.stat}</strong></div>
          <PlatformMarquee platforms={copy.platforms} />
        </article>

        <article className="capability-card">
          <span className="icon-badge amber"><LineChart size={20} strokeWidth={1.9} /></span>
          <h3>{copy.analytics.title}</h3>
          <p>{copy.analytics.description}</p>
          <div className="second-bars" aria-hidden="true">
            {[34, 58, 42, 76, 64, 90, 52, 70, 38, 82, 60, 46].map((height, index) => <i key={index} style={{ height: `${height}%` }} className={height >= 76 ? 'peak' : ''} />)}
          </div>
        </article>

        <article className="capability-card">
          <span className="icon-badge blue"><Bot size={20} strokeWidth={1.9} /></span>
          <h3>{copy.agent.title}</h3>
          <p>{copy.agent.description}</p>
          <div className="agent-cards">
            {copy.agent.cards.map((card) => (
              <div className="agent-card" key={card.name}>
                <span className="agent-avatar">{card.name.split(' ').map((word) => word[0]).join('')}</span>
                <div><strong>{card.name}</strong><small>{card.label}</small></div>
                <b>{card.value}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="capability-card">
          <span className="icon-badge green"><UserCheck size={20} strokeWidth={1.9} /></span>
          <h3>{copy.creators.title}</h3>
          <p>{copy.creators.description}</p>
        </article>

        <article className="capability-card">
          <span className="icon-badge green"><Globe2 size={20} strokeWidth={1.9} /></span>
          <h3>{copy.global.title}</h3>
          <p>{copy.global.description}</p>
        </article>
      </div>
    </section>
  )
}

const showcaseIcons = { 'winning-ads': Search, 'ai-partner': Bot, competitor: Radar, creator: Users }
const showcaseStats = {
  'winning-ads': [['Top creatives', '1,240'], ['Advertisers', '386'], ['Niches', '52']],
  'ai-partner': [['Hooks found', '18'], ['Win rate', '+32%'], ['Time saved', '6h/wk']],
  competitor: [['Active ads', '128'], ['New in 7d', '37'], ['Shops', '12']],
  creator: [['Matches', '64'], ['Vetted', '100%'], ['Shortlist', '5 min']],
}

function Showcase({ hideHeading = false }) {
  const copy = homeCopy.showcase
  const railRef = useRef(null)
  const [active, setActive] = useState(0)

  const scrollTo = (index) => {
    const rail = railRef.current
    if (!rail) return
    const clamped = Math.max(0, Math.min(copy.modules.length - 1, index))
    rail.scrollTo({ left: clamped * rail.offsetWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const onScroll = () => setActive(Math.round(rail.scrollLeft / rail.offsetWidth))
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => rail.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="home-showcase ambient-section">
      <div className="page-container">
        {!hideHeading && (
          <div className="home-section-heading">
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
        )}
        <div className="showcase-rail" ref={railRef}>
          {copy.modules.map((module) => {
            const Icon = showcaseIcons[module.key] || Sparkles
            return (
              <article className="showcase-slide" key={module.key}>
                <div className="showcase-visual" aria-hidden="true">
                  <span className="icon-badge blue"><Icon size={22} strokeWidth={1.9} /></span>
                  <div className="showcase-stats">
                    {showcaseStats[module.key].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
                  </div>
                </div>
                <div className="showcase-copy">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
              </article>
            )
          })}
        </div>
        <div className="showcase-controls">
          <button onClick={() => scrollTo(active - 1)} aria-label="Previous" disabled={active === 0}><ChevronLeft size={18} /></button>
          <div className="showcase-dots" role="tablist">
            {copy.modules.map((module, index) => (
              <button key={module.key} className={index === active ? 'active' : ''} onClick={() => scrollTo(index)} aria-label={module.title} role="tab" aria-selected={index === active} />
            ))}
          </div>
          <button onClick={() => scrollTo(active + 1)} aria-label="Next" disabled={active === copy.modules.length - 1}><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const copy = homeCopy.testimonials
  return (
    <section className="home-testimonials page-container">
      <div className="home-section-heading">
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="testimonial-grid">
        {copy.items.map((item) => (
          <figure className="testimonial-card" key={item.name}>
            <blockquote>{item.quote}</blockquote>
            <figcaption>
              <span className="testimonial-avatar">{item.name.split(' ').map((word) => word[0]).join('')}</span>
              <div><strong>{item.name}</strong><small>{item.role}</small></div>
            </figcaption>
          </figure>
        ))}
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
        <Capabilities />
        <Showcase />
        <Testimonials />
        <Pricing />
        <HomeFaq />
        <Newsletter />
      </>
    ),
    features: (
      <>
        <PageHero title={homeCopy.showcase.title} subtitle={homeCopy.showcase.description} />
        <Showcase hideHeading />
        <Capabilities />
        <Testimonials />
        <Newsletter />
      </>
    ),
    pricing: (
      <>
        <Pricing />
        <Testimonials />
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
