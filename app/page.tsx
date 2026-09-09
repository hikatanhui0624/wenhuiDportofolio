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
              {project.featured ? <img className="project-card-image" src="/projects/tongyun/result-03.jpg" alt="通运共生MR漕船交互预览" draggable={false} /> : <><span className="art-grid" /><span className="art-orb" /></>}
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

function TongyunProject({ onClose }:{ onClose:()=>void }) {
  return (
    <article className="tongyun-project" role="dialog" aria-modal="true" aria-label="通运共生项目详情">
      <header className="tongyun-topbar">
        <a href="#tongyun-top" className="tongyun-brand">通运共生 <span>XR ARCHIVE</span></a>
        <nav aria-label="项目详情目录"><a href="#tongyun-overview">概览</a><a href="#tongyun-mr">MR</a><a href="#tongyun-vr">VR</a><a href="#tongyun-outcomes">成果</a></nav>
        <button onClick={onClose} aria-label="关闭项目详情">BACK TO WORKS ×</button>
      </header>

      <section className="tongyun-hero" id="tongyun-top">
        <div className="tongyun-title">
          <p>MASTER&apos;S PROJECT · 01 / 2025—2026</p>
          <h1><span>通运</span><span>共生</span></h1>
          <h2>基于漕运文化的 XR 数字交互体验设计</h2>
          <div className="tongyun-subtitle"><b>未来博物馆 XR 交互</b><span>XR INTERACTION FOR THE FUTURE MUSEUM</span></div>
        </div>
        <div className="tongyun-hero-image"><img src="/projects/tongyun/board-01.jpg" alt="通运共生项目设计展板局部" /></div>
        <div className="tongyun-route-line" aria-hidden="true"><span>杭州</span><i /><span>扬州</span><i /><span>淮安</span><i /><span>通州</span></div>
      </section>

      <section className="tongyun-overview" id="tongyun-overview">
        <div className="case-heading"><span>01</span><p>PROJECT OVERVIEW</p><h2>让漕运历史成为<br />可进入、可参与的体验。</h2></div>
        <div className="overview-copy">
          <p>项目以中国漕运文化为历史脉络，以 XR 技术为媒介，构建兼具时间纵深与地域关联的沉浸式历史叙事。漕船既是核心交互载体，也是串联城市兴衰、货物流通、文化交融与民生百态的叙事线索。</p>
          <dl><div><dt>ROLE</dt><dd>项目负责人</dd></div><div><dt>METHOD</dt><dd>历史研究 · 体验策略<br />交互原型 · 场景叙事</dd></div><div><dt>OUTPUT</dt><dd>MR 漕船交互<br />VR 漕运叙事体验</dd></div></dl>
        </div>
        <figure className="framework-figure"><img src="/projects/tongyun/framework.jpg" alt="通运共生主题背景与设计框架" /><figcaption>DESIGN FRAMEWORK / 双线体验框架</figcaption></figure>
      </section>

      <section className="tongyun-route">
        <div className="route-copy"><p>02 / HISTORICAL ROUTE</p><h2>一艘漕船，<br />四段时空。</h2><p>依据历史资料与城市特征，将宋、元、明、清四个阶段落在杭州、扬州、淮安与通州。玩家沿模拟航线前进，在空间移动中理解漕运制度、城市功能与生活场景的变化。</p>
          <ol><li><b>宋</b><span>杭州</span><small>装载启航</small></li><li><b>元</b><span>扬州</span><small>货物流通</small></li><li><b>明</b><span>淮安</span><small>水利枢纽</small></li><li><b>清</b><span>通州</span><small>抵达京畿</small></li></ol>
        </div>
        <figure><img src="/projects/tongyun/route-map.jpg" alt="杭州、扬州、淮安、通州漕运路线图" /><figcaption>ROUTE MAP / 杭州—扬州—淮安—通州</figcaption></figure>
      </section>

      <section className="tongyun-mr" id="tongyun-mr">
        <div className="case-heading"><span>03</span><p>MR INTERACTION</p><h2>解构一艘船，<br />理解一套运输系统。</h2></div>
        <figure className="mr-boat-figure"><img src="/projects/tongyun/mr-boat.jpg" alt="漕船结构拆解、搭建与交互细节" /><figcaption>CAO BOAT ASSEMBLY / 漕船解构与搭建</figcaption></figure>
        <div className="process-steps"><article><b>01</b><h3>识别模型</h3><p>扫描漕船实体，建立现实模型与数字内容的定位关系。</p></article><article><b>02</b><h3>拆解搭建</h3><p>依次认识船舱、桅杆、船型与漕工室，并完成结构拼装。</p></article><article><b>03</b><h3>滑动探索</h3><p>围绕船体进行 360° 旋转，从不同视角查看细节。</p></article><article><b>04</b><h3>装载启航</h3><p>选择漕粮、瓷器、丝绸、茶、铜钱、盐与建材，理解运载逻辑。</p></article></div>
      </section>

      <section className="tongyun-vr" id="tongyun-vr">
        <div className="vr-intro"><p>04 / VR NARRATIVE</p><h2>从地图出发，<br />进入运河沿线的日常。</h2><p>VR 部分以第一人称旅程串联港口、桥下、市集与城门等节点。玩家通过观察、移动、对话与触发事件，在航行中理解漕运网络背后的劳动、贸易与城市生活。</p></div>
        <figure className="vr-main"><img src="/projects/tongyun/vr-prototype.jpg" alt="通运共生VR原型界面与漕运场景" /><figcaption>VR PROTOTYPE / 场景原型与叙事节点</figcaption></figure>
        <figure className="vr-logic"><img src="/projects/tongyun/vr-logic.jpg" alt="通运共生VR场景视觉逻辑" /><figcaption>SPATIAL STORYTELLING / 空间叙事</figcaption></figure>
        <div className="vr-sequence"><span>查看航线</span><i>→</i><span>选择起点</span><i>→</i><span>登船启航</span><i>→</i><span>触发人物与事件</span><i>→</i><span>抵达城市节点</span></div>
      </section>

      <section className="tongyun-tech">
        <div className="case-heading"><span>05</span><p>TECHNICAL PATH</p><h2>从视觉语言，<br />到可运行的体验。</h2></div>
        <figure><img src="/projects/tongyun/tech-path.jpg" alt="视觉风格、模型贴图、动画、蓝图与头显测试技术路径" /><figcaption>VISUAL ITERATION → 3D &amp; ANIMATION → UE BLUEPRINT &amp; TESTING</figcaption></figure>
        <div className="tech-list"><p><b>01</b>古画资料研究与视觉风格迭代</p><p><b>02</b>C4D / UE5 模型、贴图与动画制作</p><p><b>03</b>蓝图交互编写与 HTC 头显串流测试</p></div>
      </section>

      <section className="tongyun-outcomes" id="tongyun-outcomes">
        <div className="outcomes-title"><p>06 / SELECTED OUTCOMES</p><h2>设计成果</h2><span>完整图像展示 · FULL IMAGE</span></div>
        <figure><img src="/projects/tongyun/result-01.jpg" alt="通运共生扬州、淮安与通州场景成果" loading="lazy" /><figcaption>01 / 沿线城市场景与交互节点</figcaption></figure>
        <figure><img src="/projects/tongyun/result-02.jpg" alt="通运共生登船、货物装载与杭州场景成果" loading="lazy" /><figcaption>02 / 登船、装载与杭州码头体验</figcaption></figure>
        <figure><img src="/projects/tongyun/result-03.jpg" alt="通运共生漕船MR交互与大运河地图成果" loading="lazy" /><figcaption>03 / MR 漕船搭建、货物装载与路线地图</figcaption></figure>
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
