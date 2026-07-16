import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, BarChart3, Check, ChevronDown, ChevronRight, Clock3, Download,
  Eye, Gauge, Globe2, Handshake, LineChart, LockKeyhole, Mail, Menu, Play,
  Radar, RefreshCw, Search, ShieldCheck, Smartphone, Sparkles, TrendingUp,
  UserCheck, Video, X, Zap,
} from 'lucide-react'
import { categoryCopy, getTool, hubCopy, liveSignals, tools, uiCopy } from './data.js'
import { homeCopy } from './home-data.js'
import PrimaryVisual from './Visuals.jsx'
import HomePage from './Home.jsx'

const iconMap = {
  'user-check': UserCheck, mail: Mail, video: Video, handshake: Handshake,
  radar: Radar, chart: BarChart3, cycle: RefreshCw, benchmark: Gauge, smartphone: Smartphone,
  meta: Radar, pulse: Zap, user: UserCheck,
}

const states = ['idle', 'validating', 'running', 'preview', 'signup', 'full', 'paid', 'partial', 'noresult', 'ratelimit', 'error']

function useRoute() {
  const get = () => {
    const parts = window.location.pathname.split('/').filter(Boolean)
    const locale = parts[0] === 'zh' ? 'zh' : 'en'
    const offset = locale === 'zh' ? 1 : 0
    const isFreeTools = parts[offset] === 'free-tools'
    const slug = isFreeTools ? parts[offset + 1] : null
    return { locale, slug, isFreeTools }
  }
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const onPop = () => setRoute(get())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setRoute(get())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return { ...route, navigate }
}

function ArrowButtonIcon() {
  return <span className="button-icon"><ArrowRight size={17} aria-hidden="true" /></span>
}

function SelectOptionIcon({ field, option }) {
  const normalized = option.toLowerCase()
  if (field.type === 'platform') {
    if (normalized === 'youtube') return <Play size={15} fill="currentColor" />
    if (normalized === 'instagram') return <Sparkles size={15} />
    if (normalized === 'tiktok') return <Video size={15} />
    return <Radar size={15} />
  }
  if (field.key === 'country') return <Globe2 size={15} />
  if (field.key === 'store') return <Smartphone size={15} />
  if (field.key === 'window') return <Clock3 size={15} />
  if (field.key === 'industry') return <BarChart3 size={15} />
  return <ChevronDown size={15} />
}

function SignalSelect({ field, value, onChange, locale }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className={`signal-select ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        className="signal-select-trigger"
        type="button"
        aria-label={field.label[locale]}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="select-leading"><SelectOptionIcon field={field} option={value} /></span>
        <span className="select-value">{value}</span>
        <ChevronDown className="select-chevron" size={15} />
      </button>
      {open && (
        <div className="signal-select-content" role="listbox" aria-label={field.label[locale]}>
          {field.options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option === value}
              className="signal-select-item"
              key={option}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              <span className="select-leading"><SelectOptionIcon field={field} option={option} /></span>
              <span>{option}</span>
              {option === value && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Header({ locale, navigate }) {
  const copy = uiCopy[locale]
  const [open, setOpen] = useState(false)
  const base = locale === 'zh' ? '/zh' : ''
  const toHome = () => navigate(`${base}/free-tools`)
  const switchLocale = () => {
    const path = window.location.pathname
    const next = locale === 'zh' ? path.replace(/^\/zh/, '') || '/free-tools' : `/zh${path}`
    navigate(next + window.location.search)
  }
  return (
    <header className="site-header">
      <button className="brand" onClick={toHome} aria-label="CreatiVault Free Tools home">creativault<span>.</span></button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {copy.nav.map((item, index) => <button key={item} onClick={() => index === 0 && toHome()}>{item}</button>)}
      </nav>
      <div className="header-actions">
        <button className="language-button" onClick={switchLocale} aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}><Globe2 size={16} /><span>{locale === 'zh' ? 'EN' : '中文'}</span></button>
        <button className="button dark header-cta">{copy.start}<ArrowButtonIcon /></button>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="mobile-nav">{copy.nav.map((item, index) => <button key={item} onClick={() => { if (index === 0) toHome(); setOpen(false) }}>{item}<ChevronRight size={16} /></button>)}<button onClick={switchLocale}>{locale === 'zh' ? 'English' : '中文'}<Globe2 size={16} /></button></div>}
    </header>
  )
}

function IconBadge({ name, tone = 'blue' }) {
  const Icon = iconMap[name] || Sparkles
  return <span className={`icon-badge ${tone}`}><Icon size={20} strokeWidth={1.9} /></span>
}

function HubToolRow({ tool, locale, navigate }) {
  const Icon = iconMap[tool.icon] || Sparkles
  const base = locale === 'zh' ? '/zh' : ''
  return (
    <button className="hub-tool-row" onClick={() => navigate(`${base}/free-tools/${tool.slug}`)}>
      <span className="hub-tool-icon"><Icon size={21} /></span>
      <span className="hub-tool-main"><strong>{tool.shortName[locale]}</strong><small>{tool.benefit[locale]}</small></span>
      <span className="hub-tool-platforms">{tool.platforms.slice(0, 2).join(' · ')}</span>
      <span className="hub-tool-updated">{tool.updated[locale]}</span>
      <ArrowRight size={18} />
    </button>
  )
}

function HubPage({ locale, navigate }) {
  const copy = hubCopy[locale]
  const ui = uiCopy[locale]
  const base = locale === 'zh' ? '/zh' : ''
  const firstTool = () => navigate(`${base}/free-tools/fake-follower-checker`)
  return (
    <>
      <Header locale={locale} navigate={navigate} />
      <main>
        <section className="hub-hero ambient-section">
          <div className="hub-title-wrap">
            <p className="functional-eyebrow">{copy.eyebrow}</p>
            <h1>{copy.titleLead}<br /><em>{copy.titleAccent}</em></h1>
            <p className="hero-description">{copy.description}</p>
            <button className="button dark hero-cta" onClick={firstTool}>{copy.cta}<ArrowButtonIcon /></button>
          </div>
          <div className="live-signal-rail" aria-label={copy.liveLabel}>
            {liveSignals[locale].map(([icon, label, time]) => <div className="live-signal-row" key={label}><IconBadge name={icon} tone={icon === 'pulse' ? 'amber' : icon === 'user' ? 'green' : 'blue'} /><strong>{label}</strong><span>{time}</span></div>)}
          </div>
          <div className="live-rail-caption"><i />{copy.liveLabel}</div>
        </section>

        <section className="hub-index page-container">
          {Object.entries(categoryCopy).map(([category, categoryData]) => {
            const text = categoryData[locale]
            return <article className="hub-chapter" id={category} key={category}>
              <div className="chapter-number">{categoryData.no}</div>
              <div className="chapter-content"><h2>{text.title}</h2><p>{text.description}</p><div className="hub-tool-list">{tools.filter((tool) => tool.category === category).map((tool) => <HubToolRow key={tool.slug} tool={tool} locale={locale} navigate={navigate} />)}</div></div>
            </article>
          })}
        </section>

        <section className="trust-band page-container">
          <div><i className="trust-dot blue" /><strong>Observed</strong><p>{locale === 'zh' ? '来自广告、公开数据与平台活动的直接信号' : 'Signals from live ads, public data and platform activity'}</p></div>
          <div><i className="trust-dot amber" /><strong>Estimated</strong><p>{locale === 'zh' ? '直接数据不可用时使用带置信度的模型洞察' : "Confidence-scored insights where direct data isn’t available"}</p></div>
          <div><i className="trust-dot green" /><strong>Updated</strong><p>{locale === 'zh' ? '持续刷新，让你基于最新变化采取行动' : 'Continuously refreshed so you act on the latest signals'}</p></div>
          <footer>{copy.trustTitle}</footer>
        </section>

        <section className="hub-closing ambient-section">
          <h2>{copy.closingTitle}<br /><em>{copy.closingAccent}</em></h2>
          <button className="button dark" onClick={firstTool}>{copy.cta}<ArrowButtonIcon /></button>
          <p>{locale === 'zh' ? '免费工具 · 无需注册 · 面向出海业务' : 'Free tools · No sign-up required · Cross-border ready'}</p>
        </section>
      </main>
      <SiteFooter locale={locale} navigate={navigate} />
    </>
  )
}

function QueryPanel({ tool, locale, state, setState, query, setQuery, resultRef }) {
  const ui = uiCopy[locale]
  const [values, setValues] = useState(() => Object.fromEntries(tool.fields.map((field, index) => [field.key || `field-${index}`, field.type === 'text' ? query || '' : field.options?.[0] || ''])))
  useEffect(() => {
    setValues(Object.fromEntries(tool.fields.map((field, index) => [field.key || `field-${index}`, field.type === 'text' ? query || '' : field.options?.[0] || ''])))
  }, [tool.slug])

  const run = (event) => {
    event?.preventDefault()
    const textField = tool.fields.find((field) => field.type === 'text')
    const value = values[textField?.key || `field-${tool.fields.indexOf(textField)}`]
    if (!value?.trim()) {
      setState('error')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      return
    }
    setQuery(value)
    setState('validating')
    setTimeout(() => setState('running'), 500)
    setTimeout(() => {
      setState('preview')
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1450)
  }

  const useExample = () => {
    const textFieldIndex = tool.fields.findIndex((field) => field.type === 'text')
    const key = tool.fields[textFieldIndex]?.key || `field-${textFieldIndex}`
    setValues((old) => ({ ...old, [key]: tool.sample }))
  }

  return (
    <div className={`query-composer fields-${tool.fields.length}`}>
      <form className="query-panel" onSubmit={run}>
        <div className="query-fields">
          {tool.fields.map((field, index) => {
            const key = field.key || `field-${index}`
            return (
              <div className={`field field-${field.type}`} key={key}>
                <span className="sr-only">{field.label[locale]}</span>
                {field.type === 'text'
                  ? <input value={values[key] || ''} onChange={(e) => setValues({ ...values, [key]: e.target.value })} placeholder={field.placeholder} aria-label={field.label[locale]} />
                  : <SignalSelect field={field} value={values[key]} onChange={(value) => setValues({ ...values, [key]: value })} locale={locale} />}
              </div>
            )
          })}
        </div>
        <button className="button dark query-cta" type="submit" disabled={state === 'validating' || state === 'running'}>{state === 'validating' || state === 'running' ? <><RefreshCw className="spin" size={18} />{ui.states[state]}</> : <>{tool.cta[locale]}<ArrowButtonIcon /></>}</button>
      </form>
      <div className="query-helper"><span className="free-signal-note"><ShieldCheck size={15} />{ui.firstFree} · {ui.noSignup}</span><button type="button" onClick={useExample}>{ui.useExample}: {tool.sample}</button></div>
    </div>
  )
}

function Metrics({ tool, locale }) {
  return <div className={`metrics-grid metrics-${tool.metrics.length}`}>{tool.metrics.map((metric) => <div className="metric" key={metric.label.en}><span className={`metric-symbol ${metric.tone}`}><TrendingUp size={18} /></span><small>{metric.label[locale]}</small><strong>{metric.zhValue && locale === 'zh' ? metric.zhValue : metric.value}<i>{metric.suffix}</i></strong>{metric.tone === 'amber' || metric.tone === 'risk' ? <em>Estimated</em> : null}</div>)}</div>
}

function EvidenceLens({ tool, locale }) {
  const ui = uiCopy[locale]
  const columns = [['observed', Eye, ui.observed], ['interpreted', Sparkles, ui.interpreted], ['next', ArrowRight, ui.next]]
  return <section className="evidence-lens">{columns.map(([key, Icon, label]) => <div key={key}><div className={`evidence-title ${key}`}><Icon size={21} /><h3>{label}</h3></div><ul>{tool.evidence[key][locale].map((item) => <li key={item}>{item}</li>)}</ul></div>)}</section>
}

function InlineGate({ tool, locale, onUnlock }) {
  const ui = uiCopy[locale]
  return <section className="inline-gate"><span className="gate-icon"><LockKeyhole size={19} /></span><h2>{tool.signup[locale]}</h2><p>{locale === 'zh' ? '免费注册后保留当前查询，并立即查看完整维度与判断依据' : 'Create a free account to keep this query and see every dimension behind the signal'}</p><button className="button dark" onClick={onUnlock}><LockKeyhole size={16} />{ui.signupAction}<ArrowButtonIcon /></button><LockedPreview locale={locale} /></section>
}

function LockedPreview({ locale }) {
  return <div className="locked-preview" aria-hidden="true"><div className="locked-preview-head"><span>{locale === 'zh' ? '完整素材与历史' : 'Complete history and details'}</span><span>{locale === 'zh' ? '状态' : 'Status'}</span></div>{[1,2,3].map((row) => <div key={row}><i /><b /><span /></div>)}</div>
}

function FullAnalysis({ tool, locale, onPaid }) {
  const ui = uiCopy[locale]
  const reward = tool.slug === 'influencer-email-finder' || tool.slug === 'influencer-video-downloader'
  return <section className="full-analysis"><div className="section-heading"><div><span className="section-kicker">{ui.complete}</span><h2>{locale === 'zh' ? '完整信号已经解锁' : 'Your complete signal is unlocked'}</h2></div><span className="success-chip"><Check size={16} />{locale === 'zh' ? '已保存当前查询' : 'Query preserved'}</span></div>{reward && <div className="reward-banner"><Sparkles /><div><strong>{locale === 'zh' ? '一次性免费奖励已加入账户' : 'Your one-time free reward is ready'}</strong><span>{tool.slug === 'influencer-email-finder' ? (locale === 'zh' ? '本次可以免费揭示 1 个验证邮箱' : 'Reveal one verified email free in this session') : (locale === 'zh' ? '本次可以免费完成 1 次标准质量下载' : 'Complete one standard-quality download free in this session')}</span></div></div>}<div className="full-list">{tool.fullItems[locale].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><Check size={18} /></div>)}</div><div className="paid-actions"><div><span className="section-kicker">{ui.paid}</span><h3>{locale === 'zh' ? '把一次查询变成持续动作' : 'Turn one check into continuous action'}</h3></div><div className="paid-action-list">{tool.paid[locale].map((item) => <span key={item}><Check size={14} />{item}</span>)}</div><button className="button dark" onClick={onPaid}>{tool.paidCta[locale]}<ArrowButtonIcon /></button></div></section>
}

function PaidGate({ tool, locale }) {
  return <section className="paid-gate"><div className="paid-gate-icon"><Zap /></div><div><span>{locale === 'zh' ? '持续情报' : 'Continuous intelligence'}</span><h2>{tool.paidCta[locale]}</h2><p>{locale === 'zh' ? '这是高频、批量、导出与持续追踪能力的模拟升级界面，原型不会发起真实支付' : 'This prototype simulates the upgrade surface for repeat, bulk, export and continuous tracking actions. No payment is initiated'}</p></div><button className="button dark">{locale === 'zh' ? '查看 Pro 方案' : 'View Pro plan'}<ArrowButtonIcon /></button></section>
}

function SpecialState({ state, locale, tool, setState }) {
  const ui = uiCopy[locale]
  const content = {
    validating: [RefreshCw, ui.states.validating, locale === 'zh' ? '正在确认平台、URL 与对象类型' : 'Confirming platform, URL and entity type'],
    running: [Radar, ui.states.running, locale === 'zh' ? '正在读取平台观测、历史变化与同类背景' : 'Reading platform observations, history and peer context'],
    partial: [Search, ui.states.partial, locale === 'zh' ? '找到多个可能对象，请确认最符合的结果' : 'Multiple possible entities were found. Confirm the closest match'],
    noresult: [Eye, ui.states.noresult, locale === 'zh' ? '当前公开数据不足，未生成低置信度结论' : 'There is not enough public data to produce a responsible signal'],
    ratelimit: [Clock3, ui.states.ratelimit, locale === 'zh' ? '匿名额度将在 07:42:18 后重置' : 'Your anonymous allowance resets in 07:42:18'],
    error: [Zap, ui.states.error, locale === 'zh' ? '请检查输入格式，我们已经保留当前内容' : 'Check the input format. Your current value has been preserved'],
  }
  const [Icon, title, description] = content[state]
  return <section className={`special-state state-${state}`}><span><Icon className={state === 'validating' || state === 'running' ? 'spin' : ''} /></span><div><h2>{title}</h2><p>{description}</p>{state === 'partial' && <div className="candidate-list"><button onClick={() => setState('preview')}>Notion Labs, Inc. <small>notion.so</small></button><button onClick={() => setState('preview')}>Notion Calendar <small>calendar.notion.so</small></button></div>}{['noresult','ratelimit','error'].includes(state) && <button className="text-action" onClick={() => setState('idle')}>{state === 'error' ? ui.retry : ui.useExample}<ArrowRight size={15} /></button>}</div></section>
}

function Methodology({ tool, locale }) {
  const ui = uiCopy[locale]
  return <section className="methodology page-container"><div><IconBadge name="benchmark" tone="blue" /><h3>{ui.methodology}</h3><p>{tool.trust[locale].methodology}</p><button>{locale === 'zh' ? '了解计算方法' : 'Learn how we calculate'}<ArrowRight size={15} /></button></div><div><IconBadge name="user-check" tone="green" /><h3>{ui.limitations}</h3><p>{tool.trust[locale].limitations}</p><button>{locale === 'zh' ? '查看数据说明' : 'Read data notes'}<ArrowRight size={15} /></button></div></section>
}

function RelatedSignals({ tool, locale, navigate, query }) {
  const ui = uiCopy[locale]
  const base = locale === 'zh' ? '/zh' : ''
  return <section className="related page-container"><div className="section-heading"><div><span className="section-kicker">Signal chain</span><h2>{ui.related}</h2></div></div><div className="related-grid">{tool.related.map((slug) => { const related = getTool(slug); const Icon = iconMap[related.icon] || Sparkles; return <button key={slug} onClick={() => navigate(`${base}/free-tools/${slug}?q=${encodeURIComponent(query || tool.sample)}`)}><span><Icon size={22} /></span><div><strong>{related.shortName[locale]}</strong><small>{related.benefit[locale]}</small></div><ChevronRight size={18} /></button> })}</div></section>
}

function FAQ({ tool, locale }) {
  const ui = uiCopy[locale]
  const [open, setOpen] = useState(0)
  return <section className="faq page-container"><div className="section-heading"><div><span className="section-kicker">FAQ</span><h2>{ui.faq}</h2></div></div><div className="faq-list">{tool.faqs[locale].map(([question, answer], index) => <div className={open === index ? 'open' : ''} key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={18} /></button><p>{answer}</p></div>)}</div></section>
}

function PrototypeController({ state, setState, locale }) {
  const show = new URLSearchParams(window.location.search).get('prototype') === '1'
  if (!show) return null
  return <aside className="prototype-controller"><label>Prototype state<select value={state} onChange={(e) => setState(e.target.value)}>{states.map((item) => <option key={item} value={item}>{uiCopy[locale].states[item]}</option>)}</select></label></aside>
}

const benefitAccents = {
  'fake-follower-checker': { en: 'real audience', zh: '真实受众' },
  'influencer-email-finder': { en: 'verified business contact', zh: '已验证的商务邮箱' },
  'influencer-video-downloader': { en: 'save public creator videos', zh: '保存公开达人视频' },
  'influencer-brand-collaboration-checker': { en: 'already trust this creator', zh: '已经与这个达人合作' },
  'competitor-ad-tracker': { en: 'launch, scale or retire ads', zh: '上新、起量或下线素材' },
  'ad-creative-performance-analyzer': { en: 'truly outperforming', zh: '正在跑赢同类' },
  'ad-creative-lifecycle-checker': { en: 'starts losing momentum', zh: '看见疲劳信号' },
  'advertising-benchmark-report': { en: 'market you actually compete in', zh: '校准你的投放 KPI' },
  'app-game-downloads-revenue-tracker': { en: 'real market momentum', zh: '市场动量' },
}

function StyledBenefit({ tool, locale }) {
  const full = tool.benefit[locale]
  const accent = benefitAccents[tool.slug]?.[locale]
  const index = accent ? full.toLowerCase().lastIndexOf(accent.toLowerCase()) : -1
  if (index < 0) return full
  return <>{full.slice(0, index)}<em>{full.slice(index, index + accent.length)}</em>{full.slice(index + accent.length)}</>
}

function ToolPage({ tool, locale, navigate }) {
  const params = new URLSearchParams(window.location.search)
  const requestedState = params.get('state')
  const [state, setState] = useState(states.includes(requestedState) ? requestedState : 'idle')
  const [query, setQuery] = useState(params.get('q') || '')
  const resultRef = useRef(null)

  useEffect(() => {
    setState(states.includes(new URLSearchParams(window.location.search).get('state')) ? new URLSearchParams(window.location.search).get('state') : 'idle')
    setQuery(new URLSearchParams(window.location.search).get('q') || '')
  }, [tool.slug])

  const hasResult = ['preview', 'signup', 'full', 'paid'].includes(state)
  const isSpecial = ['validating', 'running', 'partial', 'noresult', 'ratelimit', 'error'].includes(state)
  return (
    <>
      <Header locale={locale} navigate={navigate} />
      <main className="tool-main">
        <section className={`tool-hero ambient-section ${hasResult ? 'has-result' : ''}`}>
          <div className="tool-hero-copy">
            <p className="functional-eyebrow signal-eyebrow"><i />Signal {tool.signal} · {tool.shortName.en}</p>
            <h1>{tool.name[locale]}</h1>
            <p className="tool-benefit"><StyledBenefit tool={tool} locale={locale} /></p>
            <p className="tool-description">{tool.description[locale]}</p>
          </div>
          <QueryPanel tool={tool} locale={locale} state={state} setState={setState} query={query} setQuery={setQuery} resultRef={resultRef} />
          <div className="coverage-line"><span>{tool.platforms.join(' · ')}</span><i /><span>{tool.updated[locale]}</span><i /><span>{locale === 'zh' ? '仅使用公开数据' : 'Public data only'}</span></div>
        </section>

        <div className="result-anchor" ref={resultRef} />
        {isSpecial && <div className="page-container result-shell"><SpecialState state={state} locale={locale} tool={tool} setState={setState} /></div>}
        {hasResult && <div className="result-shell page-container">
          <section className="signal-sentence"><IconBadge name={tool.icon} tone={tool.metrics.some(m => m.tone === 'risk') ? 'risk' : 'blue'} /><p>{tool.signalSentence[locale]}</p></section>
          <Metrics tool={tool} locale={locale} />
          <section className="primary-visual-shell"><PrimaryVisual tool={tool} /></section>
          <EvidenceLens tool={tool} locale={locale} />
          {(state === 'preview' || state === 'signup') && <InlineGate tool={tool} locale={locale} onUnlock={() => setState('full')} />}
          {(state === 'full' || state === 'paid') && <FullAnalysis tool={tool} locale={locale} onPaid={() => setState('paid')} />}
          {state === 'paid' && <PaidGate tool={tool} locale={locale} />}
        </div>}

        <Methodology tool={tool} locale={locale} />
        <RelatedSignals tool={tool} locale={locale} navigate={navigate} query={query} />
        <FAQ tool={tool} locale={locale} />
        <section className="tool-closing ambient-section"><p>{locale === 'zh' ? '从一次查询，走向持续情报' : 'From one check to continuous intelligence'}</p><h2>{tool.paidCta[locale]}</h2><button className="button dark" onClick={() => setState(hasResult ? 'paid' : 'preview')}>{hasResult ? tool.paidCta[locale] : tool.cta[locale]}<ArrowButtonIcon /></button></section>
      </main>
      <SiteFooter locale={locale} navigate={navigate} />
      <PrototypeController state={state} setState={setState} locale={locale} />
    </>
  )
}

function SiteFooter({ locale, navigate }) {
  const base = locale === 'zh' ? '/zh' : ''
  return <footer className="site-footer"><button className="brand" onClick={() => navigate(`${base}/free-tools`)}>creativault<span>.</span></button><p>{locale === 'zh' ? '把市场变化变成可执行信号' : 'Turn market change into actionable signals'}</p><span>© 2026 CreatiVault</span></footer>
}

function updateSeo(tool, locale) {
  const title = tool ? `${tool.name[locale]} | CreatiVault` : `${hubCopy[locale].eyebrow} | CreatiVault`
  const description = tool ? tool.description[locale] : hubCopy[locale].description
  document.documentElement.lang = locale === 'zh' ? 'zh-Hans' : 'en'
  document.title = title
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.content = description
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
  const transient = ['q', 'state', 'prototype'].some((key) => new URLSearchParams(window.location.search).has(key))
  robots.content = transient ? 'noindex, nofollow' : 'index, follow'
  const canonical = `${window.location.origin}${window.location.pathname}`
  const setLink = (rel, href, hreflang) => {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`
    let node = document.head.querySelector(selector)
    if (!node) { node = document.createElement('link'); node.rel = rel; if (hreflang) node.hreflang = hreflang; document.head.appendChild(node) }
    node.href = href
  }
  setLink('canonical', canonical)
  const englishPath = window.location.pathname.replace(/^\/zh/, '') || '/free-tools'
  setLink('alternate', `${window.location.origin}${englishPath}`, 'en')
  setLink('alternate', `${window.location.origin}/zh${englishPath}`, 'zh-Hans')
  setLink('alternate', `${window.location.origin}${englishPath}`, 'x-default')

  let structuredData = document.getElementById('seo-jsonld')
  if (!structuredData) { structuredData = document.createElement('script'); structuredData.id = 'seo-jsonld'; structuredData.type = 'application/ld+json'; document.head.appendChild(structuredData) }
  const baseUrl = 'https://creativault.ai'
  const pagePath = window.location.pathname
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'zh' ? '首页' : 'Home', item: `${baseUrl}${locale === 'zh' ? '/zh' : ''}` },
      { '@type': 'ListItem', position: 2, name: locale === 'zh' ? '免费工具' : 'Free Tools', item: `${baseUrl}${locale === 'zh' ? '/zh/free-tools' : '/free-tools'}` },
      ...(tool ? [{ '@type': 'ListItem', position: 3, name: tool.name[locale], item: `${baseUrl}${pagePath}` }] : []),
    ],
  }
  const primary = tool ? {
    '@type': 'WebApplication',
    name: tool.name[locale],
    description: tool.description[locale],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web browser',
    url: `${baseUrl}${pagePath}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: locale === 'zh' ? '第一条信号免费' : 'First signal free' },
    provider: { '@type': 'Organization', name: 'CreatiVault', url: baseUrl },
  } : {
    '@type': 'ItemList',
    name: hubCopy[locale].eyebrow,
    itemListElement: tools.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name[locale], url: `${baseUrl}${locale === 'zh' ? '/zh' : ''}/free-tools/${item.slug}` })),
  }
  structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [primary, breadcrumb] })
}

function updateHomeSeo() {
  document.documentElement.lang = 'en'
  document.title = homeCopy.meta.title
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.content = homeCopy.meta.description
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
  robots.content = 'index, follow'
  let canonical = document.head.querySelector('link[rel="canonical"]:not([hreflang])')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
  canonical.href = `${window.location.origin}${window.location.pathname}`
}

export default function App() {
  const { locale, slug, isFreeTools, navigate } = useRoute()
  const tool = useMemo(() => getTool(slug), [slug])
  useEffect(() => {
    if (isFreeTools) updateSeo(tool, locale)
    else updateHomeSeo()
  }, [tool, locale, isFreeTools])
  if (!isFreeTools) return <HomePage navigate={navigate} />
  return tool ? <ToolPage key={`${locale}-${tool.slug}`} tool={tool} locale={locale} navigate={navigate} /> : <HubPage locale={locale} navigate={navigate} />
}
