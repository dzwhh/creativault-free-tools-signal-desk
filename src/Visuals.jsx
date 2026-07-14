import React from 'react'
import { Check, MailCheck, Play, Sparkles, TrendingUp } from 'lucide-react'

const points = '8,88 48,82 88,86 128,71 168,76 208,60 248,64 288,48 328,52 368,32 408,24 448,11'

function LineChart({ risk = false, compact = false }) {
  return (
    <div className={`line-chart ${compact ? 'compact' : ''}`} aria-label="Trend chart rising over the selected period">
      <svg viewBox="0 0 456 108" role="img">
        {[24, 48, 72, 96].map((y) => <line key={y} x1="0" x2="456" y1={y} y2={y} className="chart-grid" />)}
        <path d={`M ${points.replaceAll(' ', ' L ')}`} className={risk ? 'chart-path risk' : 'chart-path'} />
        <path d={`M ${points.replaceAll(' ', ' L ')} L448,108 L8,108 Z`} className={risk ? 'chart-area risk' : 'chart-area'} />
        {[['8','88'], ['168','76'], ['288','48'], ['448','11']].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3.5" className={risk ? 'chart-dot risk' : 'chart-dot'} />)}
      </svg>
      {!compact && <div className="chart-axis"><span>Day 1</span><span>Day 10</span><span>Day 20</span><span>Today</span></div>}
    </div>
  )
}

function AuthenticityVisual() {
  return (
    <div className="visual-grid authenticity-visual">
      <div className="score-orbit"><div><strong>87</strong><span>Authenticity</span></div></div>
      <div className="distribution">
        <div className="distribution-label"><span>Audience quality</span><span>100%</span></div>
        <div className="distribution-bar"><i className="real" /><i className="low" /><i className="suspect" /></div>
        <div className="legend"><span><i className="dot real" />Real 74%</span><span><i className="dot low" />Low quality 16%</span><span><i className="dot suspect" />Suspected 10%</span></div>
        <LineChart compact />
      </div>
    </div>
  )
}

function EmailVisual() {
  return (
    <div className="email-visual">
      <div className="verified-seal"><MailCheck size={30} /><span>Verified</span></div>
      <div className="masked-contact"><span>Business email</span><strong>em••••••@studio.co</strong><small>Matched across 2 public profile sources</small></div>
      <div className="source-chain"><span>Instagram bio</span><i /><span>Creator website</span><i /><span className="active">Identity match</span></div>
    </div>
  )
}

function VideoVisual() {
  return (
    <div className="video-visual">
      <div className="video-frame">
        <div className="video-scene"><Sparkles /><span>CREATOR<br />SIGNALS</span></div>
        <button className="play-button" aria-label="Play preview"><Play fill="currentColor" /></button>
        <span className="duration">00:27</span>
      </div>
      <div className="video-meta">
        <div><span>Creator</span><strong>@emilycreative</strong></div>
        <div><span>Published</span><strong>Jul 12, 2026</strong></div>
        <div><span>Available</span><strong>MP4 · WEBM</strong></div>
        <div className="transcript"><span>Transcript preview</span><p>“Three hooks I use before launching a new campaign…”</p></div>
      </div>
    </div>
  )
}

const brandNames = ['Glossier', 'Ritual', 'Rare Beauty', 'Oura', 'Summer Fridays']

function BrandsVisual() {
  return (
    <div className="brands-visual">
      <div className="brand-timeline-line" />
      {brandNames.map((name, index) => (
        <div className="brand-stop" key={name}>
          <span className={`brand-mark mark-${index}`}>{name.slice(0, 1)}</span>
          <strong>{name}</strong>
          <small>{index === 0 ? '4 days ago' : `${index + 1} weeks ago`}</small>
        </div>
      ))}
    </div>
  )
}

function CreativeRail() {
  return (
    <div className="creative-rail">
      {[['Your notes.','Organized. Effortless.'], ['One workspace.','Every project.'], ['AI that works','where you do.']].map(([a,b], index) => (
        <div className={`creative-card creative-${index}`} key={a}>
          <small>NOTION</small><strong>{a}<br />{b}</strong><span>New · {index * 2 + 2}h ago</span>
        </div>
      ))}
    </div>
  )
}

function ActivityVisual() {
  return <div className="activity-visual"><div className="visual-heading"><strong>Ad activity</strong><span>30 days</span></div><LineChart /><CreativeRail /></div>
}

function PerformanceVisual() {
  const dots = [[12,79],[20,68],[27,72],[34,57],[41,64],[49,44],[57,51],[65,35],[72,40],[79,23],[88,17]]
  return (
    <div className="performance-visual">
      <div className="visual-heading"><strong>Creative peer set</strong><span>Spend signal × longevity</span></div>
      <svg viewBox="0 0 520 220" role="img" aria-label="Scatter plot showing the selected creative in the top performance group">
        {[44,88,132,176].map(y => <line key={y} x1="34" x2="510" y1={y} y2={y} className="chart-grid" />)}
        {dots.map(([x,y],i) => <circle key={i} cx={x*5.2} cy={y*2.1} r={i===9?10:5+(i%3)} className={i===9?'scatter-selected':'scatter-dot'} />)}
        <circle cx="410" cy="49" r="18" className="selected-ring" />
        <text x="433" y="42" className="svg-label">Selected creative</text>
        <text x="433" y="58" className="svg-caption">Top 18%</text>
      </svg>
      <div className="performance-callout"><TrendingUp /><div><strong>Durable performance</strong><span>Active 24 days with expanding placement coverage</span></div></div>
    </div>
  )
}

function LifecycleVisual() {
  return (
    <div className="lifecycle-visual">
      <div className="stage-row">
        {['Testing', 'Scaling', 'Mature', 'Fatigue'].map((stage,index) => <div key={stage} className={index===3?'current':''}><i>{index<3?<Check size={13}/>:index+1}</i><span>{stage}</span></div>)}
      </div>
      <div className="lifecycle-chart">
        <svg viewBox="0 0 520 190" role="img" aria-label="Creative lifecycle curve declining into fatigue">
          {[38,76,114,152].map(y => <line key={y} x1="0" x2="520" y1={y} y2={y} className="chart-grid" />)}
          <path d="M8 156 C58 156,58 120,110 112 S194 31,260 28 S356 38,396 59 S470 112,510 142" className="lifecycle-path" />
          <path d="M396 59 C438 74,470 112,510 142 L510 180 L396 180 Z" className="fatigue-area" />
          <circle cx="411" cy="66" r="7" className="risk-dot" />
          <text x="425" y="62" className="svg-label">Fatigue detected</text>
        </svg>
      </div>
    </div>
  )
}

function BenchmarkVisual({ metrics }) {
  return (
    <div className="benchmark-visual">
      {metrics.map((metric,index) => (
        <div className="benchmark-cell" key={metric.label.en}>
          <span>{metric.label.en}</span><strong>{metric.value}{metric.suffix}</strong>
          <div className="bullet"><i style={{width: `${[68,82,61,74][index]}%`}} /><b style={{left: `${[54,63,72,58][index]}%`}} /></div>
          <small>{index===0?'12% above median':'Within healthy range'}</small>
        </div>
      ))}
    </div>
  )
}

function AppVisual() {
  return (
    <div className="app-visual">
      <div className="app-summary"><div className="app-icon">M</div><div><strong>Monopoly GO!</strong><span>Scopely · Games</span></div></div>
      <div className="separate-charts">
        <div><div className="visual-heading"><strong>Estimated downloads</strong><span className="positive">+18%</span></div><LineChart compact /></div>
        <div><div className="visual-heading"><strong>Estimated revenue</strong><span className="positive">+7%</span></div><LineChart compact /></div>
      </div>
    </div>
  )
}

export default function PrimaryVisual({ tool }) {
  switch (tool.visual) {
    case 'authenticity': return <AuthenticityVisual />
    case 'email': return <EmailVisual />
    case 'video': return <VideoVisual />
    case 'brands': return <BrandsVisual />
    case 'activity': return <ActivityVisual />
    case 'performance': return <PerformanceVisual />
    case 'lifecycle': return <LifecycleVisual />
    case 'benchmark': return <BenchmarkVisual metrics={tool.metrics} />
    case 'app': return <AppVisual />
    default: return <LineChart />
  }
}
