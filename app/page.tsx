'use client';

import { useEffect, useRef, useState } from 'react';

type Project = { number:string; title:string; cn:string; subtitle?:string; year:string; type:string; tone:string; caseStudy?:'tongyun'|'longmen'|'petals'; cover?:string; coverAlt?:string };

const masterProjects: Project[] = [
  { number:'M.01', title:'TONGYUN CONFLUENCE', cn:'通运共生—基于漕运文化的XR数字交互体验设计', subtitle:'未来博物馆 XR 交互', year:'2025—2026', type:'XR · CULTURAL HERITAGE', tone:'tongyun', caseStudy:'tongyun', cover:'/projects/tongyun/hero-frame-59.png', coverAlt:'通运共生项目首页封面预览' },
  { number:'M.02', title:'LONGMEN TRIBUTE', cn:'LonGO Live—龙门古镇文化体验积分系统', subtitle:'文化体验 · 数字积分 · 社区共创', year:'2025', type:'SERVICE · DIGITAL PLATFORM', tone:'acid', caseStudy:'longmen', cover:'/projects/longmen/visual/poster-gluten.jpg', coverAlt:'龙门古镇非遗美食体验视觉海报' },
  { number:'M.03', title:'FADING PETALS WITH CHAINS', cn:'赏花勿审花—关于女性隐形社会伤害下容貌焦虑的交互视觉探索', subtitle:'动态海报 · 面部识别交互', year:'2025', type:'INTERACTION · VISUAL INSTALLATION', tone:'petals', caseStudy:'petals', cover:'/projects/petals/revision/cover-a4.png', coverAlt:'赏花勿审花三组关系视觉融合预览' },
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
  { number:'04', title:'ANIME IP / MERCH', cn:'二次元IP / 衍生品设计', note:'CHARACTER · IP · MERCHANDISE', href:'#anime-ip', image:'/folder-illustration-objects.png', tone:'folder-lilac' },
];

function FolderNavigator() {
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
  const end = () => {
    drag.current.active = false;
    if (drag.current.moved) window.setTimeout(() => { drag.current.moved = false; }, 0);
  };
  const openFolder = (e:React.MouseEvent<HTMLAnchorElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  return (
    <div className="folder-nav">
      <p className="folder-instruction">DRAG FILES TO EXPLORE <span>↔</span></p>
      <div className="folder-track" ref={track} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {folders.map((folder) => (
          <a className={`folder-card ${folder.tone}`} href={folder.href} key={folder.number} onClick={openFolder} aria-label={`进入${folder.cn}`}>
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
              {project.cover ? <img className="project-card-image" src={project.cover} alt={project.coverAlt || ''} draggable={false} /> : <><span className="art-grid" /><span className="art-orb" /></>}
              <span className="art-mark">{String(index+1).padStart(2,'0')}</span>
              <span className="view-chip">{project.caseStudy ? 'OPEN CASE STUDY ↗' : 'VIEW PROJECT ↗'}</span>
            </div>
            <div className="project-meta"><span>{project.number}</span><h3>{project.title}<small>{project.cn}{project.subtitle && <b>{project.subtitle}</b>}</small></h3><p>{project.year}<br />{project.type}</p></div>
          </>;
          return project.caseStudy ?
            <a className="project-card" data-project={project.number} href={`#${project.caseStudy}-case`} key={project.number} onClick={e=>{ e.preventDefault(); if (drag.current.moved) return; openProject(project); }} aria-label={`查看 ${project.cn} 详情`}>{cardContent}</a> :
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

const longmenStoryboard = [
  ['/projects/longmen/storyboard/01.jpg','临时计划 / 临时行程让游客缺乏充分准备'],
  ['/projects/longmen/storyboard/02.jpg','到访提醒 / 预算与朋友邀约触发出行决定'],
  ['/projects/longmen/storyboard/03.jpg','线上购票 / 数字入口降低临时决策成本'],
  ['/projects/longmen/storyboard/04.jpg','扫码入场 / QR 门票连接现场文化体验'],
  ['/projects/longmen/storyboard/05.jpg','工坊协作 / 与本地传承人共同制作美食'],
  ['/projects/longmen/storyboard/06.jpg','积分获得 / 完成非遗体验后累积文化积分'],
  ['/projects/longmen/storyboard/07.jpg','在地消费 / 使用积分支持本地特色产品'],
  ['/projects/longmen/storyboard/08.jpg','积分支付 / 兑换流程得到即时确认'],
  ['/projects/longmen/storyboard/09.jpg','文化回流 / 积分转化为社区公益支持'],
  ['/projects/longmen/storyboard/10.jpg','共享体验 / 一起品尝并留下文化记忆'],
] as const;

const longmenServiceViews = [
  ['/projects/longmen/slides/solution.jpg','FINAL SOLUTION / 三层协同方案'],
  ['/projects/longmen/slides/journey.jpg','PERSONA & JOURNEY MAP / 从计划到离开的体验旅程'],
  ['/projects/longmen/slides/validation.jpg','FIELD VALIDATION / 9 个触点的积分流动测试'],
] as const;

const longmenPostcards = [
  ['/projects/longmen/visual/postcard-taste.jpg','POSTER CARD 01 / TABLE & TASTE / 龙门传统风味明信片'],
  ['/projects/longmen/visual/postcard-gluten.jpg','POSTER CARD 02 / LONGMEN GLUTEN / 龙门面筋明信片'],
  ['/projects/longmen/visual/postcard-rice.jpg','POSTER CARD 03 / RICE WINE & BEAN CURD / 酒酿与豆腐主题明信片'],
  ['/projects/longmen/visual/postcard-sanbao.jpg','POSTER CARD 04 / FUCHUN SANBAO / 腐乳三宝明信片'],
] as const;

const longmenPosters = [
  ['/projects/longmen/visual/poster-gluten.jpg','POSTER 01 / LONGMEN GLUTEN / 龙门面筋主题海报'],
  ['/projects/longmen/visual/poster-sanbao.jpg','POSTER 02 / FUCHUN SANBAO / 腐乳三宝主题海报'],
] as const;

const longmenFoldings = [
  ['/projects/longmen/visual/folding-front.jpg','FOLDING GUIDE 01 / COVER & VISUAL SYSTEM / 折页正面与品牌封套'],
  ['/projects/longmen/visual/folding-back.jpg','FOLDING GUIDE 02 / WORKSHOP EXPERIENCE / 非遗工坊四步体验指南'],
] as const;

function LongmenGallery({ items, label }:{ items:readonly (readonly [string,string])[]; label:string }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active:false, x:0, y:0, left:0, moved:false });
  const [active, setActive] = useState(0);
  const start = (e:React.PointerEvent) => {
    if (!track.current) return;
    drag.current = { active:true, x:e.clientX, y:e.clientY, left:track.current.scrollLeft, moved:false };
  };
  const move = (e:React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      drag.current.moved = true;
      track.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) track.current.scrollLeft = drag.current.left - dx;
  };
  const goTo = (index:number) => {
    if (!track.current) return;
    const next = Math.max(0, Math.min(items.length - 1, index));
    track.current.scrollTo({ left:next * track.current.clientWidth, behavior:'smooth' });
  };
  return (
    <div className="lm-gallery">
      <div className="lm-gallery-tools"><p>DRAG TO EXPLORE · {label.toUpperCase()} <span>{String(active + 1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span></p><div><button onClick={()=>goTo(active - 1)} disabled={active === 0} aria-label={`查看上一项${label}`}>←</button><button onClick={()=>goTo(active + 1)} disabled={active === items.length - 1} aria-label={`查看下一项${label}`}>→</button></div></div>
      <div className="lm-gallery-track" ref={track} tabIndex={0} onScroll={()=>track.current && setActive(Math.max(0,Math.min(items.length - 1,Math.round(track.current.scrollLeft / track.current.clientWidth))))} onPointerDown={start} onPointerMove={move} onPointerUp={()=>drag.current.active=false} onPointerCancel={()=>drag.current.active=false} onKeyDown={e=>{ if (e.key === 'ArrowLeft') goTo(active - 1); if (e.key === 'ArrowRight') goTo(active + 1); }}>
        {items.map(([src,title],index)=><figure key={src}><div><img src={src} alt={title} loading={index === 0 ? 'eager' : 'lazy'} draggable={false} /></div><figcaption><span>{String(index + 1).padStart(2,'0')}</span>{title}</figcaption></figure>)}
      </div>
      <div className="lm-gallery-dots">{items.map(([,title],index)=><button key={title} className={active === index ? 'active' : ''} onClick={()=>goTo(index)} aria-label={`查看${title}`} />)}</div>
    </div>
  );
}

function LongmenServiceSwitcher() {
  const [active, setActive] = useState(0);
  const [activeSrc, activeTitle] = longmenServiceViews[active];

  return (
    <div className="lm-service-switcher">
      <figure className="lm-service-main" key={activeSrc}>
        <img src={activeSrc} alt={activeTitle} loading="lazy" />
        <figcaption><span>{String(active + 1).padStart(2,'0')}</span>{activeTitle}</figcaption>
      </figure>
      <div className="lm-service-previews" aria-label="方案图预览">
        {longmenServiceViews.map(([src,title],index)=>index !== active && (
          <button type="button" key={src} onClick={()=>setActive(index)} aria-label={`放大查看${title}`}>
            <img src={src} alt="" loading="lazy" />
            <span>{String(index + 1).padStart(2,'0')} / {title} · CLICK TO VIEW ↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const platformNotes = {
  discover: ['搜索与分类入口', '热门景点推荐', '文化体验预约', '本地餐饮与季节活动'],
  home: ['快捷功能入口', '行程日期预约', '入场二维码', '积分商城与成就'],
  alerts: ['预约提醒与确认', '工坊排队进度', '积分增减记录', '全部通知集中管理'],
  map: ['古镇地图与地标', '附近场所推荐', '路线与距离信息'],
  profile: ['身份与文化徽章', '积分及兑换记录', '近期预约管理', '个人设置与支持'],
} as const;

function LongmenFeatureNotes({ title, eyebrow, notes }:{ title:string; eyebrow:string; notes:readonly string[] }) {
  return (
    <div className="lm-platform-notes">
      <p>{eyebrow}</p>
      <h4>{title}</h4>
      <ul>{notes.map(note=><li key={note}>{note}</li>)}</ul>
    </div>
  );
}

function LongmenScrollScreen({ src, alt, label }:{ src:string; alt:string; label:string }) {
  return (
    <div className="lm-scroll-screen" tabIndex={0} aria-label={`${label}，可上下滚动查看`}>
      <div className="lm-scroll-hint"><span>SCROLL</span><i>↓</i></div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function LongmenPlatformShowcase() {
  return (
    <div className="lm-platform-showcase">
      <article className="lm-platform-case lm-platform-discover">
        <header><span>01</span><p>DISCOVER</p><h3>从发现兴趣，<br />到预约一次文化体验。</h3></header>
        <div className="lm-platform-feature-grid">
          <section className="lm-feature lm-feature-discover">
            <LongmenFeatureNotes title="Discover" eyebrow="SEARCH · FILTER · BOOK" notes={platformNotes.discover} />
            <div className="lm-phone-mockup lm-phone-mockup-rendered" aria-label="Discover 手机样机">
              <img src="/projects/longmen/product-detail/discover-mockup.png" alt="LonGO Live Discover 页面手机样机" loading="lazy" />
            </div>
          </section>
          <section className="lm-feature lm-feature-home-scroll">
            <LongmenFeatureNotes title="Discover Full Page" eyebrow="P3 · COMPLETE VIEW" notes={platformNotes.discover} />
            <LongmenScrollScreen src="/projects/longmen/product-detail/discover-phone.png" alt="LonGO Live Discover 完整长页面" label="Discover 完整长页面" />
          </section>
        </div>
      </article>

      <article className="lm-platform-case lm-platform-alerts-map">
        <header><span>02</span><p>ALERTS + MAPS</p><h3>把现场中的提醒，<br />连接到真实地点。</h3></header>
        <div className="lm-platform-duo-grid">
          <section className="lm-feature lm-feature-alerts-static">
            <LongmenFeatureNotes title="Alerts" eyebrow="REMIND · UPDATE · RECORD" notes={platformNotes.alerts} />
            <LongmenScrollScreen src="/projects/longmen/product-detail/alerts-annotated.png" alt="LonGO Live Alerts 通知与预约提醒长页面" label="Alerts 长页面" />
          </section>
          <section className="lm-feature">
            <LongmenFeatureNotes title="Maps" eyebrow="LOCATE · NAVIGATE · NEARBY" notes={platformNotes.map} />
            <LongmenScrollScreen src="/projects/longmen/product-detail/maps-annotated.png" alt="LonGO Live 古镇地图与附近推荐长页面" label="Maps 长页面" />
          </section>
        </div>
      </article>

      <article className="lm-platform-case lm-platform-home-profile">
        <header><span>03</span><p>HOME + PROFILE</p><h3>在一个持续累积的账户里，<br />看见参与留下的价值。</h3></header>
        <div className="lm-platform-duo-grid">
          <section className="lm-feature">
            <LongmenFeatureNotes title="Home" eyebrow="BOOK · PASS · REWARD" notes={platformNotes.home} />
            <LongmenScrollScreen src="/projects/longmen/product-detail/home-annotated.png" alt="LonGO Live Home 完整长页面及功能标注" label="Home 完整长页面" />
          </section>
          <section className="lm-feature">
            <LongmenFeatureNotes title="Profile" eyebrow="IDENTITY · POINTS · HISTORY" notes={platformNotes.profile} />
            <LongmenScrollScreen src="/projects/longmen/product-detail/profile-annotated.png" alt="LonGO Live Profile 完整长页面及功能标注" label="Profile 完整长页面" />
          </section>
        </div>
      </article>
    </div>
  );
}

const petalsMetaphors = [
  { key:'rose', index:'01', flower:'Rose / 玫瑰', word:'刺', context:'亲密关系', title:'爱意里的刺', copy:'亲密关系中的评价、比较与审美期待，会以“为你好”的方式进入身体经验。', scene:'/projects/petals/revision/context-intimacy.png', photo:'/projects/petals/revision/photo-rose.jpg', model:'/projects/petals/figma/rose-model.png', transform:'亲密关系 → 隐喻玫瑰 → 缠绕与刺' },
  { key:'lily', index:'02', flower:'Lily / 百合', word:'框', context:'职场环境', title:'规则后的框', copy:'职业形象、年龄与性别气质被写进隐形规则，外貌逐渐成为一项额外劳动。', scene:'/projects/petals/revision/context-workplace.png', photo:'/projects/petals/revision/photo-lily.jpg', model:'/projects/petals/figma/lily-model.png', transform:'职场环境 → 隐喻百合 → 规训与框定' },
  { key:'daisy', index:'03', flower:'Daisy / 雏菊', word:'眼', context:'同辈关系', title:'周围人的眼', copy:'同伴目光与社交媒体的持续观看，让比较被内化为随时发生的自我审查。', scene:'/projects/petals/revision/context-peers.png', photo:'/projects/petals/revision/photo-daisy.jpg', model:'/projects/petals/figma/daisy-model.png', transform:'同辈关系 → 隐喻雏菊 → 目光与比较' },
];

const petalsDevelopment = [
  { key:'rose', label:'ROSE / INTIMACY', title:'把“刺”变成缠绕的结构', sketch:'/projects/petals/figma/rose-sketch.png', model:'/projects/petals/revision/model-rose.png' },
  { key:'lily', label:'LILY / WORKPLACE', title:'把“框”变成受限的生长', sketch:'/projects/petals/figma/lily-sketch.png', model:'/projects/petals/revision/model-lily.png' },
  { key:'daisy', label:'DAISY / PEERS', title:'把“眼”变成聚集的凝视', sketch:'/projects/petals/figma/daisy-sketch.png', model:'/projects/petals/revision/model-daisy.png' },
];

function PetalsProject({ onClose }:{ onClose:()=>void }) {
  return (
    <article className="petals-project" role="dialog" aria-modal="true" aria-label="赏花勿审花项目详情">
      <header className="petals-topbar">
        <a href="#petals-top" className="petals-brand">赏花勿审花 <span>FADING PETALS</span></a>
        <nav aria-label="项目详情目录"><a href="#petals-overview">概览</a><a href="#petals-language">视觉</a><a href="#petals-system">交互</a><a href="#petals-posters">动态海报</a><a href="#petals-exhibition">现场</a></nav>
        <button onClick={onClose} aria-label="关闭项目详情">BACK TO WORKS ×</button>
      </header>

      <section className="petals-hero" id="petals-top">
        <div className="petals-hero-copy">
          <p>MASTER&apos;S PROJECT · 03 / 2025</p>
          <h1>Fading petals<br />with chains.</h1>
          <h2>赏花勿审花</h2>
          <p className="petals-hero-subtitle">关于女性隐形社会伤害下<br />容貌焦虑的交互视觉探索</p>
          <div className="petals-hero-tags"><span>GENERATIVE VISUAL</span><span>FACE TRACKING</span><span>INTERACTIVE INSTALLATION</span></div>
        </div>
        <div className="petals-hero-visual" aria-label="三组关系压力融合生成的视觉图像">
          <span className="petals-orbit orbit-one" /><span className="petals-orbit orbit-two" /><span className="petals-orbit orbit-three" />
          <span className="petals-particle particle-red" /><span className="petals-particle particle-lime" /><span className="petals-particle particle-blue" />
          <img className="petals-hero-output" src="/projects/petals/revision/cover-a4.png" alt="红黄蓝三组关系视觉融合后的粒子图像" />
          <div className="petals-axis"><span>INTIMACY</span><span>WORKPLACE</span><span>PEERS</span></div>
        </div>
        <p className="petals-scroll-note">SCROLL TO UNFOLD THE INVISIBLE PRESSURE ↓</p>
      </section>

      <section className="petals-section petals-overview" id="petals-overview">
        <div className="petals-heading"><span>01</span><p>PROJECT OVERVIEW</p><h2>把无形的凝视，<br />转译成可见的花。</h2></div>
        <div className="petals-overview-grid">
          <div className="petals-overview-copy"><p>项目以“花”作为女性外貌评价的隐喻：花被欣赏，也被分类、修剪与审视。设计从亲密关系、职场环境与同辈关系三类社会场景出发，把难以指认的言语、标准与凝视转化为可感知的视觉形变。</p><p>观众的脸成为交互入口。镜头捕捉眨眼与微笑等表情，实时驱动花朵粒子聚合、扭曲与消散，让观看者同时成为“被看见的人”和“观看的人”。</p></div>
          <dl><div><dt>ROLE</dt><dd>视觉设计 · 交互设计<br />动态影像制作</dd></div><div><dt>TOOLS</dt><dd>TouchDesigner · MediaPipe<br />AI Image Generation</dd></div><div><dt>OUTPUT</dt><dd>三组动态海报 · 实时交互<br />视觉装置 · 展览呈现</dd></div></dl>
        </div>
        <div className="petals-question"><small>CORE QUESTION / 核心问题</small><p>当审美标准被包装成关心、规则与玩笑，<br />我们如何看见它留下的伤害？</p></div>
      </section>

      <section className="petals-section petals-metaphor" id="petals-research">
        <div className="petals-heading light"><span>02</span><p>RESEARCH &amp; METAPHOR</p><h2>三种关系，<br />三种隐形压力。</h2></div>
        <div className="petals-metaphor-grid">
          {petalsMetaphors.map((item)=><article className={`petals-metaphor-card ${item.key}`} key={item.key}>
            <header><span>{item.index}</span><p>{item.flower}</p><b>{item.context}</b></header>
            <div className="petals-metaphor-pipeline">
              <figure><img src={item.scene} alt={`${item.context}真实黑白场景`} loading="lazy" /><figcaption>RELATION / 关系场景</figcaption></figure>
              <i aria-hidden="true">→</i>
              <figure><img src={item.photo} alt={`${item.flower}真实花卉照片`} loading="lazy" /><figcaption>METAPHOR / 花的隐喻</figcaption></figure>
              <i aria-hidden="true">→</i>
              <figure><img src={item.model} alt={`${item.flower}生成视觉模型`} loading="lazy" /><figcaption>MODEL / 视觉转译</figcaption></figure>
            </div>
            <p className="petals-transform-line">{item.transform}</p>
            <div className="petals-metaphor-copy"><small>{item.word}</small><h3>{item.title}</h3><p>{item.copy}</p></div>
          </article>)}
        </div>
        <p className="petals-photo-credit">REAL FLOWER REFERENCES / Rose: Jon Sullivan · Public Domain　 Lily: THE GOKUL · CC0　 Daisy: Wilfredor · CC0</p>
      </section>

      <section className="petals-section petals-language" id="petals-language">
        <div className="petals-heading"><span>03</span><p>VISUAL DEVELOPMENT</p><h2>从花的轮廓，<br />长出情绪的结构。</h2></div>
        <div className="petals-development">
          {petalsDevelopment.map((item,index)=><article className={`petals-development-row ${item.key}`} key={item.key}>
            <div className="petals-development-copy"><span>{String(index+1).padStart(2,'0')}</span><p>{item.label}</p><h3>{item.title}</h3><small>SHAPE STUDY → GENERATED MATERIAL → 3D COMPOSITION</small></div>
            <figure><img src={item.sketch} alt={`${item.label}形态草图`} loading="lazy" /><figcaption>FORM / 形态提取</figcaption></figure>
            <i aria-hidden="true">→</i>
            <figure><img src={item.model} alt={`${item.label}生成花束模型`} loading="lazy" /><figcaption>MODEL / 生成与重组</figcaption></figure>
          </article>)}
        </div>
      </section>

      <section className="petals-section petals-system" id="petals-system">
        <div className="petals-heading light"><span>04</span><p>INTERACTION SYSTEM</p><h2>表情成为输入，<br />花的状态成为反馈。</h2></div>
        <div className="petals-system-grid" id="petals-system-grid">
          <figure><div className="petals-system-number">01</div><img src="/projects/petals/revision/system-touchdesigner.png" alt="TouchDesigner 粒子系统节点与三组花朵视觉输出" loading="lazy" /><figcaption><b>TOUCHDESIGNER / 粒子视觉系统</b><span>建立玫瑰、百合与雏菊三套生成材质，并统一接入实时粒子反馈。</span></figcaption></figure>
          <figure><div className="petals-system-number">02</div><img src="/projects/petals/revision/system-face-channels.png" alt="MediaPipe 面部通道选择与数值范围" loading="lazy" /><figcaption><b>MEDIAPIPE / 面部通道映射</b><span>从眉部、眨眼、眯眼、张嘴与微笑通道提取数值，映射到视觉状态。</span></figcaption></figure>
          <figure><div className="petals-system-number">03</div><img src="/projects/petals/revision/system-interaction-flow.png" alt="摄像头采集观众面部数据并切换屏幕视觉的交互流程" loading="lazy" /><figcaption><b>INTERACTION LOGIC / 观众—镜头—屏幕</b><span>摄像头采集单张人脸，眨眼与微笑触发切换，显示屏同步生成对应反馈。</span></figcaption></figure>
        </div>
        <div className="petals-steps" aria-label="交互步骤"><span><b>01</b>镜头捕捉人脸</span><i>→</i><span><b>02</b>识别眨眼与微笑</span><i>→</i><span><b>03</b>切换花朵状态</span><i>→</i><span><b>04</b>实时生成视觉反馈</span></div>
      </section>

      <section className="petals-section petals-posters" id="petals-posters">
        <div className="petals-heading light"><span>05</span><p>DYNAMIC POSTERS</p><h2 className="petals-heading-single">持续发生的凝视</h2></div>
        <div className="petals-poster-grid">
          <figure className="rose"><video autoPlay muted loop playsInline controls preload="metadata" poster="/projects/petals/video/rose-poster.jpg" aria-label="玫瑰主题动态海报"><source src="/projects/petals/video/rose.mp4" type="video/mp4" /></video><figcaption><span>01 / ROSE</span>亲密关系中的刺</figcaption></figure>
          <figure className="lily"><video autoPlay muted loop playsInline controls preload="metadata" poster="/projects/petals/video/lily-poster.jpg" aria-label="百合主题动态海报"><source src="/projects/petals/video/lily.mp4" type="video/mp4" /></video><figcaption><span>02 / LILY</span>职场规则后的框</figcaption></figure>
          <figure className="daisy"><video autoPlay muted loop playsInline controls preload="metadata" poster="/projects/petals/video/daisy-poster.jpg" aria-label="雏菊主题动态海报"><source src="/projects/petals/video/daisy.mp4" type="video/mp4" /></video><figcaption><span>03 / DAISY</span>同辈关系之间的眼</figcaption></figure>
        </div>
      </section>

      <section className="petals-section petals-results" id="petals-results">
        <div className="petals-heading light"><span>06</span><p>INTERACTIVE VISUAL OUTPUT</p><h2 className="petals-heading-single">被关系改写的脸</h2></div>
        <div className="petals-results-grid">
          <figure><img src="/projects/petals/revision/output-composite.jpg" alt="玫瑰、百合、雏菊三组关系交互视觉的横向合成输出" loading="lazy" /><figcaption><span>ROSE / INTIMACY</span><span>LILY / WORKPLACE</span><span>DAISY / PEERS</span></figcaption></figure>
        </div>
      </section>

      <details className="petals-board"><summary>VIEW ORIGINAL RESEARCH BOARD <span>查看完整原始展板 ＋</span></summary><div><img src="/projects/petals/board.jpg" alt="赏花勿审花完整设计研究展板" loading="lazy" /></div></details>

      <section className="petals-section petals-exhibition" id="petals-exhibition">
        <div className="petals-heading light"><span>07</span><p>FINAL EXHIBITION</p><h2>让视觉从屏幕溢出，<br />回到被观看的现场。</h2></div>
        <div className="petals-final-grid">
          <figure className="petals-final-video"><video controls playsInline preload="metadata" poster="/projects/petals/video/final-poster.jpg" aria-label="赏花勿审花最终交互演示视频"><source src="/projects/petals/video/final.mp4" type="video/mp4" /></video><figcaption>FINAL INTERACTION FILM / 最终交互演示</figcaption></figure>
          <div className="petals-photo-grid">
            <figure><img src="/projects/petals/exhibition/view-01.jpg" alt="电脑与平板共同展示玫瑰主题交互视觉的现场" loading="lazy" /><figcaption>01 / LIVE SETUP</figcaption></figure>
            <figure><img src="/projects/petals/exhibition/view-02.jpg" alt="交互设备与设计展板现场细节" loading="lazy" /><figcaption>02 / INTERACTION DETAIL</figcaption></figure>
            <figure><img src="/projects/petals/exhibition/view-03.jpg" alt="赏花勿审花完整展板与设备陈列现场" loading="lazy" /><figcaption>03 / FINAL DISPLAY</figcaption></figure>
          </div>
        </div>
      </section>

      <footer className="petals-footer"><p>FADING PETALS WITH CHAINS / 赏花勿审花</p><button onClick={onClose}>BACK TO MASTER&apos;S WORK ↑</button></footer>
    </article>
  );
}

function LongmenProject({ onClose }:{ onClose:()=>void }) {
  const [researchFocus, setResearchFocus] = useState<0 | 1>(0);

  return (
    <article className="longmen-project" role="dialog" aria-modal="true" aria-label="LonGO Live 龙门古镇项目详情">
      <header className="longmen-topbar">
        <a href="#longmen-top" className="longmen-brand">LonGO LIVE <span>EXPLORE &amp; EARN</span></a>
        <nav aria-label="项目详情目录"><a href="#longmen-overview">概览</a><a href="#longmen-research">研究</a><a href="#longmen-service">系统</a><a href="#longmen-product">产品</a><a href="#longmen-brand">品牌</a></nav>
        <button onClick={onClose} aria-label="关闭项目详情">BACK TO WORKS ×</button>
      </header>

      <section className="longmen-hero" id="longmen-top">
        <div className="lm-hero-copy">
          <p>MASTER&apos;S PROJECT · 02 / 2025</p>
          <div className="lm-hero-logo"><span>LonGO</span><b>LIVE</b></div>
          <h1>Explore<br />&amp; Earn.</h1>
          <h2>龙门古镇文化体验积分系统</h2>
          <p className="lm-hero-intro">以非遗体验为入口，让参与、奖励与再消费形成持续流动的文化循环。</p>
        </div>
        <div className="lm-hero-art" aria-label="龙门非遗美食工坊视觉设计">
          <video className="lm-hero-video" autoPlay muted loop playsInline controls preload="metadata" poster="/projects/longmen/storyboard/04.jpg" aria-label="LonGO Live 龙门古镇项目视频">
            <source src="/projects/longmen/longmen-film.mp4" type="video/mp4" />
          </video>
          <figure className="lm-mascot-art">
            <img src="/projects/longmen/mascot-hero.png" alt="GLUGLU 非遗美食 IP 角色" />
            <figcaption>GLUGLU</figcaption>
          </figure>
        </div>
        <div className="lm-loop" aria-label="服务循环"><span>PARTICIPATE</span><i>→</i><span>EARN POINTS</span><i>→</i><span>REDEEM</span><i>→</i><span>RECONNECT</span></div>
      </section>

      <section className="lm-section lm-overview" id="longmen-overview">
        <div className="lm-heading"><span>01</span><p>PROJECT OVERVIEW</p><h2>把一次到访，<br />变成持续的文化关系。</h2></div>
        <div className="lm-overview-copy">
          <div><p>LonGO Live 是一套连接“文化体验＋数字平台”的虚拟积分系统。项目从龙门古镇本地非遗、美食作坊与青年游客之间的关系出发，重新组织体验预约、现场参与、积分获得、兑换消费与二次传播的完整旅程。</p><p>设计目标不是把传统文化包装成一次性景点，而是让游客的每一次参与都能回到本地经营者、传承人与社区，形成文化活力与在地经济共同增长的正向循环。</p></div>
          <dl><div><dt>ROLE</dt><dd>设计负责人 / Design Lead</dd></div><div><dt>TEAM</dt><dd>Fanta Si · 3 人小组</dd></div><div><dt>METHOD</dt><dd>实地访谈 · 生态系统图<br />服务蓝图 · 原型验证</dd></div><div><dt>OUTPUT</dt><dd>数字积分平台 · 非遗工坊<br />视觉识别 · 展览呈现</dd></div></dl>
        </div>
        <div className="lm-cycle" aria-label="龙门文化体验积分循环">
          <article><span>01</span><b>PLAY</b><h3>参与文化体验</h3><p>预约工坊、探索古镇、完成现场任务。</p></article>
          <article><span>02</span><b>EARN</b><h3>获得数字积分</h3><p>真实参与被记录为可见、可累积的价值。</p></article>
          <article><span>03</span><b>RETURN</b><h3>兑换与再连接</h3><p>积分流向本地产品、下一次体验与文化传播。</p></article>
        </div>
      </section>

      <section className="lm-section lm-research" id="longmen-research">
        <div className="lm-heading"><span>02</span><p>FIELD RESEARCH</p><h2>从利益相关者之间，<br />找到真正的断点。</h2></div>
        <div className={`lm-research-switcher ${researchFocus === 1 ? 'is-secondary-active' : ''}`}>
          <button className={`lm-research-view lm-research-one ${researchFocus === 0 ? 'is-active' : 'is-preview'}`} type="button" onClick={()=>setResearchFocus(0)} aria-pressed={researchFocus === 0} aria-label="放大查看访谈与生态系统图">
            <img src="/projects/longmen/research-primary.png" alt="龙门古镇访谈与旅游生态系统图" loading="lazy" />
            <span>01 / INTERVIEWS &amp; ECOSYSTEM MAP / 访谈与生态系统</span>
          </button>
          <button className={`lm-research-view lm-research-two ${researchFocus === 1 ? 'is-active' : 'is-preview'}`} type="button" onClick={()=>setResearchFocus(1)} aria-pressed={researchFocus === 1} aria-label="放大查看龙门古镇在地视觉线索">
            <img src="/projects/longmen/research-secondary.png" alt="龙门古镇自然非遗美食生活方式情绪板" loading="lazy" />
            <span>02 / VISUAL FIELD NOTES / 在地视觉线索</span>
          </button>
        </div>
        <blockquote><span>HOW MIGHT WE</span>如何平衡传统与现代发展，让在地文化参与真正转化为可持续的经济增长？</blockquote>
      </section>

      <section className="lm-section lm-service" id="longmen-service">
        <div className="lm-heading"><span>03</span><p>SERVICE SYSTEM</p><h2>让看不见的关系，<br />成为一条可体验的路径。</h2></div>
        <LongmenServiceSwitcher />
        <div className="lm-story-intro"><p>STORYBOARD / SERVICE IN MOTION</p><h3>一个临时到访者，如何成为文化体验的参与者、消费者与传播者。</h3></div>
        <LongmenGallery items={longmenStoryboard} label="故事板" />
      </section>

      <section className="lm-section lm-product" id="longmen-product">
        <div className="lm-product-head"><p>04 / DIGITAL PLATFORM</p><h2>一套平台，<br />串联到访前后。</h2><div><span>BOOK</span><span>DISCOVER</span><span>NAVIGATE</span><span>EARN</span><span>REDEEM</span></div></div>
        <figure className="lm-ia"><img src="/projects/longmen/slides/architecture.jpg" alt="LonGO Live 信息架构与低保真原型" loading="lazy" /><figcaption>INFORMATION ARCHITECTURE &amp; LOW-FI PROTOTYPE</figcaption></figure>
        <LongmenPlatformShowcase />
      </section>

      <section className="lm-section lm-brand-system" id="longmen-brand">
        <div className="lm-heading"><span>05</span><p>GRAPHIC BRANDING</p><h2>把非遗食物，<br />变成可识别的城市表情。</h2></div>
        <div className="lm-brand-lead"><figure><img src="/projects/longmen/slides/branding.jpg" alt="Gluglu IP 形象、平台标志与龙门美食工坊视觉系统" loading="lazy" /></figure><div><img className="lm-brand-mascot" src="/projects/longmen/mascot-mark.png" alt="GLUGLU IP 角色" /><p>以龙门面筋为原型，将圆润的食物形态、厨师帽与动作表情组合成 IP 角色 GLUGLU。荧光绿、珊瑚红与亮蓝延伸到平台、海报、明信片和折页，让数字体验与现场工坊保持一致的识别度。</p></div></div>
        <div className="lm-brand-gallery-section lm-brand-postcards">
          <div className="lm-brand-gallery-head"><p>01 / POSTER CARD</p><h3>把在地风味，<br />带离现场。</h3><span>4 PIECES / 四款主题明信片</span></div>
          <LongmenGallery items={longmenPostcards} label="Poster Card 明信片" />
        </div>
        <div className="lm-brand-gallery-section lm-brand-posters">
          <div className="lm-brand-gallery-head"><p>02 / POSTER</p><h3>让传统食物，<br />成为视觉主角。</h3><span>2 PIECES / 两款竖版主题海报</span></div>
          <div className="lm-poster-pair">
            {longmenPosters.map(([src,title],index)=><figure key={src}><div><img src={src} alt={title} loading="lazy" /></div><figcaption><span>{String(index + 1).padStart(2,'0')}</span>{title}</figcaption></figure>)}
          </div>
        </div>
        <div className="lm-brand-gallery-section lm-brand-foldings">
          <div className="lm-brand-gallery-head"><p>03 / FOLDING GUIDE</p><h3>从品牌封面，<br />展开完整体验。</h3><span>2 SIDES / 折页正反两面完整展示</span></div>
          <LongmenGallery items={longmenFoldings} label="Folding 折页" />
        </div>
      </section>

      <section className="lm-section lm-exhibition">
        <div className="lm-exhibition-copy"><p>06 / EXHIBITION</p><h2>从屏幕，<br />回到真实场域。</h2><p>最终成果以 A0 研究展板、服务系统图、应用界面、故事板和实体印刷品共同呈现，验证数字平台如何与线下文化体验形成完整触点。</p></div>
        <figure><img src="/projects/longmen/slides/exhibition.jpg" alt="LonGO Live 项目展览现场" loading="lazy" /><figcaption>FINAL EXHIBITION / 2025</figcaption></figure>
      </section>

      <details className="longmen-boards"><summary>VIEW ORIGINAL A0 BOARDS <span>查看两张原始设计展板 ＋</span></summary><div><img src="/projects/longmen/boards/a0-research.jpg" alt="LonGO Live 原始研究展板" loading="lazy" /><img src="/projects/longmen/boards/a0-system.jpg" alt="LonGO Live 原始系统与成果展板" loading="lazy" /></div></details>
      <footer className="longmen-footer"><p>LONGMEN TRIBUTE / LonGO LIVE</p><button onClick={onClose}>BACK TO MASTER&apos;S WORK ↑</button></footer>
    </article>
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
    if (project.caseStudy) window.history.replaceState(null, '', `#${project.caseStudy}-case`);
  };
  const closeProject = () => {
    setActiveProject(null);
    window.history.replaceState(null, '', '#masters');
  };
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#tongyun-case') setActiveProject(masterProjects[0]);
      if (window.location.hash === '#longmen-case') setActiveProject(masterProjects[1]);
      if (window.location.hash === '#petals-case') setActiveProject(masterProjects[2]);
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
      if (window.location.hash === '#tongyun-case' || window.location.hash === '#longmen-case' || window.location.hash === '#petals-case') window.history.replaceState(null, '', '#masters');
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
          <a className="index-row" href="#anime-ip"><span>04</span><h2>ANIME IP / MERCH<small>二次元IP / 衍生品设计</small></h2><b>↘</b></a>
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

      <section className="works-section coral-section" id="anime-ip">
        <div className="works-head"><div className="section-kicker">05 / ANIME IP &amp; MERCH <span>二次元IP / 衍生品设计</span></div><h2>Characters into<br /><em>worlds.</em></h2></div>
        <ProjectTrack projects={illustrationProjects} label="二次元IP与衍生品作品" onOpen={setActiveProject} />
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
        <nav><a href="#about" onClick={closeMenu}><i>01</i>ABOUT</a><a href="#masters" onClick={closeMenu}><i>02</i>MASTER&apos;S WORK</a><a href="#bachelors" onClick={closeMenu}><i>03</i>BACHELOR&apos;S WORK</a><a href="#anime-ip" onClick={closeMenu}><i>04</i>ANIME IP / MERCH</a><a href="#contact" onClick={closeMenu}><i>05</i>CONTACT</a></nav>
      </div>

      {activeProject?.number === 'M.01' && <div className="tongyun-overlay"><TongyunProject onClose={closeProject} /></div>}

      {activeProject?.number === 'M.02' && <div className="longmen-overlay"><LongmenProject onClose={closeProject} /></div>}

      {activeProject?.number === 'M.03' && <div className="petals-overlay"><PetalsProject onClose={closeProject} /></div>}

      {activeProject && activeProject.number !== 'M.01' && activeProject.number !== 'M.02' && activeProject.number !== 'M.03' && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setActiveProject(null)}>
        <article className="project-modal" role="dialog" aria-modal="true" aria-label={`${activeProject.cn} 作品详情`} onMouseDown={e=>e.stopPropagation()}>
          <button className="modal-close" onClick={()=>setActiveProject(null)} aria-label="关闭详情">CLOSE ×</button>
          <div className={`modal-art ${activeProject.tone}`}><span>{activeProject.number}</span></div>
          <div className="modal-copy"><p>{activeProject.year} · {activeProject.type}</p><h2>{activeProject.title}</h2><h3>{activeProject.cn}</h3><p className="modal-description">这是作品详情页框架。下一阶段会在这里加入项目背景、研究过程、设计方法、成果图与反思总结。</p><div className="detail-slots"><span>01 / CONTEXT</span><span>02 / PROCESS</span><span>03 / OUTCOME</span></div></div>
        </article>
      </div>}
    </main>
  );
}
