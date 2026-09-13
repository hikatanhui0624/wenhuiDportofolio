'use client';

import { useEffect, useRef, useState } from 'react';

type Project = { number:string; title:string; cn:string; subtitle?:string; year:string; type:string; tone:string; featured?:boolean };

const masterProjects: Project[] = [
  { number:'M.01', title:'TONGYUN CONFLUENCE', cn:'通运共生—基于漕运文化的XR数字交互体验设计', subtitle:'未来博物馆 XR 交互', year:'2025—2026', type:'XR · CULTURAL HERITAGE', tone:'tongyun', featured:true },
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
    if (Math.abs(delta) > 10) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - delta;
  };
  const end = () => { drag.current.active = false; };
  const openFolder = (e:React.MouseEvent<HTMLAnchorElement>, href:string) => {
    e.preventDefault();
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior:'smooth', block:'start' });
    window.history.replaceState(null, '', href);
  };

  return (
    <div className="folder-nav">
      <p className="folder-instruction">DRAG FILES TO EXPLORE <span>↔</span></p>
      <div className="folder-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {folders.map((folder) => (
          <a className={`folder-card ${folder.tone}`} href={folder.href} key={folder.number} onClick={e=>openFolder(e, folder.href)} aria-label={`进入${folder.cn}`}>
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
  const drag = useRef({ active:false, x:0, y:0, left:0, moved:false });
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, y:e.clientY, left:track.current.scrollLeft, moved:false };
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const delta = e.clientX - drag.current.x;
    const verticalDelta = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(delta) > 12 && Math.abs(delta) > Math.abs(verticalDelta)) {
      drag.current.moved = true;
      track.current.setPointerCapture(e.pointerId);
    }
    if (!drag.current.moved) return;
    track.current.scrollLeft = drag.current.left - delta;
  };
  const end = () => {
    drag.current.active = false;
    if (drag.current.moved) window.setTimeout(() => { drag.current.moved = false; }, 0);
  };
  const openProject = (project:Project) => {
    if (drag.current.moved) return;
    onOpen(project);
  };
  const nudge = (direction:number) => track.current?.scrollBy({ left:direction * Math.min(innerWidth * .72, 720), behavior:'smooth' });

  return (
    <div className="track-wrap">
      <div className="track-tools">
        <p>DRAG TO EXPLORE <span>↔</span></p>
        <div><button onClick={()=>nudge(-1)} aria-label={`向左浏览${label}`}>←</button><button onClick={()=>nudge(1)} aria-label={`向右浏览${label}`}>→</button></div>
      </div>
      <div className="project-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {projects.map((project, index) => {
          const cardContent = <>
            <div className={`project-art ${project.tone}`}>
              {project.featured ? <img className="project-card-image" src="/projects/tongyun/hero-frame-59.png" alt="通运共生项目首页封面预览" draggable={false} /> : <><span className="art-grid" /><span className="art-orb" /></>}
              <span className="art-mark">{String(index+1).padStart(2,'0')}</span>
              <span className="view-chip">{project.featured ? 'OPEN CASE STUDY ↗' : 'VIEW PROJECT ↗'}</span>
            </div>
            <div className="project-meta"><span>{project.number}</span><h3>{project.title}<small>{project.cn}{project.subtitle && <b>{project.subtitle}</b>}</small></h3><p>{project.year}<br />{project.type}</p></div>
          </>;
          return project.featured ?
            <a className="project-card" data-project={project.number} href="#tongyun-case" key={project.number} onClick={e=>{ if (drag.current.moved) { e.preventDefault(); return; } openProject(project); }} aria-label={`查看 ${project.cn} 详情`}>{cardContent}</a> :
            <button className="project-card" data-project={project.number} key={project.number} onClick={()=>openProject(project)} aria-label={`查看 ${project.cn} 详情`}>{cardContent}</button>;
        })}
      </div>
    </div>
  );
}

const mrFlowFrames = [
  ['01','识别漕船模型'],['02','选择船体部件'],['03','完成结构拼装'],
  ['04','旋转探索漕船'],['05','进入历史叙事'],['06','选择并装载货物'],
];

const outcomeSlides = [
  ['/projects/tongyun/outcomes/outcome-01.jpg','漕船分层交互拆解'],
  ['/projects/tongyun/outcomes/outcome-02.png','货物选择与装载'],
  ['/projects/tongyun/outcomes/outcome-03.jpg','大运河路线地图'],
  ['/projects/tongyun/outcomes/outcome-04.png','杭州拱宸桥市集'],
  ['/projects/tongyun/outcomes/outcome-05.jpg','杭州 · 登船启航'],
  ['/projects/tongyun/outcomes/outcome-06.jpg','杭州 · 货物装载'],
  ['/projects/tongyun/outcomes/outcome-07.jpg','扬州 · 城市生活'],
  ['/projects/tongyun/outcomes/outcome-08.jpg','扬州 · 市集贸易'],
  ['/projects/tongyun/outcomes/outcome-09.jpg','淮安 · 水利枢纽'],
  ['/projects/tongyun/outcomes/outcome-10.jpg','通州 · 抵达京畿'],
];

function MrShowcase() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, y:0, left:0, moved:false });
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, y:e.clientY, left:track.current.scrollLeft, moved:false };
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const deltaX = e.clientX - drag.current.x;
    const deltaY = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.current.moved = true;
      track.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) track.current.scrollLeft = drag.current.left - deltaX;
  };
  const end = () => { drag.current.active = false; };
  const nudge = (direction:number) => track.current?.scrollBy({ left:direction * track.current.clientWidth, behavior:'smooth' });

  return (
    <div className="mr-showcase">
      <div className="mr-drag-tools"><span>DRAG LEFT TO EXPLORE <b>01 / 02</b></span><div><button onClick={()=>nudge(-1)} aria-label="查看上一页">←</button><button onClick={()=>nudge(1)} aria-label="查看下一页">→</button></div></div>
      <div className="mr-drag-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <figure className="mr-boat-figure mr-slide">
          <div className="mr-image-page"><img src="/projects/tongyun/mr-interaction-frame.png" alt="漕船部件拖拽拼装与三百六十度旋转交互" draggable={false} /></div>
          <figcaption>MR INTERACTION / 拖拽拼装与旋转探索</figcaption>
        </figure>
        <figure className="mr-boat-figure mr-slide">
          <div className="mr-boat-canvas" aria-label="漕船结构拆解与货舱剖层">
            <span className="mr-index">01—07</span>
            <img className="mr-parts" src="/projects/tongyun/figma/boat-parts.png" alt="船型、后船舱、后桨、桅杆、大货舱与漕工室拆解" draggable={false} />
            <img className="mr-cutaway" src="/projects/tongyun/figma/cargo-cutaway.png" alt="漕船货物与甲板分层结构" draggable={false} />
            <p><b>ASSEMBLE THE BOAT</b><span>识别结构，拖拽拼装，旋转探索</span></p>
          </div>
          <figcaption>CAO BOAT ASSEMBLY / 漕船解构与搭建</figcaption>
        </figure>
      </div>
    </div>
  );
}

function MrFlowGallery() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, y:0, left:0, moved:false });
  const [active, setActive] = useState(0);
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, y:e.clientY, left:track.current.scrollLeft, moved:false };
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const deltaX = e.clientX - drag.current.x;
    const deltaY = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.current.moved = true;
      track.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) track.current.scrollLeft = drag.current.left - deltaX;
  };
  const end = () => { drag.current.active = false; };
  const updateActive = () => {
    if (!track.current) return;
    const card = track.current.querySelector('figure');
    if (!card) return;
    const step = card.getBoundingClientRect().width + 12;
    setActive(Math.min(mrFlowFrames.length - 1, Math.max(0, Math.round(track.current.scrollLeft / step))));
  };
  const nudge = (direction:number) => {
    if (!track.current) return;
    const card = track.current.querySelector('figure');
    const step = card ? card.getBoundingClientRect().width + 12 : track.current.clientWidth * .8;
    track.current.scrollBy({ left:direction * step, behavior:'smooth' });
  };

  return (
    <div className="mr-flow-gallery">
      <div className="mr-flow-tools"><p>DRAG TO VIEW ALL SIX STEPS <span>{String(active + 1).padStart(2,'0')} / 06</span></p><div><button onClick={()=>nudge(-1)} aria-label="查看上一步">←</button><button onClick={()=>nudge(1)} aria-label="查看下一步">→</button></div></div>
      <div className="mr-flow-grid" ref={track} aria-label="MR漕船交互六步流程" tabIndex={0} onScroll={updateActive} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={e=>{ if (e.key === 'ArrowLeft') nudge(-1); if (e.key === 'ArrowRight') nudge(1); }}>
        {mrFlowFrames.map(([number,label])=><figure key={number}><img src={`/projects/tongyun/mr-flow-${number}.png`} alt={label} loading="lazy" draggable={false} /><figcaption>{number} / {label}</figcaption></figure>)}
      </div>
    </div>
  );
}

function OutcomeGallery() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, y:0, left:0, moved:false });
  const [active, setActive] = useState(0);
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, y:e.clientY, left:track.current.scrollLeft, moved:false };
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const deltaX = e.clientX - drag.current.x;
    const deltaY = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.current.moved = true;
      track.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) track.current.scrollLeft = drag.current.left - deltaX;
  };
  const end = () => { drag.current.active = false; };
  const updateActive = () => {
    if (!track.current) return;
    setActive(Math.min(outcomeSlides.length - 1, Math.max(0, Math.round(track.current.scrollLeft / track.current.clientWidth))));
  };
  const goTo = (index:number) => {
    if (!track.current) return;
    const next = Math.min(outcomeSlides.length - 1, Math.max(0, index));
    track.current.scrollTo({ left:next * track.current.clientWidth, behavior:'smooth' });
  };

  return (
    <div className="outcome-gallery">
      <div className="outcome-tools">
        <p>DRAG OR USE ARROWS <span>{String(active + 1).padStart(2,'0')} / {String(outcomeSlides.length).padStart(2,'0')}</span></p>
        <div><button onClick={()=>goTo(active - 1)} disabled={active === 0} aria-label="查看上一项设计成果">←</button><button onClick={()=>goTo(active + 1)} disabled={active === outcomeSlides.length - 1} aria-label="查看下一项设计成果">→</button></div>
      </div>
      <div className="outcome-track" ref={track} tabIndex={0} onScroll={updateActive} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={e=>{ if (e.key === 'ArrowLeft') goTo(active - 1); if (e.key === 'ArrowRight') goTo(active + 1); }}>
        {outcomeSlides.map(([src,label], index)=><figure className="outcome-slide" key={src}><div><img src={src} alt={label} loading={index === 0 ? 'eager' : 'lazy'} draggable={false} /></div><figcaption><span>{String(index + 1).padStart(2,'0')}</span>{label}</figcaption></figure>)}
      </div>
      <div className="outcome-dots" aria-label="设计成果页码">{outcomeSlides.map(([,label],index)=><button className={active === index ? 'active' : ''} onClick={()=>goTo(index)} aria-label={`查看${label}`} key={label} />)}</div>
    </div>
  );
}

function TongyunProject({ onClose }:{ onClose:()=>void }) {
  return (
    <article className="tongyun-project" role="dialog" aria-modal="true" aria-label="通运共生项目详情">
      <header className="tongyun-topbar">
        <a href="#tongyun-top" className="tongyun-brand">通运共生 <span>XR ARCHIVE</span></a>
        <nav aria-label="项目详情目录"><a href="#tongyun-overview">概览</a><a href="#tongyun-mr">MR</a><a href="#tongyun-vr">VR</a><a href="#tongyun-outcomes">成果</a></nav>
        <button onClick={onClose} aria-label="关闭项目详情">BACK TO WORKS ×</button>
      </header>

      <section className="tongyun-hero" id="tongyun-top">
        <img className="ty-hero-cover" src="/projects/tongyun/hero-frame-59.png" alt="漕运城市、桥梁与船只组成的项目封面视觉" />
        <div className="tongyun-title">
          <p>MASTER&apos;S PROJECT · 01 / 2025—2026</p>
          <h1><span>通运</span><span>共生</span></h1>
          <h2>基于漕运文化的 XR 数字交互体验设计</h2>
          <div className="tongyun-subtitle"><b>未来博物馆 XR 交互</b><span>XR INTERACTION FOR THE FUTURE MUSEUM</span></div>
        </div>
        <div className="tongyun-hero-image">
          <div className="ty-hero-canvas">
            <p className="ty-hero-note"><span>THE GRAND CANAL</span>以一艘船为线索<br />进入流动的历史</p>
          </div>
        </div>
        <div className="tongyun-route-line" aria-hidden="true"><span>杭州</span><i /><span>扬州</span><i /><span>淮安</span><i /><span>通州</span></div>
      </section>

      <section className="tongyun-overview" id="tongyun-overview">
        <div className="case-heading"><span>01</span><p>PROJECT OVERVIEW</p><h2>让漕运历史成为<br />可进入、可参与的体验。</h2></div>
        <div className="overview-copy">
          <div className="overview-text">
            <p>本设计项目以中国漕运文化为历史脉络，XR数字技术为媒介，旨在构建一个多维度的历史叙事框架，沉浸式还原漕运航行的历史场景，系统地呈现漕运在朝代更迭、航线变迁、城市兴衰、货物流通、文化交融、民生百态、经济发展及制度演进等方面的深远影响与核心历史地位。</p>
            <p>作品以漕船作为核心设计线索与叙事载体，基于历史资料研究考证，虚拟重构一条贯穿宋（杭州）、元（扬州）、明（淮安）、清（通州）等关键历史节点与枢纽城市的代表性航线。通过时间与空间的双维度移动叙事结构，动态展现漕运文化的历史纵深感与地域关联性。</p>
          </div>
          <dl><div><dt>ROLE</dt><dd>项目负责人</dd></div><div><dt>METHOD</dt><dd>历史研究 · 体验策略<br />交互原型 · 场景叙事</dd></div><div><dt>OUTPUT</dt><dd>MR 漕船交互<br />VR 漕运叙事体验</dd></div></dl>
        </div>
        <div className="overview-visuals">
          <figure className="framework-figure framework-composition">
            <div className="framework-canvas" aria-label="通运共生双线体验框架">
              <div className="framework-core"><small>CORE OBJECT</small><strong>漕船</strong><span>CAO BOAT</span></div>
              <div className="framework-branch mr"><small>MR INTERACTION</small><b>识别 · 解构 · 搭建</b><span>从船体模型进入物质系统</span></div>
              <div className="framework-branch vr"><small>VR NARRATIVE</small><b>观察 · 航行 · 对话</b><span>从空间旅程进入社会生活</span></div>
              <div className="framework-cities"><span>杭州</span><span>扬州</span><span>淮安</span><span>通州</span></div>
              <div className="framework-timeline" aria-label="宋元明清与运河空间线索">
                <small>TIME / SPACE</small>
                <span><b>宋</b><i>杭州</i></span><span><b>元</b><i>扬州</i></span><span><b>明</b><i>淮安</i></span><span><b>清</b><i>通州</i></span>
              </div>
            </div>
            <figcaption>DESIGN FRAMEWORK / 双线体验框架</figcaption>
          </figure>
          <figure className="overview-route-figure">
            <img src="/projects/tongyun/route-frame-60.png" alt="宋元明清漕运路线地图" />
            <figcaption>HISTORICAL ROUTE / 杭州—扬州—淮安—通州</figcaption>
          </figure>
        </div>
      </section>

      <section className="tongyun-mr" id="tongyun-mr">
        <div className="case-heading"><span>02</span><p>MR INTERACTION</p><h2>解构一艘船，<br />理解一套运输系统。</h2></div>
        <MrShowcase />
        <MrFlowGallery />
      </section>

      <section className="tongyun-vr" id="tongyun-vr">
        <div className="vr-intro"><p>03 / VR NARRATIVE</p><h2>从地图出发，<br />进入运河沿线的日常。</h2><p>VR 部分以第一人称旅程串联港口、桥下、市集与城门等节点。玩家通过观察、移动、对话与触发事件，在航行中理解漕运网络背后的劳动、贸易与城市生活。</p></div>
        <figure className="vr-main">
          <div className="vr-scene-canvas" aria-label="运河沿线城市与码头场景">
            <img className="vr-cover-scene" src="/projects/tongyun/hero-frame-59.png" alt="运河沿线城市、桥梁与船只场景" />
            <span>PORT · MARKET · BRIDGE · CITY GATE</span>
          </div>
          <figcaption>VR PROTOTYPE / 场景原型与叙事节点</figcaption>
        </figure>
        <figure className="vr-logic">
          <div className="vr-logic-canvas" aria-label="VR叙事逻辑与交互流程">
            <img className="vr-narrative-map" src="/projects/tongyun/vr-narrative-frame.png" alt="港口、桥下、市集与城门的VR人物交互叙事" />
            <img className="vr-route-flow" src="/projects/tongyun/vr-route-flow.png" alt="从杭州码头到城门的VR航行交互流程" />
          </div>
          <figcaption>SPATIAL STORYTELLING / 人物叙事与航行交互流程</figcaption>
        </figure>
      </section>

      <section className="tongyun-tech">
        <div className="case-heading"><span>04</span><p>TECHNICAL PATH</p><h2>从视觉语言，<br />到可运行的体验。</h2></div>
        <figure className="tech-figure tech-process-figure">
          <img src="/projects/tongyun/technical-process-frame.png" alt="从古画高清处理、三维模型、C4D与UE5开发到MR和VR头显测试的完整技术过程" loading="lazy" />
          <figcaption>VISUAL RESEARCH → C4D &amp; UE5 PRODUCTION → HEADSET TESTING</figcaption>
        </figure>
      </section>

      <section className="tongyun-outcomes" id="tongyun-outcomes">
        <div className="outcomes-title"><p>05 / SELECTED OUTCOMES</p><h2>设计成果</h2><span>十项成果 · 左右拖拽查看</span></div>
        <OutcomeGallery />
      </section>

      <details className="tongyun-boards"><summary>VIEW ORIGINAL PROCESS BOARDS <span>查看两张原始设计展板 ＋</span></summary><div><img src="/projects/tongyun/board-01.jpg" alt="通运共生原始设计展板一" loading="lazy" /><img src="/projects/tongyun/board-02.jpg" alt="通运共生原始设计展板二" loading="lazy" /></div></details>
      <footer className="tongyun-footer"><p>通运共生 / TONGYUN CONFLUENCE</p><button onClick={onClose}>BACK TO MASTER&apos;S WORK ↑</button></footer>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const closeMenu = () => setMenuOpen(false);
  const openProject = (project:Project) => {
    setActiveProject(project);
    if (project.number === 'M.01') window.history.replaceState(null, '', '#tongyun-case');
  };
  const closeProject = () => {
    setActiveProject(null);
    window.history.replaceState(null, '', '#masters');
  };
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#tongyun-case') setActiveProject(masterProjects[0]);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);
  useEffect(() => {
    if (!activeProject) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event:KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setActiveProject(null);
      if (window.location.hash === '#tongyun-case') window.history.replaceState(null, '', '#masters');
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape); };
  }, [activeProject]);

  return (
    <main>
      <section className="hero" id="home">
        <header className="topbar">
          <a className="wordmark" href="#home" aria-label="返回首页">WENHUI®</a>
          <p className="availability"><span /> AVAILABLE FOR OPPORTUNITIES</p>
          <button className="menu-pill" onClick={()=>setMenuOpen(true)}>INDEX <b>04</b></button>
        </header>
        <div className="hero-stage" aria-label="可拖动的作品集章节文件夹"><FolderNavigator /></div>
        <div className="hero-copy">
          <p className="hero-subtitle">Ideas Made Visible</p>
          <h1>
            <span className="welcome-line">Welcome to</span>
            <span className="portfolio-line">
              <em>文慧’s</em>
              <span className="collage-word" aria-label="Portfolio">
                <i>P</i><i>o</i><i>r</i><i>t</i><i>f</i><i>o</i><i>l</i><i>i</i><i>o</i>
              </span>
            </span>
          </h1>
          <p className="intro">设计 · 插画 · 视觉叙事<br />SELECTED WORK, 2022—2026</p>
        </div>
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
          <figure className="portrait-card">
            <div className="portrait-frame"><img src="/wenhui-portrait.jpg" alt="董文慧的个人照片" /></div>
            <figcaption><span>PORTRAIT / 01</span><span>PERSONAL ARCHIVE · 2026</span></figcaption>
          </figure>
          <div className="about-copy">
            <p className="eyebrow">PROFILE / 个人信息</p>
            <div className="name-lockup"><span>董文慧</span><b>WENHUI DONG</b></div>
            <h2>I turn <em>research</em><br />into visible<br />experiences.</h2>
            <p>艺术与科技、国际设计战略双学位硕士在读。以设计研究为起点，在视觉语言、服务系统与交互体验之间工作，关注文化遗产、公共服务与日常生活中的真实议题。</p>
            <div className="profile-tags" aria-label="主要设计领域"><span>VISUAL DESIGN</span><span>SERVICE DESIGN</span><span>UX &amp; INTERACTION</span></div>
          </div>
          <div className="info-stack">
            <article><span>01</span><h3>DESIGN FIELDS <small>主设计领域</small></h3><p>视觉设计 · 服务设计<br />用户体验与交互设计<br />文化遗产数字体验</p></article>
            <article><span>02</span><h3>EDUCATION <small>教育背景</small></h3><p><b>2024—至今</b> 中国美术学院<br />艺术与科技 · 硕士<br /><b>2025—至今</b> 南特大西洋设计学院<br />国际设计战略 · 硕士<br /><b>2020—2024</b> 南京林业大学<br />视觉传达设计 · 学士</p></article>
            <article><span>03</span><h3>SKILLS <small>个人技能</small></h3><p>用户研究 · 信息架构 · 系统思维<br />Figma · Adobe CC · Miro<br />Procreate · AI 数字工具</p></article>
          </div>
        </div>
        <div className="about-contact" aria-label="联系方式">
          <div><small>BASE / 居住地</small><address>Hangzhou, China<br />中国 · 杭州</address></div>
          <div><small>PHONE / 电话</small><a href="tel:+8615162153449">+86 151 6215 3449</a></div>
          <div><small>EMAIL / 邮箱</small><a href="mailto:hikatanhui0624@gmail.com">hikatanhui0624@gmail.com</a></div>
          <div><small>LANGUAGE / 语言</small><p>中文 · ENGLISH</p></div>
          <span className="contact-stamp">OPEN TO<br />COLLABORATE</span>
        </div>
      </section>

      <section className="works-section paper" id="masters">
        <div className="works-head"><div className="section-kicker">03 / MASTER&apos;S WORK <span>硕士期间作品</span></div><h2>Research-led<br /><em>practice.</em></h2></div>
        <ProjectTrack projects={masterProjects} label="硕士作品" onOpen={openProject} />
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
          <div><small>EMAIL</small><a href="mailto:hikatanhui0624@gmail.com">HIKATANHUI0624@GMAIL.COM</a></div>
          <div><small>PHONE</small><p>+86 151 6215 3449</p></div>
          <a className="top-link" href="#home">BACK TO TOP ↑</a>
        </div>
        <p className="footer-note">© 2026 WENHUI · DESIGNED WITH INTENTION</p>
      </footer>

      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="overlay-top"><span>PORTFOLIO INDEX</span><button onClick={closeMenu}>CLOSE ×</button></div>
        <nav><a href="#about" onClick={closeMenu}><i>01</i>ABOUT</a><a href="#masters" onClick={closeMenu}><i>02</i>MASTER&apos;S WORK</a><a href="#bachelors" onClick={closeMenu}><i>03</i>BACHELOR&apos;S WORK</a><a href="#illustration" onClick={closeMenu}><i>04</i>ILLUSTRATION</a><a href="#contact" onClick={closeMenu}><i>05</i>CONTACT</a></nav>
      </div>

      {activeProject?.number === 'M.01' && <div className="tongyun-overlay"><TongyunProject onClose={closeProject} /></div>}

      {activeProject && activeProject.number !== 'M.01' && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setActiveProject(null)}>
        <article className="project-modal" role="dialog" aria-modal="true" aria-label={`${activeProject.cn} 作品详情`} onMouseDown={e=>e.stopPropagation()}>
          <button className="modal-close" onClick={()=>setActiveProject(null)} aria-label="关闭详情">CLOSE ×</button>
          <div className={`modal-art ${activeProject.tone}`}><span>{activeProject.number}</span></div>
          <div className="modal-copy"><p>{activeProject.year} · {activeProject.type}</p><h2>{activeProject.title}</h2><h3>{activeProject.cn}</h3><p className="modal-description">这是作品详情页框架。下一阶段会在这里加入项目背景、研究过程、设计方法、成果图与反思总结。</p><div className="detail-slots"><span>01 / CONTEXT</span><span>02 / PROCESS</span><span>03 / OUTCOME</span></div></div>
        </article>
      </div>}
    </main>
  );
}
