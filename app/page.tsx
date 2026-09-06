'use client';

import { useRef, useState } from 'react';

type Project = { number:string; title:string; cn:string; year:string; type:string; tone:string };

const masterProjects: Project[] = [
  { number:'M.01', title:'FUTURE COMMONS', cn:'未来公共空间研究', year:'2026', type:'RESEARCH · SYSTEM', tone:'violet' },
  { number:'M.02', title:'SOFT BOUNDARY', cn:'社会创新服务设计', year:'2025', type:'SERVICE · EXPERIENCE', tone:'acid' },
  { number:'M.03', title:'TRACES OF LIGHT', cn:'交互装置与叙事', year:'2025', type:'INTERACTION · SPACE', tone:'coral' },
  { number:'M.04', title:'OPEN PROTOCOL', cn:'毕业设计档案', year:'2026', type:'VISUAL · EDITORIAL', tone:'blue' },
];

const bachelorProjects: Project[] = [
  { number:'B.01', title:'CITY FREQUENCY', cn:'城市视觉识别系统', year:'2022', type:'BRANDING · SYSTEM', tone:'blue' },
  { number:'B.02', title:'MATERIAL MEMORY', cn:'材料语言实验', year:'2023', type:'OBJECT · RESEARCH', tone:'coral' },
  { number:'B.03', title:'ANOTHER DAILY', cn:'日常用品再设计', year:'2023', type:'PRODUCT · UX', tone:'violet' },
  { number:'B.04', title:'LOCAL SIGNALS', cn:'地方文化视觉档案', year:'2024', type:'EDITORIAL · TYPE', tone:'acid' },
];

const illustrationProjects: Project[] = [
  { number:'I.01', title:'NIGHT GARDEN', cn:'夜游花园', year:'2026', type:'DIGITAL PAINTING', tone:'coral' },
  { number:'I.02', title:'DISTANT ROOM', cn:'遥远的房间', year:'2025', type:'ILLUSTRATION', tone:'violet' },
  { number:'I.03', title:'WIND STUDY', cn:'风的研究', year:'2025', type:'VISUAL DIARY', tone:'blue' },
  { number:'I.04', title:'SMALL UNIVERSE', cn:'微小宇宙', year:'2024', type:'PERSONAL WORK', tone:'acid' },
];

const folders = [
  { number:'01', title:'ABOUT', cn:'基本信息', note:'WHO I AM', href:'#about', image:'/folder-about-objects.png', tone:'folder-pink' },
  { number:'02', title:'MASTER’S WORK', cn:'硕士期间作品', note:'RESEARCH · SERVICE · INTERACTION', href:'#masters', image:'/folder-masters-objects.png', tone:'folder-sage' },
  { number:'03', title:'BACHELOR’S WORK', cn:'本科期间作品', note:'VISUAL · BRAND · INTERACTION', href:'#bachelors', image:'/folder-bachelors-objects.png', tone:'folder-gold' },
  { number:'04', title:'ILLUSTRATION', cn:'数字绘画 / 插画', note:'DRAWING · PERSONAL WORK', href:'#illustration', image:'/folder-illustration-objects.png', tone:'folder-lilac' },
];

function FolderNavigator() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, left:0, moved:false });
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, left:track.current.scrollLeft, moved:false };
    track.current.setPointerCapture(e.pointerId);
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const delta = e.clientX - drag.current.x;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - delta;
  };
  const end = () => { drag.current.active = false; };

  return (
    <div className="folder-nav">
      <p className="folder-instruction">DRAG FILES TO EXPLORE <span>↔</span></p>
      <div className="folder-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {folders.map((folder) => (
          <a className={`folder-card ${folder.tone}`} href={folder.href} key={folder.number} onClick={e=>drag.current.moved && e.preventDefault()} aria-label={`进入${folder.cn}`}>
            <div className="folder-back" />
            <img className="folder-objects" src={folder.image} alt="" draggable={false} />
            <div className="folder-front">
              <span className="folder-number">{folder.number}</span>
              <span className="folder-open">OPEN ↗</span>
              <h2>{folder.title}<small>{folder.cn}</small></h2>
              <p>{folder.note}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectTrack({ projects, label, onOpen }:{ projects:Project[]; label:string; onOpen:(p:Project)=>void }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, left:0, moved:false });
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, left:track.current.scrollLeft, moved:false };
    track.current.setPointerCapture(e.pointerId);
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const delta = e.clientX - drag.current.x;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - delta;
  };
  const end = () => { drag.current.active = false; };
  const nudge = (direction:number) => track.current?.scrollBy({ left:direction * Math.min(innerWidth * .72, 720), behavior:'smooth' });

  return (
    <div className="track-wrap">
      <div className="track-tools">
        <p>DRAG TO EXPLORE <span>↔</span></p>
        <div><button onClick={()=>nudge(-1)} aria-label={`向左浏览${label}`}>←</button><button onClick={()=>nudge(1)} aria-label={`向右浏览${label}`}>→</button></div>
      </div>
      <div className="project-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {projects.map((project, index) => (
          <button className="project-card" key={project.number} onClick={()=>!drag.current.moved && onOpen(project)} aria-label={`查看 ${project.cn} 详情`}>
            <div className={`project-art ${project.tone}`}>
              <span className="art-grid" /><span className="art-orb" /><span className="art-mark">{String(index+1).padStart(2,'0')}</span>
              <span className="view-chip">VIEW PROJECT ↗</span>
            </div>
            <div className="project-meta"><span>{project.number}</span><h3>{project.title}<small>{project.cn}</small></h3><p>{project.year}<br />{project.type}</p></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <section className="hero" id="home">
        <header className="topbar">
          <a className="wordmark" href="#home" aria-label="返回首页">WENHUI®</a>
          <p className="availability"><span /> AVAILABLE FOR OPPORTUNITIES</p>
          <button className="menu-pill" onClick={()=>setMenuOpen(true)}>INDEX <b>04</b></button>
        </header>
        <div className="hero-stage" aria-label="可拖动的作品集章节文件夹"><FolderNavigator /></div>
        <div className="hero-copy"><p className="hero-subtitle">Ideas Made Visible</p><h1>Welcome to<br /><em>文慧’s</em> Portfolio</h1><p className="intro">设计 · 插画 · 视觉叙事<br />SELECTED WORK, 2022—2026</p></div>
        <a className="scroll-cue" href="#index"><span>SCROLL TO EXPLORE</span><i>↓</i></a>
      </section>

      <section className="index-section" id="index">
        <div className="section-kicker">01 / INDEX <span>网站目录</span></div>
        <nav aria-label="作品集目录">
          <a className="index-row" href="#about"><span>01</span><h2>ABOUT<small>关于我</small></h2><b>↘</b></a>
          <a className="index-row" href="#masters"><span>02</span><h2>MASTER&apos;S WORK<small>硕士期间作品</small></h2><b>↘</b></a>
          <a className="index-row" href="#bachelors"><span>03</span><h2>BACHELOR&apos;S WORK<small>本科期间作品</small></h2><b>↘</b></a>
          <a className="index-row" href="#illustration"><span>04</span><h2>ILLUSTRATION<small>数字绘画 / 插画</small></h2><b>↘</b></a>
        </nav>
      </section>

      <section className="about-section" id="about">
        <div className="section-kicker light">02 / ABOUT <span>基本信息</span></div>
        <div className="about-grid">
          <div className="portrait-placeholder"><span>PORTRAIT<br />PLACEHOLDER</span><i>ADD YOUR PHOTO</i></div>
          <div className="about-copy"><p className="eyebrow">PROFILE / 个人信息</p><h2>A designer working<br />between <em>systems</em><br />and stories.</h2><p>这是一段个人介绍占位。后续将补充你的设计方向、研究兴趣、教育背景与职业目标。</p></div>
          <div className="info-stack">
            <article><span>01</span><h3>DESIGN FIELDS</h3><p>Visual Design<br />Service Design<br />Illustration</p></article>
            <article><span>02</span><h3>EDUCATION</h3><p>Master · 20XX—20XX<br />Bachelor · 20XX—20XX</p></article>
            <article><span>03</span><h3>SKILLS</h3><p>Research · Strategy<br />Figma · Adobe CC<br />Prototyping · Drawing</p></article>
          </div>
        </div>
      </section>

      <section className="works-section paper" id="masters">
        <div className="works-head"><div className="section-kicker">03 / MASTER&apos;S WORK <span>硕士期间作品</span></div><h2>Research-led<br /><em>practice.</em></h2></div>
        <ProjectTrack projects={masterProjects} label="硕士作品" onOpen={setActiveProject} />
      </section>

      <section className="works-section dark" id="bachelors">
        <div className="works-head"><div className="section-kicker light">04 / BACHELOR&apos;S WORK <span>本科期间作品</span></div><h2>Learning by<br /><em>making.</em></h2></div>
        <ProjectTrack projects={bachelorProjects} label="本科作品" onOpen={setActiveProject} />
      </section>

      <section className="works-section coral-section" id="illustration">
        <div className="works-head"><div className="section-kicker">05 / ILLUSTRATION <span>数字绘画与插画</span></div><h2>Personal<br /><em>worlds.</em></h2></div>
        <ProjectTrack projects={illustrationProjects} label="插画作品" onOpen={setActiveProject} />
      </section>

      <footer className="contact-section" id="contact">
        <div className="section-kicker light">06 / CONTACT <span>联络</span></div>
        <div className="contact-main"><p>HAVE A PROJECT IN MIND?</p><h2>Let&apos;s make<br /><em>something.</em></h2></div>
        <div className="contact-details">
          <div className="qr-placeholder"><span>WECHAT<br />QR</span></div>
          <div><small>EMAIL</small><a href="mailto:hello@example.com">HELLO@EXAMPLE.COM</a></div>
          <div><small>PHONE</small><p>+86 000 0000 0000</p></div>
          <a className="top-link" href="#home">BACK TO TOP ↑</a>
        </div>
        <p className="footer-note">© 2026 WENHUI · DESIGNED WITH INTENTION</p>
      </footer>

      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="overlay-top"><span>PORTFOLIO INDEX</span><button onClick={closeMenu}>CLOSE ×</button></div>
        <nav><a href="#about" onClick={closeMenu}><i>01</i>ABOUT</a><a href="#masters" onClick={closeMenu}><i>02</i>MASTER&apos;S WORK</a><a href="#bachelors" onClick={closeMenu}><i>03</i>BACHELOR&apos;S WORK</a><a href="#illustration" onClick={closeMenu}><i>04</i>ILLUSTRATION</a><a href="#contact" onClick={closeMenu}><i>05</i>CONTACT</a></nav>
      </div>

      {activeProject && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setActiveProject(null)}>
        <article className="project-modal" role="dialog" aria-modal="true" aria-label={`${activeProject.cn} 作品详情`} onMouseDown={e=>e.stopPropagation()}>
          <button className="modal-close" onClick={()=>setActiveProject(null)} aria-label="关闭详情">CLOSE ×</button>
          <div className={`modal-art ${activeProject.tone}`}><span>{activeProject.number}</span></div>
          <div className="modal-copy"><p>{activeProject.year} · {activeProject.type}</p><h2>{activeProject.title}</h2><h3>{activeProject.cn}</h3><p className="modal-description">这是作品详情页框架。下一阶段会在这里加入项目背景、研究过程、设计方法、成果图与反思总结。</p><div className="detail-slots"><span>01 / CONTEXT</span><span>02 / PROCESS</span><span>03 / OUTCOME</span></div></div>
        </article>
      </div>}
    </main>
  );
}
