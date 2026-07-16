// Marketing sub-pages (/extension, /blog, /contact, /skills) plus the shared
// PageHero. Content lives in home-data.js (homeCopy.pages); visuals reuse the
// Free Tools design tokens and homepage component classes.
import React, { useState } from 'react'
import {
  ArrowRight, BarChart3, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  Download, FolderOpen, Handshake, Layers, Mail, Newspaper, Search, Sparkles,
  Users, Zap,
} from 'lucide-react'
import { homeCopy } from './home-data.js'

const pages = homeCopy.pages

function ArrowButtonIcon() {
  return <span className="button-icon"><ArrowRight size={17} aria-hidden="true" /></span>
}

const pageIcons = {
  chart: BarChart3, users: Users, download: Download, folder: FolderOpen,
  zap: Zap, mail: Mail, handshake: Handshake, search: Search, layers: Layers, clock: Clock3,
}

export function PageHero({ kicker, title, subtitle, children }) {
  return (
    <section className="home-hero page-hero ambient-section">
      <div className="hub-title-wrap">
        {kicker && <p className="functional-eyebrow">{kicker}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="hero-description">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

function HeroCtas({ ctas, onClick }) {
  return (
    <div className="home-hero-ctas">
      {ctas.map((cta) => (
        <button key={cta.label} className={`button ${cta.kind} hero-cta`} onClick={() => onClick?.(cta)}>
          {cta.label}<ArrowButtonIcon />
        </button>
      ))}
    </div>
  )
}

function PageClosing({ title, description, ctas }) {
  return (
    <section className="home-newsletter page-closing ambient-section">
      <h2>{title}</h2>
      <p>{description}</p>
      <HeroCtas ctas={ctas} />
    </section>
  )
}

/* ---------- Extension ---------- */

export function ExtensionPage() {
  const copy = pages.extension
  return (
    <>
      <PageHero kicker={copy.hero.kicker} title={copy.hero.title} subtitle={copy.hero.subtitle}>
        <HeroCtas ctas={copy.hero.ctas} onClick={(cta) => cta.anchor && document.getElementById(cta.anchor)?.scrollIntoView({ behavior: 'smooth' })} />
      </PageHero>

      <section className="home-capabilities page-container" id="extension-features">
        <div className="home-section-heading">
          <h2>{copy.features.title}</h2>
        </div>
        <div className="capability-grid page-feature-grid">
          {copy.features.items.map((item) => {
            const Icon = pageIcons[item.icon] || Sparkles
            return (
              <article className="capability-card" key={item.title}>
                <span className={`icon-badge ${item.tone}`}><Icon size={20} strokeWidth={1.9} /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="page-steps ambient-section">
        <div className="page-container">
          <div className="home-section-heading">
            <h2>{copy.steps.title}</h2>
          </div>
          <div className="steps-grid">
            {copy.steps.items.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageClosing title={copy.closing.title} description={copy.closing.description} ctas={[{ label: copy.closing.cta, kind: 'dark' }]} />
    </>
  )
}

/* ---------- Blog ---------- */

export function BlogPage() {
  const copy = pages.blog
  const [category, setCategory] = useState('All')
  const posts = copy.posts.filter((post) => category === 'All' || post.category === category)
  return (
    <>
      <PageHero title={copy.title} subtitle={copy.description} />

      <section className="page-container blog-section">
        <div className="blog-toolbar">
          <div className="billing-toggle" role="tablist" aria-label="Blog categories">
            {copy.categories.map((item) => (
              <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <div className={`blog-cover tone-${post.tone}`} aria-hidden="true">
                <Newspaper size={26} strokeWidth={1.7} />
              </div>
              <div className="blog-body">
                <div className="blog-meta"><em className="nav-badge">{post.category}</em><span>{post.date}</span></div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-author">
                  <span className="testimonial-avatar">{copy.author[0]}</span>
                  <strong>{copy.author}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="showcase-controls blog-pagination" aria-label="Pagination">
          <button aria-label="Previous page" disabled><ChevronLeft size={18} /></button>
          <span className="blog-page-current">1</span>
          <button aria-label="Next page" disabled><ChevronRight size={18} /></button>
        </div>
      </section>
    </>
  )
}

/* ---------- Contact ---------- */

export function ContactPage() {
  const copy = pages.contact
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState({ name: '', email: '', company: '', message: '' })
  const set = (key) => (event) => setValues({ ...values, [key]: event.target.value })
  return (
    <>
      <PageHero title={copy.title} subtitle={copy.description} />

      <section className="page-container contact-layout">
        <div className="contact-side">
          <div className="contact-side-heading">
            <h2>{copy.channels.title}</h2>
            <p>{copy.channels.description}</p>
          </div>
          {copy.channels.items.map((item) => {
            const Icon = pageIcons[item.icon] || Mail
            return (
              <div className="contact-email-card" key={item.address}>
                <span className={`icon-badge ${item.tone}`}><Icon size={20} strokeWidth={1.9} /></span>
                <div className="contact-email-body">
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                  <a href={`mailto:${item.address}`}>{item.address}<ArrowRight size={14} aria-hidden="true" /></a>
                </div>
              </div>
            )
          })}
          <p className="contact-reply-note"><Clock3 size={15} aria-hidden="true" />{copy.channels.reply}</p>
        </div>
        <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
          <div className="contact-form-heading">
            <h2>{copy.form.title}</h2>
            <p>{copy.form.description}</p>
          </div>
          <label><span>{copy.form.name.label}</span><input value={values.name} onChange={set('name')} placeholder={copy.form.name.placeholder} required /></label>
          <label><span>{copy.form.email.label}</span><input type="email" value={values.email} onChange={set('email')} placeholder={copy.form.email.placeholder} required /></label>
          <label><span>{copy.form.company.label}</span><input value={values.company} onChange={set('company')} placeholder={copy.form.company.placeholder} /></label>
          <label><span>{copy.form.message.label}</span><textarea rows={5} value={values.message} onChange={set('message')} placeholder={copy.form.message.placeholder} required /></label>
          {sent
            ? <p className="contact-sent"><Check size={16} />{copy.form.sent}</p>
            : <button className="button dark" type="submit">{copy.form.submit}<ArrowButtonIcon /></button>}
        </form>
      </section>
    </>
  )
}

/* ---------- Skills ---------- */

function SkillsFaq() {
  const copy = pages.skills.faq
  const [open, setOpen] = useState(0)
  return (
    <section className="faq page-container home-faq">
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

export function SkillsPage() {
  const copy = pages.skills
  return (
    <>
      <PageHero kicker={copy.hero.kicker} title={copy.hero.title} subtitle={copy.hero.subtitle}>
        <HeroCtas ctas={copy.hero.ctas} />
      </PageHero>

      <section className="page-container skills-setup">
        <div className="home-section-heading">
          <h2>{copy.setup.title}</h2>
          <p>{copy.setup.description}</p>
        </div>
        <div className="skills-setup-grid">
          <div className="steps-grid setup-steps">
            {copy.setup.steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <pre className="terminal-block" aria-label="Install commands"><code>{copy.setup.terminal.join('\n')}</code></pre>
        </div>
      </section>

      <section className="page-steps ambient-section">
        <div className="page-container">
          <div className="home-section-heading">
            <h2>{copy.value.title}</h2>
          </div>
          <div className="capability-grid page-feature-grid cols-3">
            {copy.value.cards.map((card) => {
              const Icon = pageIcons[card.icon] || Sparkles
              return (
                <article className="capability-card" key={card.title}>
                  <span className={`icon-badge ${card.tone}`}><Icon size={20} strokeWidth={1.9} /></span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              )
            })}
          </div>
          <div className="skills-stats">
            {copy.value.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}
          </div>
        </div>
      </section>

      <section className="page-container skills-capabilities">
        <div className="home-section-heading">
          <h2>{copy.capabilities.title}</h2>
        </div>
        <div className="capability-grid page-feature-grid">
          {copy.capabilities.items.map((item) => {
            const Icon = pageIcons[item.icon] || Sparkles
            return (
              <article className="capability-card" key={item.title}>
                <span className="icon-badge blue"><Icon size={20} strokeWidth={1.9} /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
        <div className="platform-matrix" role="table" aria-label="Platform support matrix">
          <div className="matrix-row matrix-head" role="row">
            <span role="columnheader">Platform</span>
            {copy.capabilities.methods.map((method) => <span key={method} role="columnheader">{method}</span>)}
          </div>
          {copy.capabilities.platforms.map((platform) => (
            <div className="matrix-row" role="row" key={platform}>
              <span role="cell"><strong>{platform}</strong></span>
              {copy.capabilities.methods.map((method) => <span role="cell" key={method}><Check size={15} /></span>)}
            </div>
          ))}
        </div>
      </section>

      <section className="page-container skills-compat">
        <div className="home-section-heading">
          <h2>{copy.compatibility.title}</h2>
        </div>
        <div className="compat-chips">
          {copy.compatibility.agents.map((agent) => <span className="platform-chip" key={agent}><Sparkles size={14} />{agent}</span>)}
        </div>
      </section>

      <SkillsFaq />

      <PageClosing title={copy.closing.title} description={copy.closing.description} ctas={copy.closing.ctas} />
    </>
  )
}
