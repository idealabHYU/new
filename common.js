// 마우스로 쓰는 화면인지 (휴대폰·태블릿은 false): 마우스를 올려야 동작하는 기능은 손가락으로 누르는 방식으로 바꿔 씀
const HOVER = matchMedia("(hover: hover) and (pointer: fine)").matches;
// 공통 헤더·푸터. 메뉴 구성은 현행 mech.hanyang.ac.kr 그대로 (6개 대메뉴).
// 주소를 따로 적지 않은 항목은 sub.html?m=&s= 하위 페이지로 연결
const MENU = [
  { name: '소개',   subs: [['학과소개'], ['학과장 인사말'], ['교수진', 'faculty.html'], ['연혁'], ['방문안내']] },
  { name: '입학',   subs: [['학부'], ['대학원']] },
  { name: '학부',   subs: [['교과과정'], ['전공이수체계도'], ['학사안내'], ['학생활동'], ['학사일정'], ['장학안내']] },
  { name: '대학원', subs: [['교과과정'], ['학위취득 로드맵'], ['학사안내'], ['논문심사'], ['학사일정'], ['장학안내']] },
  { name: '연구',   subs: [['연구실'], ['사업단'], ['리서치 프로파일']] },
  { name: '게시판', subs: [['공지사항', 'board.html?c=공지'], ['뉴스', 'news.html'], ['취업정보', 'board.html?c=취업'], ['갤러리'], ['자료실'], ['행사일정']] },
];
const subHref = (m, s) => MENU[m].subs[s][1] || `sub.html?m=${m}&s=${s}`;

// 펼침 메뉴에서 따로 강조할 두 항목 (홈 하단 두 갈래 안내와 같은 내용)
const HOT = { 2: '<li><a class="hot" href="sub.html?m=1&s=0">전공 가이드 <span>→</span></a></li>', 3: '<li><a class="hot hot2" href="sub.html?m=3&s=5">대학원·장학 <span>→</span></a></li>' };
// 서브 상단 배경: 메뉴별 대표 사진 + 반투명 블루
const SH_IMG = { '소개': ['robot', 0], '입학': ['mobility', 0], '학부': ['semi', 0], '대학원': ['energy', 0], '연구': ['mfg', 0], '게시판': ['mfg', 1] };
const SH_DESC = { '소개': '1979년부터 이어온 한양대학교 ERICA 기계공학과를 소개합니다.', '입학': '학부와 대학원 입학 정보를 한눈에 안내합니다.', '학부': '4년 교육과정과 학사 정보를 안내합니다.',
  '대학원': '석·박사 과정과 장학 제도를 안내합니다.', '연구': '연구실과 BK21 교육연구단을 소개합니다.', '게시판': '학과 소식과 자료를 확인하세요.' };
const SH_EN = { '소개': 'ABOUT', '입학': 'ADMISSION', '학부': 'UNDERGRADUATE', '대학원': 'GRADUATE', '연구': 'RESEARCH', '게시판': 'NEWS' };
function setSubheroImg(active) {
  const sh = document.querySelector('.subhero'); if (!sh || typeof FIELD_IMG === 'undefined') return;
  sh.dataset.en = SH_EN[active] || ''; sh.dataset.kr = active;
  const [k, i] = SH_IMG[active] || ['robot', 0]; sh.style.setProperty('--sh-img', `url("${SZ(FIELD_IMG[k][i], 1000)}")`);
  const h1 = sh.querySelector('h1'); if (h1 && !sh.querySelector('.sh-desc')) h1.insertAdjacentHTML('afterend', `<p class="sh-desc">${SH_DESC[active] || ''}</p>`);
}

// 서브 페이지 B안: 왼쪽 세로 메뉴(LNB) + 오른쪽 본문
function setupLNB(active) {
  const sh = document.querySelector('.subhero'); if (!sh || document.querySelector('.lnb-layout')) return;
  const main = sh.parentNode.querySelector('main'); if (!main) return;
  const mi = MENU.findIndex(x => x.name === active); if (mi < 0) return;
  const lay = document.createElement('div'); lay.className = 'wrap lnb-layout';
  const aside = document.createElement('aside'); aside.className = 'lnb';
  aside.innerHTML = `<b class="lnb-t">${active}</b>`;
  const own = document.getElementById('subtabs');           // sub.html: 메뉴 형제 목록 그대로 이동 (탭 전환 기능 유지)
  if (own) { aside.appendChild(own); }
  else {
    const here = location.pathname.split('/').pop() || 'index.html';
    const nav = document.createElement('nav'); nav.className = 'subtabs lnb-nav';
    nav.innerHTML = MENU[mi].subs.map(([n], si) => { const h = subHref(mi, si); const u = new URL(h, location.href), cur = new URLSearchParams(location.search); const on = u.pathname.split('/').pop() === here && here !== 'sub.html' && (!u.searchParams.get('c') || u.searchParams.get('c') === cur.get('c')); return `<a href="${h}" class="${on ? 'on' : ''}">${n}</a>`; }).join('');
    aside.appendChild(nav);
    const pt = sh.querySelector('.subtabs');                 // 페이지 자체 탭(전임/명예교수 등)은 본문 위 작은 탭으로
    if (pt) { pt.classList.remove('subtabs'); pt.classList.add('ptabs'); main.prepend(pt); }
  }
  sh.parentNode.insertBefore(lay, main);
  lay.appendChild(aside); lay.appendChild(main);
  main.classList.add('lnb-main');
  // 휴대폰: 옆으로 넘기는 하위 메뉴에서 지금 페이지 탭이 화면 밖에 있으면 보이도록 가로로 당겨 둠
  const center = () => { const nav = aside.querySelector('.subtabs'), on = nav && nav.querySelector('.on');
    if (on && nav.scrollWidth > nav.clientWidth + 1) nav.scrollLeft += on.getBoundingClientRect().left - nav.getBoundingClientRect().left - 16; };
  setTimeout(center, 60);
  aside.addEventListener('click', () => setTimeout(center, 60));
}
function renderHeader(active) {
  setTimeout(() => { setSubheroImg(active); setupLNB(active); }, 0);
  // 누를 때만 해당 메뉴의 하위 항목이 작게 열림
  const top = MENU.map((m, mi) => `<li>
    <button class="top ${m.name === active ? 'on' : ''}" aria-expanded="false">${m.name}</button>
    <ul class="drop">${HOT[mi] || ''}${m.subs.map(([n], si) => `<li><a href="${subHref(mi, si)}">${n}</a></li>`).join('')}</ul></li>`).join('');
  document.getElementById('header').innerHTML = `
  <header class="gnb">
    <div class="wrap bar">
      <a class="logo" href="index.html" aria-label="한양대학교 기계공학과 홈">
        <img class="emb" src="img/hanyang-emblem.svg" alt="">
        <b class="uni">한양대학교</b><span class="sep"></span><b>기계공학과</b>
      </a>
      <ul class="menu"><li class="m-utl">
        <a href="https://ieng.hanyang.ac.kr/home" target="_blank" rel="noopener" data-keep>${LANG === 'en' ? 'Eng. College' : '공학대학'}</a>
        <a href="https://portal.hanyang.ac.kr/sso/lgin.do" target="_blank" rel="noopener">HY-in</a>
        <a href="https://hy-mooc.hanyang.ac.kr/hy-mooc" target="_blank" rel="noopener">HY-ON</a>
        <a class="lang" href="#" onclick="toggleLang(event)" data-keep>${LANG === 'en' ? 'KO' : 'EN'}</a></li>${top}</ul>
      <div class="utl">
        <a href="https://ieng.hanyang.ac.kr/home" target="_blank" rel="noopener" data-keep>${LANG === 'en' ? 'Eng. College' : '공학대학'}</a>
        <a href="https://portal.hanyang.ac.kr/sso/lgin.do" target="_blank" rel="noopener">HY-in</a>
        <a href="https://hy-mooc.hanyang.ac.kr/hy-mooc" target="_blank" rel="noopener">HY-ON</a>
        <a class="lang" href="#" onclick="toggleLang(event)" data-keep>${LANG === 'en' ? 'KO' : 'EN'}</a>
      </div>
      <button class="burger" aria-label="메뉴" onclick="document.body.classList.toggle('open')">☰</button>
    </div>
  </header>`;
  const items = document.querySelectorAll('.menu > li:not(.m-utl)');
  const closeAll = except => items.forEach(li => { if (li !== except) { li.classList.remove('open'); li.querySelector('.top').setAttribute('aria-expanded', 'false'); } });
  items.forEach(li => li.querySelector('.top').addEventListener('click', e => {
    e.stopPropagation();
    closeAll(li);
    const open = li.classList.toggle('open');
    li.querySelector('.top').setAttribute('aria-expanded', open);
  }));
  // 메뉴 하나에 마우스를 올리면 모든 메뉴의 하위 목록이 한 번에 펼쳐짐 (헤더를 벗어나면 닫힘)
  const gnb = document.querySelector('.gnb');
  // 메뉴가 열려 있는 동안에는 페이지의 자동 전환(첫 화면 사진·연구실 카드 등)을 멈춰, 메뉴 위에서 마우스를 움직일 때 다른 그리기 작업이 겹치지 않게 함
  // 휴대폰·태블릿(900px 이하)에서는 펼침 메뉴를 쓰지 않음: 손가락으로 누를 때도 mouseenter가 생겨 하위 메뉴가 한꺼번에 겹쳐 보였음
  const narrow = matchMedia('(max-width: 900px)');
  document.querySelector('.menu').addEventListener('mouseenter', () => { if (narrow.matches) return; gnb.classList.add('mega'); window.MENU_OPEN = true; });
  narrow.addEventListener('change', () => { gnb.classList.remove('mega'); document.body.classList.remove('open'); closeAll(); });
  document.querySelectorAll('.menu .drop a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('open')));
  gnb.addEventListener('mouseleave', () => { gnb.classList.remove('mega'); window.MENU_OPEN = false; });
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
}

function renderFooter() {
  // 화면 오른쪽 가장자리 가운데에 늘 붙어 있는 퀵 메뉴 (대학 사이트들의 오른쪽 퀵 메뉴 방식): 전공 가이드 · 대학원 장학 · 맨 위로
  if (!document.querySelector('.fab')) document.body.insertAdjacentHTML('beforeend', `<nav class="fab" aria-label="바로가기"><span class="fab-h">QUICK</span>
    <a href="sub.html?m=1&s=0" title="전공을 아직 못 정했다면"><b>전공 <br>가이드</b><i>→</i></a>
    <a href="sub.html?m=3&s=5" title="대학원을 고민한다면"><b>대학원 <br>장학</b><i>→</i></a>
    <button type="button" class="fab-top" onclick="window.scrollTo({ top: 0, behavior: 'instant' })" aria-label="맨 위로">TOP<i>↑</i></button></nav>`);
  // 홈 첫 화면에는 같은 버튼이 이미 있으므로, 첫 화면을 지나 내려온 뒤부터 보이게 함 (스크롤 이벤트 없이 화면 진입 감지만 사용)
  const fab = document.querySelector('.fab'), hero = document.querySelector('.hero');
  if (fab && hero && 'IntersectionObserver' in window) new IntersectionObserver(es => fab.classList.toggle('off', es[0].intersectionRatio > .3), { threshold: [0, .3, 1] }).observe(hero);
  document.getElementById('footer').innerHTML = `
  <footer>
    <div class="wrap ft-top">
      <nav class="ft-links"><a href="https://portal.hanyang.ac.kr/PiopAct/piopMainDaepyoWeb.do" target="_blank" rel="noopener"><b>개인정보처리방침</b></a><a href="https://www.hanyang.ac.kr/web/www/email-reject" target="_blank" rel="noopener">이메일무단수집거부</a></nav>
    </div>
    <div class="wrap ft-main">
      <img class="ft-lion" src="img/hanyang-lion-white.png" alt="한양대학교 사자 마크">
      <div class="ft-info">
        <b class="ft-name">한양대학교 ERICA 기계공학과</b>
        <p>15588 경기도 안산시 상록구 한양대학로 55 기계공학과, 대학원 기계설계공학과</p>
        <p><em>TEL</em> (학부) 031-400-5115 · (대학원) 031-400-5116</p>
        <p><em>홈페이지 책임자</em> 기계공학과 학과장<span class="ft-sep"></span><em>관리자</em> 양선웅 교수<span class="ft-sep"></span><em>담당자</em> 양선웅 교수</p>
        <p class="ft-copy">COPYRIGHT © 2026 한양대학교 기계공학과. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  </footer>`;
}

const pad = s => s.replace(/^\d{4}-/, '').replace('-', '.');
const isNew = d => (new Date(TODAY) - new Date(d)) / 864e5 <= 3;

/* ===== 영어 버전 (EN/KO 전환) =====
   페이지가 그려진 뒤 화면의 한국어 문구를 사전(EN)으로 바꿔 끼움. 이후 다시 그려지는 부분(공지 탭 등)도 자동 번역. */
let LANG = 'ko';
try { LANG = localStorage.getItem('demo-lang') || 'ko'; } catch (e) {}
function toggleLang(e) {
  e.preventDefault();
  try { localStorage.setItem('demo-lang', LANG === 'en' ? 'ko' : 'en'); } catch (err) {}
  location.reload();
}
const EN = {
  // 헤더·메뉴
  '한양대학교': 'Hanyang University', '기계공학과': 'Mechanical Engineering', '공학대학': 'College of Engineering',
  '소개': 'About', '입학': 'Admissions', '학부': 'Undergraduate', '대학원': 'Graduate', '연구': 'Research', '게시판': 'Board',
  '학과소개': 'Overview', '학과장 인사말': "Chair's Message", '교수진': 'Faculty', '연혁': 'History', '방문안내': 'Directions',
  '교과과정': 'Curriculum', '전공이수체계도': 'Course Roadmap', '학사안내': 'Academic Info', '학생활동': 'Student Activities',
  '학사일정': 'Academic Calendar', '장학안내': 'Scholarships', '학위취득 로드맵': 'Degree Roadmap', '논문심사': 'Thesis Review',
  '연구실': 'Labs', '사업단': 'Research Programs', '리서치 프로파일': 'Research Profile', '학부 공지사항': 'Undergraduate Notices',
  '대학원 공지사항': 'Graduate Notices', '뉴스': 'News', '구분': 'Type', '이전 기사': 'Previous', '다음 기사': 'Next', '목록': 'List', '취업정보': 'Careers', '갤러리': 'Gallery', '자료실': 'Archive', '행사일정': 'Events',
  // 첫 화면·숫자
  '한양대학교 ERICA 기계공학과': 'Department of Mechanical Engineering, Hanyang University ERICA',
  '모든 산업의 시작,': 'Where every industry begins:', '기계공학': 'Mechanical Engineering', '로봇부터 우주까지, 가장 넓은 진로가 열리는 전공입니다.': 'From robots to space — the major with the widest career paths.',
  '1979년부터 이어온 한양대학교 ERICA 기계공학과에서 가장 넓은 진로를 시작하세요.': 'Start the widest career path at Hanyang University ERICA Mechanical Engineering, since 1979.',
  '분야별로 만나는 기계공학': 'Mechanical Engineering by Field', '전공은 하나, 갈 수 있는 산업은 이만큼': 'One major, this many industries', '졸업 후 진로 +': 'Career paths +', '개 산업': ' industries', '움직이고, 힘을 받고, 열과 유체가 흐르는 모든 것. 기계공학은 그 원리를 다루기 때문에 거의 모든 산업이 기계공학 전공자를 찾습니다.': 'Anything that moves, carries load, or moves heat and fluid — Mechanical Engineering covers the principles, so nearly every industry looks for ME graduates.', '진로를 아직 못 정했어도 괜찮습니다. 어느 길로 가든 기계공학이 출발점이 됩니다.': 'Not decided yet? That is fine — whichever way you go, ME is a starting point.', '반도체·디스플레이': 'Semiconductors & Display', '조선·해양·건설': 'Shipbuilding, Ocean & Construction', '로봇·스마트팩토리': 'Robotics & Smart Factory', '바이오·의료기기': 'Bio & Medical Devices', '공기업·연구소·대학원': 'Public, Research & Grad School', '차체·파워트레인·자율주행 설계': 'Body, powertrain & autonomy design', '공정 장비 설계·생산 기술': 'Process equipment & production', '엔진·기체 구조 설계': 'Engine & airframe design', '발전 설비·플랜트 엔지니어': 'Power & plant engineering', '선박·플랜트·건축 설비 설계': 'Ship, plant & building systems', '로봇 설계·자동화 설비': 'Robot design & automation', '의료기기·헬스케어 장비 개발': 'Medical & healthcare devices', '연구원·기술직·학계': 'Research, engineering & academia', '전체 교수진 보기': 'All faculty', '20명의 교수진과 연구실 한눈에': 'All 20 faculty and labs at a glance', '전공 가이드 보기': 'Major guide', '전공 가이드': 'Major guide', '대학원 · 장학 안내': 'Graduate & scholarships', '20개 연구실': '20 labs', '47년 전통': '47 years of tradition', '졸업생 6,500명+': '6,500+ alumni', '대기업·연구소·공공기관에서 활약': 'At major firms, institutes & public sector', 'BK21 4단계 선정': 'BK21 FOUR program', '정부 지원 대학원 교육연구단': 'Government-funded graduate program', '하나의 전공에 무엇을 더하느냐에 따라 길이 달라집니다. 진로를 아직 정하지 않았다면, 가장 많은 산업과 연결된 전공에서 시작하세요.': 'What you add to one major decides your path. Not decided yet? Start with the major connected to the most industries.', '* 각 산업의 대표 기업 예시입니다.': '* Example companies in each industry.', '2026 신임 교수 4명': '4 new faculty in 2026', '새 연구실이 열립니다': 'New labs are opening', '자대생·타대생 모두 지원': 'Open to all applicants', '연구실 20곳': '20 research labs', '원하는 연구실을 골라 직접 경험': 'Pick a lab and get hands-on', '산업단지 옆 캠퍼스': 'Campus next to industry', '반월·시화 산단과 산학협력': 'Industry partnerships in Banwol-Sihwa', '1979년 ERICA와 함께 출범': 'Founded with ERICA in 1979', '교수진 전원 박사': 'All faculty hold Ph.D.s', '국내외 명문대 박사 20여 명': '20+ Ph.D.s from leading universities', '현업 설계 툴 실습': 'Hands-on industry design tools', 'BAQU4 · 국제대회 입상': 'BAQU4 · international awards', '로켓 엔진도 기계공학': 'Rocket engines, too', '액체로켓 터보펌프 연구': 'Research on liquid-rocket turbopumps', 'AI가 설계하는 기계': 'Machines designed by AI', 'LLM 기반 공학설계 연구': 'LLM-driven engineering design', '차세대 원자로까지': 'Even next-gen reactors', '원자로·수소 에너지 연구': 'Reactor & hydrogen energy systems', '학생 자작차 전국 2위': 'Student-built car, 2nd nationwide', '자동차연구회 BAQU4': 'BAQU4 automotive club', '7개 연구 분야': '7 research fields', '로봇·반도체부터 우주·AI까지': 'From robots and chips to space and AI', '반월·시화 산단 인접': 'Next to Banwol-Sihwa industrial complex', '산업 현장과 맞닿은 캠퍼스': 'A campus beside industry', '석사 · 박사 과정': 'M.S. · Ph.D. programs', '자대생·타대생 모두 지원 가능': 'Open to Hanyang and other graduates', '라이언스칼리지 · 자율전공생': 'Lions College · Undeclared', '자대생 · 타대생': 'Hanyang & other graduates', '학부생도 학부연구생으로 참여': 'Undergraduates can join research', '연구실 홈페이지 ↗': 'Lab website ↗', '홈페이지 준비중': 'Website coming soon',
  '로봇·반도체·우주·에너지·바이오·AI까지, 기계공학은 모든 산업으로 이어집니다.': 'Robots, chips, space, energy, bio and AI — Mechanical Engineering leads to every industry.',
  '진로가 아직 정해지지 않았다면, 가장 넓은 길에서 출발하세요.': 'Not sure about your path yet? Start from the widest road.',
  '로봇부터 반도체·에너지·바이오·AI까지, 하나의 학과에서.': 'From robots to semiconductors, energy, bio and AI — all in one department.',
  '자율전공생 전공 가이드': 'Major Guide for Undeclared Students', '대학원 진학 · 장학 안내': 'Graduate Admissions & Scholarships',
  'ERICA 개교와 함께 출범': 'Founded with ERICA campus', '전임 교수진': 'Full-time faculty', '연구 산업 분야': 'Industry fields',
  '2026년 신임 교수': 'New faculty in 2026', '명': '', '개': '', '년': ' yrs', '전국 2위': '2nd Nationwide',
  '1979년 ERICA 개교와 함께 이어온 역사': 'Of history since ERICA opened in 1979', '연구실 · 학부생도 학부연구생으로 참여': 'Labs · open to undergraduate researchers',
  '자동차연구회 BAQU4 자작자동차 대회': 'BAQU4 team, student-built vehicle contest', '졸업생 취업률': 'Graduate employment rate', '취업률 71.3%': 'Employment rate 71.3%', 'ERICA 2023 정보공시 · 전국 7위': 'ERICA, 2023 public data · 7th nationwide', '대표 진출처': 'Where graduates go', '하나의 전공, 8개 산업으로': 'One major, eight industries', '8개 산업': 'eight industries', '국방': 'Defense', '설계': 'Design', '생산': 'Manufacturing', '원자력': 'Nuclear', '바이오': 'Bio', '관련 연구기관': 'Research institutes', '졸업 후 진로 보기': 'See careers', '학과 소식': 'News', '우주공학': 'Space', '주소': 'Address', '뉴스 더 보기': 'More news', '연구 성과': 'Research', '취업': 'Careers', '1979년부터 이어온 한양대학교 ERICA 기계공학과를 소개합니다.': 'Hanyang University ERICA Mechanical Engineering, since 1979.', '학부와 대학원 입학 정보를 한눈에 안내합니다.': 'Undergraduate and graduate admissions at a glance.', '4년 교육과정과 학사 정보를 안내합니다.': 'Four-year curriculum and academic information.', '석·박사 과정과 장학 제도를 안내합니다.': 'M.S./Ph.D. programs and scholarships.', '연구실과 BK21 교육연구단을 소개합니다.': 'Our labs and the BK21 program.', '학과 소식과 자료를 확인하세요.': 'Department news and resources.', '기계공학 전공자는': 'Mechanical engineers', '어디서 일할까요?': 'where do they work?', '예시': 'sample',
  // 분야
  '로봇·자동화': 'Robotics & Automation', '반도체·전자': 'Semiconductors & Electronics', '모빌리티·우주': 'Mobility & Space',
  '에너지·원자력': 'Energy & Nuclear', '환경·플랜트': 'Environment & Plant', '바이오·의료': 'Bio & Medical',
  '인공지능': 'Artificial Intelligence', '제조·소재·구조': 'Manufacturing & Materials',
  '특수목적 로봇 · 소프트 로봇': 'Special-purpose & soft robots', '장비 · 플라즈마 · CMP': 'Equipment · Plasma · CMP',
  '자율주행 · 로켓 터보펌프': 'Autonomous driving · Rocket turbopumps', '배터리 · 수소 · 원자로': 'Batteries · Hydrogen · Reactors',
  '해수담수화 · 가스 정화': 'Desalination · Gas purification', '혈류역학 · 미세유체': 'Hemodynamics · Microfluidics',
  'AI 설계 · 지능형 제조': 'AI design · Smart manufacturing', '3D 프린팅 · 복합재': '3D printing · Composites',
  // 공지·일정
  '공지사항': 'Notices', '더보기 +': 'More +', '학과 일정': 'Events', '전체': 'All', '장학': 'Scholarship', '취업': 'Careers', '전공진입': 'Major',
  '2027학년도 라이언스칼리지 전공진입 설명회 안내': '2027 Lions College Major Declaration Info Session',
  '2027학년도 전기 대학원 신입생 모집 요강': '2027 Spring Graduate Admissions Guidelines',
  '2026-2학기 대학원 BK21 연구장학생 선발 결과': 'Fall 2026 BK21 Graduate Research Scholarship Results',
  '2026-2학기 캡스톤디자인1 중간발표 일정 및 조 배정': 'Fall 2026 Capstone Design 1 Midterm Schedule & Teams',
  '모빌리티 R&D 부문 신입 채용설명회 (학과 세미나실)': 'Mobility R&D Recruiting Session (Dept. Seminar Room)',
  '정기 세미나 — AI 기반 공학설계의 현재와 미래': 'Seminar — The Present and Future of AI-Driven Design',
  '겨울방학 학부연구생 모집 (20개 연구실)': 'Winter Undergraduate Research Program (20 Labs)',
  '2027-1학기 학부 성적우수장학금 신청 안내': 'Spring 2027 Undergraduate Merit Scholarship Application',
  '반도체 장비 기업 동계 현장실습 모집': 'Winter Internships at Semiconductor Equipment Companies',
  '2026-2학기 학위청구논문 심사 일정': 'Fall 2026 Thesis Defense Schedule',
  '2027-1학기 전공 교과목 수강 안내 및 선수과목 체계': 'Spring 2027 Course Registration & Prerequisites',
  '에너지 공기업 직무 특강 — 기계직 선배와의 대화': 'Energy Sector Career Talk with ME Alumni',
  '학부 세미나 — 로봇 회사 엔지니어의 하루': 'Undergraduate Seminar — A Day as a Robotics Engineer',
  '라이언스칼리지 전공진입 설명회': 'Lions College Major Info Session',
  '대학원 입학설명회 · 오픈랩 투어': 'Graduate Info Session & Open Lab Tour', '캡스톤디자인 중간발표회': 'Capstone Design Midterm Presentations',
  // 왜 기계공학·4대 역학·진로
  '특정 학과에 가지 않아도': "You don't need a narrow major —", '기계공학에서': 'With Mechanical Engineering,', '다 할 수 있습니다': 'you can do it all',
  '8개 분야의 공통 뿌리': 'The common root of all 8 fields', '4대 역학': 'Four Core Mechanics',
  '고체역학': 'Solid Mechanics', '힘과 변형': 'Force & deformation', '열역학': 'Thermodynamics', '열과 에너지': 'Heat & energy',
  '유체역학': 'Fluid Mechanics', '물과 공기의 흐름': 'Flow of water & air', '동역학': 'Dynamics', '운동과 진동': 'Motion & vibration',
  '졸업 후 어디로?': 'Where do graduates go?', '졸업 후 진로': 'Career Paths', '어디로든': 'anywhere', '기계공학,': 'Mechanical Engineering takes you', '갈 수 있습니다': '', '8개 분야 모두,': 'All 8 fields grow from the same root:', '이라는 같은 뿌리에서 출발합니다': '', '· 기계공학 전공자의 대표 진출 분야': '· typical paths for ME graduates', '기계공학 전공자의 대표 진출 분야': 'Typical paths for ME graduates',
  '기계공학, 어디로든 갈 수 있습니다': 'Mechanical Engineering takes you anywhere', '특정 학과에 가지 않아도 8개 산업으로': 'Eight industries, one department', '분야별 교수진 +': 'Faculty by field +', '기계공학 전공자가 진출하는 대표 분야': 'Typical career paths for ME graduates',
  '자동차·모빌리티': 'Automotive & Mobility', '반도체 장비': 'Semiconductor Equipment', '전자·디스플레이': 'Electronics & Display',
  '조선·해양': 'Shipbuilding & Ocean', '항공·우주': 'Aerospace', '건설·플랜트': 'Construction & Plant',
  '공기업·공공기관': 'Public Corporations', '대학원·연구소': 'Graduate School & Research',
  // 연구실·안내
  '연구실 둘러보기': 'Explore Our Labs', '전체 교수진 · 연구실 보기 →': 'All faculty & labs →', '지도교수': 'Advisor', '위치': 'Location', '교수실': 'Office', '학생연구실': 'Student Lab',
  '라이언스칼리지 · 자율전공생': 'Lions College · Undeclared students', '전공을 아직 못 정했다면': "Haven't chosen a major yet?",
  '1학년 탐색부터 4학년 캡스톤까지, 기계공학 4년 로드맵': 'A four-year ME roadmap, from first-year exploration to senior capstone',
  '자대생 · 타대생 대학원 지원자': 'Graduate applicants from Hanyang and other universities', '대학원을 고민한다면': 'Considering graduate school?',
  '석사·박사 장학금, 학석사 연계, 방학 연구 인턴까지': 'M.S./Ph.D. scholarships, combined B.S.–M.S. and research internships',
  // 교수진 페이지
  '교수진 · 연구실': 'Faculty & Labs', '전임교수': 'Full-time', '명예교수': 'Emeritus', '초빙·연구교수': 'Visiting & Research', '연구실 목록': 'Lab List',
  '교수': 'Professor', '부교수': 'Associate Professor', '조교수': 'Assistant Professor',
  '전산유체역학 · 난류 제어': 'CFD · Turbulence control', '레이저 미세가공 · MEMS': 'Laser micromachining · MEMS',
  '유체기계 설계 · 신재생에너지': 'Fluid machinery · Renewable energy', '기계설계 · 혈류역학': 'Mechanical design · Hemodynamics',
  '회전기계 동역학 · 로켓 터보펌프': 'Rotordynamics · Rocket turbopumps', '해수담수화 · 가스 정화 공정': 'Desalination · Gas purification',
  '금속 성형 · 3D 프린팅': 'Metal forming · 3D printing', '나노바이오 기계시스템 · 미세유체': 'Nano-bio systems · Microfluidics',
  '친환경차 · 자율주행 제어': 'Eco-friendly vehicles · Autonomous control', '레이저 나노소재 공정': 'Laser nanomaterial processing',
  '상변화 열전달 · 열관리 시스템': 'Phase-change heat transfer · Thermal systems', '반도체·디스플레이 장비 · 플라즈마': 'Semiconductor equipment · Plasma',
  '배터리 열관리 · 열폭주 해석': 'Battery thermal management · Thermal runaway', '소프트 로보틱스 · 고분자 공정': 'Soft robotics · Polymer processing',
  '복합재 · AI 구조 건전성 진단': 'Composites · AI structural health monitoring', '특수목적 로봇 · 스마트팩토리': 'Special-purpose robots · Smart factory',
  '극한환경 로봇 · 메카트로닉스': 'Extreme-environment robots · Mechatronics', '차세대 원자로 · 수소 에너지': 'Advanced reactors · Hydrogen energy',
  '기계설계 · AI': 'Mechanical design · AI', '반도체 CMP · AI 지능형 제조': 'Semiconductor CMP · AI manufacturing',
  // 연구실 이름
  '유체공학연구실': 'Fluid Engineering Lab', '나노 지능형가공 연구실': 'Nano Intelligent Machining Lab', '전산응용설계 및 유체공학 연구실': 'Computational Design & Fluid Engineering Lab', '신소재 및 혁신설계 연구실': 'Advanced Materials & Innovative Design Lab', '터보기계연구실': 'Turbomachinery Lab', '에너지 및 환경공학 연구실': 'Energy & Environmental Engineering Lab', '하이브리드 소재성형연구실': 'Hybrid Materials Forming Lab', '나노바이오 기계시스템 연구실': 'Nano-Bio Mechanical Systems Lab', '기계역학연구실': 'Mechanical Dynamics Lab', '나노광공정 연구실': 'Nano Optical Processing Lab', '자연모사열전달연구실': 'BETTER Lab (Nature-Inspired Heat Transfer)', '카오스 시스템 및 플라즈마 물리 연구실': 'Chaotic Systems & Plasma Physics Lab', '신재생 엔진 해석 연구실': 'Renewable Engine Analysis Lab', 'A 연구실': 'A Laboratory', '스마트 복합재료 연구실': 'Smart Composites Lab', '지능형 로봇시스템 연구실': 'Intelligent Robotic Systems Lab', '메카트로닉스 시스템 연구실': 'Mechatronics System Lab', '다중물리 해석 및 열시스템 연구실': 'MARS Lab (Multiphysics & Thermal Systems)', '지능형 공학설계 연구실': 'IDEA Lab (Intelligent Design)', '미래 제조기술 연구실': 'Future Manufacturing Technology Lab',
  // 푸터
  '개인정보처리방침': 'Privacy Policy', '이메일무단수집거부': 'No Email Harvesting',
  '15588 경기도 안산시 상록구 한양대학로 55 기계공학과, 대학원 기계설계공학과': '55 Hanyangdaehak-ro, Sangnok-gu, Ansan, Gyeonggi 15588, Korea · Mechanical Engineering / Graduate Program in Mechanical Design Engineering',
  '(학부) 031-400-5115 · (대학원) 031-400-5116': '(Undergraduate) +82-31-400-5115 · (Graduate) +82-31-400-5116',
  '홈페이지 책임자': 'Site Owner', '기계공학과 학과장': 'Department Chair', '관리자': 'Administrator', '담당자': 'Contact', '양선웅 교수': 'Prof. Sunwoong Yang',
  'COPYRIGHT © 2026 한양대학교 기계공학과. ALL RIGHTS RESERVED.': 'COPYRIGHT © 2026 Department of Mechanical Engineering, Hanyang University. ALL RIGHTS RESERVED.',
};
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_RULES = [
  [/^교수 (\d+)명$/, (m, n) => `${n} faculty`],
  [/^(\d+)월$/, (m, n) => MON[n - 1]],
  [/^(\d)공학관 (.+)호$/, (m, b, r) => `Engineering Building #${b}, Room ${r}`],
  [/^(.+) 교수 · 5공학관 (.+)호 · (.+)$/, (m, n, r, f) => `Prof. ${n} · Eng. Bldg 5, Rm ${r}`],
];
function translateNode(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => {
    const raw = n.nodeValue, key = raw.trim();
    if (!key || n.parentElement.closest('[data-keep],script,style')) return;
    let out = EN[key];
    if (out === undefined) for (const [re, fn] of EN_RULES) if (re.test(key)) { out = key.replace(re, fn); break; }
    if (out !== undefined) n.nodeValue = raw.replace(key, out);
  });
}
if (LANG === 'en') {
  document.documentElement.lang = 'en';
  addEventListener('DOMContentLoaded', () => {
    translateNode(document.body);
    document.title = document.title.replace('기계공학과 개편 데모', 'Mechanical Engineering · Demo');
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) translateNode(n); else if (n.nodeType === 3) translateNode(n.parentElement);
    }))).observe(document.body, { childList: true, subtree: true });
  });
}

// ---- 렉 진단 표시: 주소에 ?fps=1 을 붙였을 때만 화면 왼쪽 아래에 표시 (평소에는 아무 일도 하지 않음)
if (new URLSearchParams(location.search).has('fps')) addEventListener('DOMContentLoaded', () => {
  const box = document.createElement('div'); box.setAttribute('data-keep', '');
  box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;padding:10px 14px;border-radius:10px;background:#111;color:#fff;font:600 14px/1.6 Consolas,monospace;white-space:pre;pointer-events:none';
  document.body.appendChild(box);
  let gpu = '?';
  try { const gl = document.createElement('canvas').getContext('webgl'); const ex = gl && gl.getExtension('WEBGL_debug_renderer_info'); gpu = gl ? (ex ? gl.getParameter(ex.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : 'WebGL 사용 불가'; } catch (e) { gpu = '확인 실패'; }
  const soft = /swiftshader|software|llvmpipe|basic render/i.test(gpu);
  let last = performance.now(), frames = [], slow50 = 0, slow100 = 0, worst = 0;
  const tick = t => { const d = t - last; last = t; frames.push([t, d]); if (d > 50) slow50++; if (d > 100) slow100++; if (d > worst) worst = d; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  setInterval(() => {
    const now = performance.now(); frames = frames.filter(f => now - f[0] < 3000);
    const sec = frames.filter(f => now - f[0] < 1000).length, w3 = Math.max(0, ...frames.map(f => f[1]));
    box.textContent = `FPS ${sec}   최근 3초 최악 ${w3.toFixed(0)}ms   전체 최악 ${worst.toFixed(0)}ms\n50ms 넘은 프레임 ${slow50}회 · 100ms 넘은 프레임 ${slow100}회\n그래픽: ${gpu.slice(0, 70)}${soft ? '  ← 소프트웨어 렌더링(가속 꺼짐)' : ''}\n화면 ${innerWidth}×${innerHeight} · 배율 ${devicePixelRatio} · 애니메이션 줄이기 ${matchMedia('(prefers-reduced-motion: reduce)').matches ? '켜짐' : '꺼짐'}`;
  }, 500);
});

// ===== 영어 화면 보완 (2026-11-27): 화면별로 빠져 있던 문구 =====
Object.assign(EN, {
  // 교수 이름 (학과 홈페이지 people_ 영문 표기)
  '윤준용': 'Joonyong Yoon', '이성환': 'Seoung Hwan Lee', '이도형': 'Dohyung Lee', '오제훈': 'Je Hoon Oh', '류근': 'Keun Ryu',
  '김영득': 'Young Deuk Kim', '윤종헌': 'Jonghun Yoon', '이원철': 'Won Chul Lee', '김남욱': 'Namwook Kim', '홍석준': 'Sukjoon Hong',
  '오준호': 'Junho Oh', '김호준': 'Ho Jun Kim', '김진용': 'Jinyong Kim', '최이현': 'Andrew Choi', '노형도': 'Hyung Doh Roh',
  '김태균': 'Taegyun Kim', '박지혁': 'Jihyuk Park', '박주현': 'Joo Hyun Park', '양선웅': 'Sunwoong Yang', '강석경': 'Sukkyung Kang',
  // 연구실 이름 (현재 표기)
  '유체공학 연구실': 'Fluid Engineering Lab', '나노 지능형제조 연구실': 'Nano Intelligent Manufacturing Lab', '터보기계 연구실': 'Turbomachinery Lab',
  '하이브리드 소재성형 연구실': 'Hybrid Materials Forming Lab', '기계역학 연구실': 'Machine Dynamics Lab', '자연모사 열전달 연구실': 'BETTER Lab (Bio-inspired Heat Transfer)',
  '최이현 교수 연구실': "Prof. Andrew Choi's Lab", '다물리 열시스템 연구실': 'MARS Lab (Multiphysics Thermal Systems)',
  // 공통
  '홈': 'Home', '전공': 'Major', '가이드': 'Guide', '바로가기': 'Quick links', '바로가기 ↗': 'Visit ↗', '홈페이지': 'Website', '준비중': 'Coming soon',
  '총': 'Total', '건': '', '번호': 'No.', '제목': 'Title', '제목 검색': 'Search titles', '등록된 글이 없습니다': 'No posts yet', '등록된 일정이 없습니다': 'No events yet',
  '학과 행사 사진이 올라오면 이곳에 앨범으로 보입니다.': 'Photos from department events will appear here as albums.',
  '서식과 자료가 올라오면 이곳에서 내려받을 수 있습니다.': 'Forms and files will be available for download here.',
  '학과 행사 일정이 등록되면 이곳에 표시됩니다.': 'Department events will be listed here once they are posted.',
  '이전': 'Prev', '다음': 'Next',
  // 첫 화면
  '하나의 전공,': 'One major,', '으로': '', '자동차': 'Automotive', '반도체': 'Semiconductors', '항공우주': 'Aerospace', '로봇': 'Robotics',
  '전기차와 자율주행차를 만듭니다': 'Building electric and self-driving cars', '반도체를 만드는 장비를 설계합니다': 'Designing the machines that make chips',
  'AI로 기계를 설계하고 더 똑똑하게 만듭니다': 'Designing machines with AI and making them smarter', '로켓과 비행기, 인공위성을 만듭니다': 'Building rockets, aircraft and satellites',
  '발전소와 배터리로 전기를 만듭니다': 'Making electricity with power plants and batteries', '전투기와 전차로 나라를 지킵니다': 'Defending the country with fighter jets and tanks',
  '사람을 돕는 로봇을 설계합니다': 'Designing robots that help people', 'MRI 같은 병원 장비를 만듭니다': 'Building hospital equipment such as MRI scanners',
  '현대자동차': 'Hyundai Motor', '기아': 'Kia', '현대모비스': 'Hyundai Mobis', '삼성전자': 'Samsung Electronics', 'SK하이닉스': 'SK hynix', '삼성SDI': 'Samsung SDI',
  '네이버': 'NAVER', '현대오토에버': 'Hyundai AutoEver', '안랩': 'AhnLab', '한화에어로스페이스': 'Hanwha Aerospace', '대한항공': 'Korean Air',
  '한국전력': 'KEPCO', '한국수력원자력': 'KHNP', '두산에너빌리티': 'Doosan Enerbility', 'LIG넥스원': 'LIG Nex1', '현대로템': 'Hyundai Rotem', '한화시스템': 'Hanwha Systems',
  '두산로보틱스': 'Doosan Robotics', '레인보우로보틱스': 'Rainbow Robotics', '현대로보틱스': 'Hyundai Robotics', '삼성메디슨': 'Samsung Medison', '오스템임플란트': 'Osstem Implant', '바디프렌드': 'Bodyfriend',
  '한국자동차연구원': 'Korea Automotive Technology Institute', '한국기계연구원': 'Korea Institute of Machinery & Materials', '한국전자통신연구원': 'ETRI',
  '나노종합기술원': 'National NanoFab Center', '한국과학기술연구원': 'KIST', '한국항공우주연구원': 'Korea Aerospace Research Institute', '한국천문연구원': 'Korea Astronomy and Space Science Institute',
  '한국에너지기술연구원': 'Korea Institute of Energy Research', '한국원자력연구원': 'Korea Atomic Energy Research Institute', '국방과학연구소': 'Agency for Defense Development',
  '국방기술품질원': 'Defense Agency for Technology and Quality', '한국로봇융합연구원': 'Korea Institute of Robotics & Technology Convergence', '한국생산기술연구원': 'Korea Institute of Industrial Technology',
  '한국생명공학연구원': 'Korea Research Institute of Bioscience and Biotechnology',
  '전체 교수진 · 연구실 보기': 'All faculty & labs', '석사·박사 장학금, 학석사 연계, 연구실 정보까지': 'M.S./Ph.D. scholarships, combined B.S.–M.S. and lab information', '대학원 · 장학': 'Graduate & Scholarships',
  // 뉴스
  "홍석준 교수, 한국연구재단 '한우물파기 기초연구' 선정": "Prof. Sukjoon Hong selected for NRF's long-term basic research program",
  "기계공학과 홍석준 교수가 2026년 3월 초 한국연구재단의 '한우물파기 기초연구' 과제에 선정됐습니다.": "In early March 2026, Prof. Sukjoon Hong was selected for the National Research Foundation of Korea's long-term basic research program ('Hanumul').",
  '한 가지 연구 주제를 오랫동안 깊이 파고들 수 있도록 돕는 사업으로, 연간 약 1억 6천만 원을 최대 10년간 지원합니다.': 'The program supports in-depth work on a single topic, with about KRW 160 million a year for up to 10 years.',
  '전국에서 20명 미만의 연구자만 선정되는 것으로 알려져 있습니다.': 'Fewer than 20 researchers nationwide are reportedly selected.',
  "홍 교수는 세계 상위 2% 연구자로, 주변 환경에 따라 색이 바뀌는 '카멜레온 로봇'과 레이저로 색을 구현하는 기술 등을 연구해 왔습니다.": "Prof. Hong, listed among the world's top 2% of researchers, has worked on a 'chameleon robot' that changes color with its surroundings and on laser-based coloring technology.",
  '이번 선정을 계기로 이 분야 연구를 장기간 이어갈 계획입니다.': 'He plans to continue this line of research over the long term.',
  "국내 최초 '국제우주대학 우주연구 프로그램(SSP25)' ERICA에서 개최": "ERICA hosts the International Space University's SSP25, a first in Korea",
  '국제우주대학 우주연구 프로그램(SSP25)이 2025년 6월 30일 ERICA 캠퍼스에서 개막했습니다. 국내에서는 처음, 아시아에서는 네 번째로 열린 행사입니다.': "The International Space University's Space Studies Program (SSP25) opened at the ERICA campus on June 30, 2025 — the first time in Korea and the fourth time in Asia.",
  '37개국에서 123명이 참가해 핵심 강의, 분과별 활동, 팀 프로젝트를 8주 동안 진행합니다.': '123 participants from 37 countries take part in core lectures, department activities and team projects over eight weeks.',
  '우주공학 관련 기관 견학과 로켓 발사 행사 같은 실습 프로그램도 포함됩니다.': 'Hands-on programs include visits to space organizations and a rocket launch event.',
  'ERICA는 기계공학과 류근 교수, 로봇공학과 최영진 교수 등의 연구력을 바탕으로 일반대학원 우주공학과를 신설했고, 2026학년도에 첫 신입생을 모집합니다.': "Building on the research of faculty such as Prof. Keun Ryu (Mechanical Engineering) and Prof. Youngjin Choi (Robotics), ERICA has founded a graduate Department of Space Engineering, admitting its first students in 2026.",
  '한양대 ERICA, 취업률 71.3%로 전국 4년제 대학 7위': "Hanyang ERICA ranks 7th among Korea's four-year universities with a 71.3% employment rate",
  'ERICA 캠퍼스가 2023년 정보공시 취업통계(졸업생 2,000명 이상 4년제 대학 기준)에서 취업률 71.3%로 전국 7위를 기록했습니다.': 'In the 2023 public employment statistics (four-year universities with 2,000+ graduates), the ERICA campus ranked 7th nationwide with a 71.3% employment rate.',
  '현행 조사 방식이 도입된 2015년 이후 가장 높은 취업률입니다.': 'It is the highest rate since the current survey method was introduced in 2015.',
  '코로나 영향으로 62.8%까지 떨어졌던 2021년 공시와 비교해 빠르게 회복했습니다.': 'The rate recovered quickly from 62.8% in the 2021 report, which was affected by COVID-19.',
  '1~4학년이 모두 듣는 취업 교과목, 학과별 취업 · 진로 지도교수제, 활발한 현장실습이 배경으로 꼽힙니다.': 'Career courses for all four years, departmental career advisors and active internships are cited as the reasons.',
  '현장실습에 참여한 학생의 취업률은 83%였습니다(대학 자체 조사).': 'Students who completed internships had an 83% employment rate (university survey).',
  '학과 관련 기사를 요약해 소개합니다. 원문은 각 기사 아래 링크에서 볼 수 있습니다.': 'Summaries of articles about the department. The original article is linked below each summary.',
  '뉴스H에서 더 보기 ↗': 'More on News H ↗', '뉴스H': 'News H', '원문 기사 보기': 'Read the original article',
  '기사 내용을 학과에서 요약한 글입니다. 자세한 내용은 원문에서 확인하세요.': 'This is a summary written by the department. See the original article for details.',
  '다음 기사가 없습니다': 'No next article', '이전 기사가 없습니다': 'No previous article',
  // 교수진
  '초빙교수': 'Visiting', '연구교수': 'Research Professor', '학과장': 'Chair', '연구분야': 'Research', '전체 교수진': 'All faculty',
  // 학과소개
  '1979년부터,': 'Since 1979,', '대한민국': "Korea's", '의': '', '중심': 'hub',
  '산업도시 안산에서 40여 년간 대한민국 기계공학의 고급 인력을 길러 왔습니다.': 'For over 40 years in the industrial city of Ansan, we have trained Korea’s leading mechanical engineers.',
  'ERICA와 함께 출범': 'Founded with ERICA', '여 명': '+', '졸업생': 'Alumni', '4단계 교육연구단': 'BK21 FOUR program',
  '어느 분야에서든 앞서가는 네 가지 힘': 'Four strengths to lead in any field', '창의력': 'Creativity', '해석력': 'Analysis', '통합력': 'Integration', '현실구현화': 'Realization',
  '이론에서': 'From theory', '현장': 'to practice', '까지': '', '교육과정': 'Curriculum', '4년 단계별 교육': 'Four-year step-by-step education',
  '기초과학 → 4대 역학 → 설계·제작 → 응용': 'Basic science → Four core mechanics → Design & build → Application', 'CATIA · ANSYS · FLUENT 실습': 'Hands-on CATIA · ANSYS · FLUENT',
  '교과과정 보기 →': 'View curriculum →', '산학협력': 'Industry partnership', '산업 현장과 함께': 'Working with industry', '안산·시화공단, 서울·경기 산업체와': 'With companies in Ansan-Sihwa, Seoul and Gyeonggi',
  '이론과 실무를 잇는 교육': 'Education linking theory and practice', '연구실 보기 →': 'View labs →', '기계설계공학과 석·박사': 'M.S./Ph.D. in Mechanical Design Engineering',
  '해석력과 창의력을 갖춘': 'Analytical and creative', '정예 연구기술자 양성': 'research engineers', '대학원 입학 보기 →': 'Graduate admissions →', '학과소개 전문 보기': 'Read the full introduction',
  "한양대학교 기계공학과는 1979년 한양대학교 ERICA캠퍼스의 개교와 함께 출범하여 서해안시대를 주도할 전략적 산업 요충지인 전원공업도시 안산에 뿌리를 내려 지난 40여 년간 대한민국 기계공학 분야의 중추적인 역할을 담당하는 훌륭한 고급인력 양성에 주력하여 왔습니다. 본 대학의 '사랑의 실천'이라는 건학 이념을 바탕으로, 지성인으로서의 인격과 품성을 갖추도록 교육하며, 기계공학 분야의 깊이 있는 이론과 기술을 습득하게 하고, 창의력, 해석력, 통합력, 현실구현화 능력을 배양함으로써, 장차 기계공학 분야는 물론 산업기술, 과학 등 관련 어느 분야에서도 충분한 공학적 감각과 독창성을 발휘하여 선도적 역할을 수행하는 탁월한 인재 육성을 목표로 하고 있습니다.":
    "The Department of Mechanical Engineering at Hanyang University was founded in 1979 together with the ERICA campus in Ansan, a strategic industrial city on Korea's west coast. For more than 40 years it has trained highly skilled engineers who play a central role in Korean mechanical engineering. Guided by the university's founding spirit, 'Love in Deed', we educate students of character, give them deep theory and technical skill, and build their creativity, analysis, integration and realization, so that they can lead not only in mechanical engineering but in any related field of industry and science.",
  '현재 본 학과 소속 교수진은 전원 국내외의 저명 대학에서 박사학위를 취득한 20여 명으로 구성되어 국내 최고 수준에 있습니다. 젊고 활력 넘치는 교육 및 연구 활동으로, 인근의 안산·시화공단의 산업체뿐만 아니라 서울·경기 지역의 산업체와 효율적인 협력관계를 구축하고 이를 교육과 연계함으로써 이론과 현장실무를 통합한 실용학문의 교육에 매진하고 있습니다. 또한 산학지역 컨소시엄과 안산 테크노파크를 통한 첨단산업기술의 개발·이전으로 지역경제 활성화에 일익을 담당할 전문인력 양성에도 힘쓰고 있습니다.':
    'Our faculty of about 20 professors, all holding doctorates from leading universities in Korea and abroad, are among the best in the country. Through energetic teaching and research, we work closely with companies in the nearby Ansan-Sihwa industrial complex as well as in Seoul and Gyeonggi, and bring that partnership into the classroom to combine theory with practice. Through industry–university consortia and the Ansan Techno Park, we also develop and transfer advanced technology and train specialists who help the regional economy grow.',
  '교육과정은 1학년에서 기계공학의 기초에 해당하는 응용과학 과목을, 2학년에서 기계시스템의 해석과 이해를 위한 전공기초 과목(고체역학, 열역학, 동역학, 유체역학)을, 3학년에서 기계시스템의 설계와 제작을 위한 전공심화 과목(기계설계, 열전달, 기계제작공정, 기계진동학, 수치계산, 컴퓨터지원설계, 계측시스템 설계및응용, 기계가공실습 등)을, 4학년에서 전공응용 과목(열시스템설계, 탄성학설계, 유체기계설계, 동력기계설계, 자동제어, 기계역학 등)을 교육합니다. 이론 학습과 함께 CAE S/W(CATIA, ANSYS, FLUENT)를 포함한 실험실습 교육을 병행하여 4차 산업기술 및 국가 발전에 기여하는 인력을 양성하고, 산업체, 정부기관, 연구기관, 학계에서 지도적인 역할을 담당하여 국가와 인류사회 번영에 이바지하고자 합니다.':
    'First-year students take applied science courses that form the basis of mechanical engineering; second-year students take core courses for analyzing mechanical systems (solid mechanics, thermodynamics, dynamics and fluid mechanics); third-year students take advanced courses in design and manufacturing (machine design, heat transfer, manufacturing processes, mechanical vibration, numerical methods, computer-aided design, measurement systems, machining practice and more); and fourth-year students take applied courses (thermal system design, elasticity design, fluid machinery design, power machinery design, automatic control, machine dynamics and more). Alongside theory, hands-on labs with CAE software (CATIA, ANSYS, FLUENT) prepare graduates to lead in industry, government, research institutes and academia.',
  '대학원 과정으로 기계설계공학과를 운영하며 석사 및 박사 학위 프로그램을 제공합니다. 기계공학 또는 관련 분야의 학사학위를 가진 자에게 입학자격이 부여되며, 자동화·정밀화·고기능화되어 가는 기계류를 보다 안전하고 경제적이며 효율적으로 설계·제작·운전할 수 있도록 최신 이론과 응용기법을 심도 있게 교육·연구하여, 해석력과 창의력 및 종합적인 이해력을 겸비한 정예의 석박사 연구기술자 양성을 목표로 합니다.':
    'At the graduate level, the Department of Mechanical Design Engineering offers M.S. and Ph.D. programs, open to holders of a bachelor’s degree in mechanical engineering or a related field. Through in-depth study of the latest theory and applications for designing, building and operating increasingly automated, precise and sophisticated machinery safely and efficiently, we train elite researchers with strong analytical, creative and integrative skills.',
  "학부생 동아리로는 자동차 차체·차량을 제작해 자동차 경주대회에 출전하여 전국대회 2위, 국제대회 입상 등의 성과를 보이고 있는 자동차연구회 '바쿠넷(BAQU4)', 기계공학 관련 CAE 및 컴퓨터 프로그래밍 동아리 'RED', 축구 동아리 '동틀무렵'이 활발하게 활동하고 있습니다.":
    "Student clubs include the automotive club BAQU4, which builds its own cars and has placed 2nd in national competitions and won international awards; RED, a CAE and programming club; and the soccer club Dongteulmuryeop.",
  // 학과장 인사말
  '21세기 국가산업을 이끌': 'Raising', '기계공학 인재': 'mechanical engineers', '를 기릅니다': "to lead Korea's 21st-century industry",
  '자동차 · 선박 · 항공기 · 반도체부터 로봇 · 에너지 · 플랜트까지,': 'From cars, ships, aircraft and chips to robots, energy and plants,',
  '기계공학은 우리 산업의 거의 모든 분야를 아우릅니다.': 'mechanical engineering spans almost every industry.', '졸업생 배출': 'graduates', '위': '',
  '대교협 기계분야 평가 (2004)': 'KCUE mechanical engineering evaluation (2004)', '중앙일보 학과평가 (2013)': 'JoongAng Ilbo department ranking (2013)', 'QS 세계대학 학문분야 평가': 'QS World University Rankings by Subject',
  '인사말 전문 보기': "Read the full message",
  '기계공학은 21세기 지식기반 산업의 핵심 중추 분야에 해당하는 공학 분야이며, 우리나라 산업의 근간을 이루는 자동차, 선박, 고속 철도, 항공기, 반도체/디스플레이, 스마트 가전, IT 산업기기, 첨단제조, 로봇, 의공학 기기, 차세대 기계설비, 나노바이오, 신소재, 에너지, 각종 플랜트 산업 등을 모두 아우르고 있습니다.':
    "Mechanical engineering is a core field of the 21st-century knowledge-based economy. It spans the industries at the heart of Korea's economy: cars, ships, high-speed rail, aircraft, semiconductors and displays, smart appliances, IT equipment, advanced manufacturing, robots, medical devices, next-generation machinery, nano-bio, new materials, energy and plants.",
  '1979년 한양대학교 ERICA캠퍼스와 함께 시작된 공학대학 기계공학과는 세계 수준의 현장맞춤형 교육시스템 확립을 통한 기계 산업 발전을 선도하는 실용 / 창의 / 전문 / 융합형 글로벌 기계인력 배출을 목표로, 지금까지 약 6,500여 명의 졸업생을 배출하여 국내 대기업 및 중소기업, 연구소, 대학, 공공기관 등 우리 사회 각계각층뿐 아니라 해외에서도 활발하게 활약하고 있습니다.':
    'Founded in 1979 together with the ERICA campus, the department aims to produce practical, creative, professional and interdisciplinary global engineers through a world-class, industry-oriented education. About 6,500 graduates are active at large and small companies, research institutes, universities and public organizations in Korea and abroad.',
  '1999년부터 BK21 과학기술분야 1단계, 2단계 및 4단계 사업에 참여하여 우리나라 기계 분야의 고급인력을 양성하고 있으며, 2003년부터 교육부 학연산 클러스터 교육과정과 연계하여 현장 중심형, 연구 중심형, 창업 중심형 교육과정과 같은 맞춤형 교육프로그램을 제공하고 있습니다. 또한 한국과학재단 지정 최적설계신기술 연구센터와 산업자원부 지원 신뢰성분석 연구센터 및 마이크로바이오칩 센터에 참여하고 국가 창의적 연구 과제를 포함한 각종 국가연구개발과제와 산업체 과제를 수행하고 있습니다.':
    'Since 1999 the department has taken part in Phases 1, 2 and 4 of the BK21 program, and since 2003 it has offered tailored industry-, research- and startup-oriented tracks linked to the Ministry of Education cluster program. Faculty also take part in research centers for optimal design, reliability analysis and micro-biochips, and carry out national R&D and industry projects.',
  "특히 2004년 대교협 기계분야 평가에서 전국 2위의 성적으로 최우수 학과로 선정되었으며, 2012년도 한국대학교육협의회 주관 산업계 관점 대학평가 '최우수', 2013년도 중앙일보 학과평가 '전국 10위', QS 세계대학 학문분야 평가 '세계 109위', 2014년 수도권특성화대학 사업단 선정, 2020년 4단계 BK21 교육연구단 선정 등 명실공히 21세기 국가산업을 주도할 기계분야의 연구 및 교육중심 학과로 자리 잡고 있습니다.":
    "The department ranked 2nd nationwide in the 2004 KCUE mechanical engineering evaluation, was rated 'Excellent' in the 2012 industry-perspective evaluation, ranked 10th nationally in the 2013 JoongAng Ilbo ranking and 109th in the world in the QS rankings by subject, and was selected for the CK-II program in 2014 and BK21 FOUR in 2020.",
  '이러한 지금까지의 전통을 이어받아, 앞으로도 우리 학과는 국가의 기술경쟁력을 높이고 인류발전에 기여하며, 세계적 수준의 기계공학 교육을 통해 우수한 공학인재를 양성할 뿐 아니라 글로벌 수준의 기술개발 및 연구를 이어가기 위해 끊임없이 노력할 것입니다.':
    "Building on this tradition, we will keep working to strengthen Korea's technological competitiveness, contribute to humanity, train outstanding engineers through world-class education, and pursue research at a global level.",
  // 연혁
  '1979년부터 이어온': 'Since 1979:', '40여 년': '40+ years', '기계공학과 신설': 'Department founded', '1단계 BK21 사업단 선정': 'Selected for BK21 Phase 1',
  '기계공학과로 학과제 전환': 'Became the Dept. of Mechanical Engineering', '4단계 BK21 교육연구단 선정': 'Selected for BK21 FOUR', '혁신 인재 양성': 'Training innovative talent',
  '4단계 BK21 교육연구단 선정 (소재 · 부품 · 장비 분야: ERICA 소재부품융합 첨단제조장비 혁신인재 교육연구단)': 'Selected for BK21 FOUR (materials, parts & equipment: ERICA Advanced Manufacturing Equipment Innovation Program)',
  '스마트건설기계 인력양성사업 선정': 'Selected for the Smart Construction Machinery workforce program', '학과제 전환과 성과': 'New department structure and results',
  '에너지인력양성사업 선정': 'Selected for the Energy workforce program', "중앙일보 학과평가 '상' 등급": "Top grade in JoongAng Ilbo department ranking", 'PRIME 사업 선정': 'Selected for the PRIME program',
  'HYU 학과평가 최우수상 수상': 'Best Department award, HYU evaluation', '수도권대학 특성화 사업 (CK-II) 선정': 'Selected for the CK-II specialization program',
  "한국대학교육협의회 주관 산업계 관점평가 대학평가 '최우수', 교과과정 일치도 '최우수'": "'Excellent' in the KCUE industry-perspective evaluation and curriculum alignment",
  '기계정보경영공학부에서 기계공학과로 학과제 전환': 'Changed from the School of Mechanical & Information Management Eng. to the Dept. of Mechanical Engineering',
  '도약': 'Growth', '2단계 BK21 기계분야 사업단 선정': 'Selected for BK21 Phase 2 (mechanical)', '한국대학교육협의회 기계공학과 평가 전국 2위': '2nd nationwide in the KCUE mechanical engineering evaluation',
  '한양대학교 HYU Global 학과 선정': 'Selected as an HYU Global department', '산학협력사업 중심대학 선정 (기계부품 · 소재 관련 사업)': 'Selected as a leading industry–university cooperation university (machine parts & materials)',
  '학연산 클러스터(기계부품 관련학과) 특성화사업 선정': 'Selected for the university–institute–industry cluster program (machine parts)',
  '기계산업공학부에서 기계정보경영공학부로 명칭 변경 (기계정보경영공학부 기계공학전공)': 'Renamed the School of Mechanical & Information Management Engineering',
  '출범과 기반': 'Founding years', '기계공학과와 산업공학과를 기계산업공학부로 통합': 'Merged with Industrial Engineering into the School of Mechanical & Industrial Engineering',
  '1단계 BK21 기계분야 사업단 선정 (서울대학교와 공동)': 'Selected for BK21 Phase 1 (mechanical, jointly with Seoul National University)', '공학대학 기계공학과로 소속 변경': 'Moved to the College of Engineering',
  '기계공학과 신설 (500명)': 'Department founded (500 students)',
  // 방문안내
  '찾아오시는 길': 'Getting here', '(15588) 경기도 안산시 상록구 한양대학로 55': '55 Hanyangdaehak-ro, Sangnok-gu, Ansan, Gyeonggi 15588', '한양대학교 공학대학 기계공학과': 'Dept. of Mechanical Engineering, College of Engineering, Hanyang University',
  '행정팀': 'Office', '연락처': 'Phone', '학부 031-400-5115': 'Undergraduate +82-31-400-5115', '대학원 031-400-5116': 'Graduate +82-31-400-5116',
  '카카오맵에서 보기': 'Open in Kakao Map', '네이버지도에서 보기': 'Open in Naver Map',
  // 입학
  '라이언스칼리지(자율전공) 학생과 신입생을 위한 기계공학 4년 흐름입니다. 실제 교과과정 기준입니다.': 'The four-year path in mechanical engineering for Lions College (undeclared) and first-year students, based on the actual curriculum.',
  '기초 다지기': 'Foundations', '기계공학개론 · 일반물리 · 미적분 · CADD · 정역학': 'Intro to ME · Physics · Calculus · CADD · Statics', '고체역학 · 열역학 · 동역학 · 유체역학': 'Solid mechanics · Thermodynamics · Dynamics · Fluid mechanics',
  '설계와 제작': 'Design & build', '기계설계 · 열전달 · 기계진동학 · 캡스톤디자인1': 'Machine design · Heat transfer · Vibration · Capstone Design 1',
  '응용과 실전': 'Application', '자동제어 · 설계방법론 · 유한요소해석 · 캡스톤디자인2·3': 'Automatic control · Design methodology · FEA · Capstone Design 2 & 3',
  '자동차 · 모빌리티': 'Automotive & Mobility', '반도체 · 디스플레이': 'Semiconductors & Display', '항공 · 우주': 'Aerospace', '에너지 · 원자력': 'Energy & Nuclear',
  '조선 · 해양 · 건설': 'Shipbuilding, Ocean & Construction', '로봇 · 스마트팩토리': 'Robotics & Smart Factory', '바이오 · 의료기기': 'Bio & Medical Devices', '공기업 · 연구소 · 대학원': 'Public sector, Research & Grad School',
  'ERICA 입학처': 'ERICA Admissions', '모집요강 · 전형 안내': 'Guidelines & admission tracks', '학부 교과과정': 'Undergraduate curriculum', '학년별 전체 과목': 'All courses by year',
  '일반대학원': 'Graduate School', '기계설계공학과': 'Mechanical Design Engineering',
  '최신 이론과 응용 기법을 교육·연구해 해석력과 창의력, 종합적 이해력을 겸비한 정예 석·박사 연구기술자를 양성합니다.': 'We train elite M.S. and Ph.D. researchers with strong analytical, creative and integrative skills through the latest theory and applications.',
  '학위과정': 'Degrees', '석사 · 박사 · 석박사통합': 'M.S. · Ph.D. · Integrated M.S./Ph.D.', '지원 자격': 'Eligibility', '기계공학 또는 관련 분야 학사학위 소지자': "Bachelor's degree in ME or a related field",
  '대학원 입학 안내': 'Graduate admissions', '한양대학교 대학원': 'Hanyang University Graduate School', '대학원 장학 안내': 'Graduate scholarships', '장학 제도 한눈에': 'Scholarships at a glance',
  // 교과과정
  '교과목': 'Course', '학점': 'Credits', '전공기초': 'Basic', '전공핵심': 'Core', '전공심화': 'Advanced', '교양필수': 'General (req.)', '파란 글씨는 전공핵심 과목입니다.': 'Core major courses are shown in blue.',
  '전체 보기': 'View all',
  '기계공학개론': 'Introduction to Mechanical Engineering', '일반물리학1': 'General Physics 1', '일반물리학2': 'General Physics 2', '일반물리학실험1': 'General Physics Lab 1', '일반화학1': 'General Chemistry 1',
  '미분적분학1': 'Calculus 1', '미분적분학2': 'Calculus 2', '파이썬과인공지능': 'Python and AI', 'AI리터러시': 'AI Literacy', 'ESG와SDGs이해': 'Understanding ESG and SDGs', 'IC-PBL과비전설계': 'IC-PBL and Vision Design',
  '정역학': 'Statics', '공업수학1': 'Engineering Mathematics 1', '공업수학2': 'Engineering Mathematics 2', '공업수학3': 'Engineering Mathematics 3', '아카데믹글쓰기': 'Academic Writing',
  '기계재료설계': 'Materials Design', '기계공학입문설계': 'Introductory ME Design', '학술영어': 'Academic English', 'IC-PBL과취창업을위한진로탐색': 'IC-PBL and Career Exploration',
  '기계계측공학': 'Mechanical Measurement', '고체역학응용설계': 'Applied Solid Mechanics Design', '열역학응용설계': 'Applied Thermodynamics Design', '유체역학응용설계': 'Applied Fluid Mechanics Design',
  '기계설계': 'Machine Design', '수치계산': 'Numerical Methods', '생산공학': 'Production Engineering', '기계공학실험기초': 'Basic ME Laboratory', '시스템해석및모델링': 'System Analysis and Modeling',
  '전기전자공학': 'Electrical and Electronic Engineering', '기계공작실습': 'Machine Shop Practice', '기계공학연구실심화실습1': 'ME Lab Research Practice 1', '기계공학연구실심화실습2': 'ME Lab Research Practice 2',
  '기계공학연구실심화실습3': 'ME Lab Research Practice 3', '기계공학연구실심화실습4': 'ME Lab Research Practice 4', '열전달': 'Heat Transfer', '기계진동학': 'Mechanical Vibration',
  '기계캡스톤디자인1': 'ME Capstone Design 1', '기계캡스톤디자인2': 'ME Capstone Design 2', '기계캡스톤디자인3': 'ME Capstone Design 3', '기계요소설계': 'Machine Element Design', '기계공학실험': 'ME Laboratory',
  '기계가공과공정설계': 'Machining and Process Design', '기계가공실습': 'Machining Practice', 'IC-PBL과역량계발': 'IC-PBL and Competency Development', '자동제어': 'Automatic Control', '기계역학': 'Machine Dynamics',
  '유체기계설계': 'Fluid Machinery Design', '열시스템설계': 'Thermal System Design', '설계방법론': 'Design Methodology', '응용유한요소해석': 'Applied Finite Element Analysis', '기계공학특론': 'Special Topics in ME',
  '취업진로세미나': 'Career Seminar', '컴퓨터지원설계': 'Computer-Aided Design', '인공지능첨단제조': 'AI for Advanced Manufacturing', '친환경동력공학': 'Green Power Engineering', '냉동및공기조화': 'Refrigeration and Air Conditioning',
  '가스역학': 'Gas Dynamics', '탄성학개론': 'Introduction to Elasticity', '기계제작공정': 'Manufacturing Processes', '계측시스템설계및응용': 'Measurement System Design', '공학설계및응용': 'Engineering Design and Application',
  '공학설계및응용2': 'Engineering Design and Application 2', '기계융합제조공정설계': 'Convergent Manufacturing Process Design', '융합기계설계': 'Convergent Machine Design', '수송기계설계': 'Transport Machine Design',
  '응용기계시스템설계': 'Applied Mechanical System Design', '탄성학설계': 'Elasticity Design', '동력기계설계': 'Power Machinery Design',
  '힘을 받은 물체가 얼마나 버티고 얼마나 변형되는지 다룹니다.': 'How much load a structure can take and how much it deforms.', '자동차 · 항공기 · 로봇 · 반도체 장비': 'Cars · Aircraft · Robots · Chip equipment',
  '열과 에너지가 어떻게 이동하고 일로 바뀌는지 다룹니다.': 'How heat and energy move and turn into work.', '배터리 · 발전소 · 에어컨 · 반도체': 'Batteries · Power plants · HVAC · Semiconductors',
  '공기와 물처럼 흐르는 물질의 움직임을 다룹니다.': 'How flowing matter such as air and water moves.', '항공기 · 로켓 · 풍력발전 · 선박': 'Aircraft · Rockets · Wind power · Ships',
  '움직이는 물체의 운동과 진동, 그리고 제어를 다룹니다.': 'Motion, vibration and control of moving systems.', '로봇 · 자율주행차 · 드론 · 방위산업': 'Robots · Self-driving cars · Drones · Defense',
  '대표 직무 분야': 'Typical fields', '추천 수강 순서': 'Recommended course sequence', '추천 이수 경로': 'Recommended path',
  // 학사안내 · 학생활동
  '수강신청, 학적, 졸업 등 학사 업무는 대학 학사 시스템에서 안내합니다.': 'Registration, records and graduation are handled in the university academic system.', '학사안내 바로가기': 'Go to academic system',
  '학생회': 'Student Council', '기계공학과 학생회': 'ME Student Council', '학생회실 · 제1공학관 123호': 'Student Council room · Engineering Building #1, Room 123', '전공학회': 'Major society', '축구학회': 'Soccer club', '동틀무렵': 'Dongteulmuryeop',
  '학생회는 학생들을 위해 존재하는 순수한 봉사기구입니다. 학생들의 권익을 보호하고, 학과 · 학부 구성원이 모일 수 있는 구심점이 되며, 학생들과 학교 사이의 다리 역할을 하는 중요한 기구입니다. 기계공학과는 우리 학교의 36년을 함께 해왔으며, 학생회도 올해 36회가 되었습니다. 600학우와 함께 하는 학생회가 되도록 노력하겠습니다.':
    'The student council serves students: it protects their rights, brings the department together and connects students with the university. The council is now in its 36th year, and we work to be a council for all 600 students.',
  '자작자동차를 연구하고 제작하는 학회로서 1999년 시작되었습니다. 지도교수님은 엔진 및 광계측 연구실의 이기형 교수님이십니다. 교내에서 자동차에 대한 교육과 자작차량 제작을 수행하며, 여름방학에는 교외 대회에 참가합니다. 창단 이래로 많은 대회에서 다양한 수상경력을 가지고 있습니다.':
    'Founded in 1999, BAQU4 designs and builds its own cars. The club studies automotive engineering and builds vehicles on campus, and enters competitions every summer. It has won many awards since its founding.',
  '1994년에 창단된 기계공학과 내의 유일한 축구학회로, 선후배 · 동기와의 친목 도모를 위해 시작되었습니다. 오래된 역사만큼 많은 선배님들께서 학회의 활동을 지원해 주고 계시며, 많은 회원들의 관심과 참여로 다양한 대회에 참가해 화려한 수상경력을 자랑합니다. 매 학기 1회씩 OB : YB 정기전을 개최하여 졸업하신 선배님들과 재학생들 간의 정기적인 교류를 이어 나가고 있습니다.':
    "Founded in 1994, this is the department's only soccer club. Alumni support its activities, members have won many tournaments, and every semester an alumni vs. students match keeps graduates and current students connected.",
  '기계공학과 전공학회 RED(Renovative Engineering Design)는 기계공학도로서 갖추어야 할 전공 역량을 함양하고, 공학적 지식을 실제 설계 및 제작 과정에 적용하는 능력을 기르는 것을 목적으로 활동하고 있습니다.':
    'RED (Renovative Engineering Design) is a major society that helps students build core engineering skills and apply their knowledge to real design and fabrication.',
  'CATIA, Autodesk Fusion, ANSYS, Arduino 등 다양한 공학 프로그램을 활용한 정규 스터디를 운영하고 있으며, 3D 프린팅 특강, 전공 관련 산업 박람회 견학 등 여러 학술활동을 진행하고 있습니다. 또한, 학회원들이 학습한 내용을 바탕으로 아이디어를 구체화하고 실현할 수 있도록 교내외 공모전 참여를 지원하고 있습니다.':
    'It runs regular study groups on CATIA, Autodesk Fusion, ANSYS, Arduino and other tools, along with 3D printing workshops and visits to industry exhibitions. It also supports members in entering competitions on and off campus to turn their ideas into reality.',
  '공학대학 학회': 'College of Engineering societies', '항공우주학회': 'Aerospace society',
  'COMET은 항공우주 분야에 대한 열정과 도전정신을 가진 학생들이 모여 2021년부터 활동을 시작한 학회입니다. 항공우주 분야에 대한 기초 지식을 쌓기 위한 스터디를 진행하며, 매년 여름 개최되는 전국대학생로켓학술대회 및 발사대회 참가를 목표로 CAD 설계 프로그램과 FEA, CFD 해석 프로그램 등을 활용하여 로켓을 설계하고 제작합니다.':
    'COMET was founded in 2021 by students passionate about aerospace. Members study the fundamentals of aerospace and design and build rockets with CAD, FEA and CFD tools to compete in the national student rocket conference and launch competition every summer.',
  '또한 전국대학생로켓연합회(NURA)를 통해 타 대학 항공우주 동아리와 교류하며, 항공우주 관련 강연 및 세미나에 참여하는 등 다양한 활동을 통해 항공우주 분야에 대한 지식과 경험을 넓혀 나가고 있습니다.':
    'Through the National University Rocket Association (NURA), COMET also works with aerospace clubs at other universities and attends aerospace lectures and seminars.',
  // 학사일정
  '학년도': 'Academic Year', '1학기 개강': 'Spring semester begins', '1학기 종강': 'Spring semester ends', '2학기 개강': 'Fall semester begins', '2학기 종강': 'Fall semester ends',
  '1학기': 'Spring semester', '2학기': 'Fall semester', '여름방학': 'Summer break', '겨울방학': 'Winter break', '이번 달': 'This month',
  '조기졸업 신청기간': 'Early graduation applications', '1학기 수강신청 최종 정정기간': 'Spring final course adjustment', '1학기 중간 강의평가 기간': 'Spring midterm course evaluation',
  '2025학년도 후기 졸업예정자 졸업논문 제출기간': 'Thesis submission for Aug. 2026 graduates', '휴학자의 학기인정 기준일': 'Semester credit cut-off for leave of absence',
  '1학기 학점포기 신청기간': 'Spring credit withdrawal', '여름 계절학기 신청기간': 'Summer session registration', '다중 · 복수 · 부전공 신청 및 포기기간': 'Double major / minor applications',
  '1학기 S/U등급 신청기간': 'Spring S/U grade applications', '1학기 기말 강의평가 기간': 'Spring final course evaluation', '2학기 재입학 접수기간': 'Fall readmission applications',
  '1학기 성적입력 및 열람기간 (이의신청 및 정정포함)': 'Spring grade entry & review (incl. appeals)', '보강가능일': 'Make-up class days', '여름 계절학기': 'Summer session', '하계방학': 'Summer vacation',
  '1학기 학사학위취득유예 신청기간': 'Spring graduation deferral applications', '2학기 복학 신청기간': 'Fall return-to-school applications', '2학기 휴학 신청기간': 'Fall leave-of-absence applications',
  '2025학년도 후기 졸업사정': 'Graduation review (Aug. 2026)', '2학기 수강신청기간': 'Fall course registration', '2025학년도 후기 학위수여식 (ERICA)': 'Commencement, Aug. 2026 (ERICA)',
  '2학기 수강신청 최종 정정기간': 'Fall final course adjustment', '2학기 중간 강의평가 기간': 'Fall midterm course evaluation', '2026학년도 전기 졸업예정자 졸업논문 제출기간': 'Thesis submission for Feb. 2027 graduates',
  '2학기 학점포기 신청기간': 'Fall credit withdrawal', '2027학년도 1학기 재입학 접수기간': 'Spring 2027 readmission applications', '겨울 계절학기 신청기간': 'Winter session registration',
  '2학기 S/U등급 신청기간': 'Fall S/U grade applications', '2학기 기말 강의평가 기간': 'Fall final course evaluation', '2학기 성적입력 및 열람기간 (이의신청 및 정정포함)': 'Fall grade entry & review (incl. appeals)',
  '겨울 계절학기': 'Winter session', '동계방학': 'Winter vacation', '2학기 학사학위취득유예 신청기간': 'Fall graduation deferral applications', '2027학년도 1학기 휴 · 복학 신청기간': 'Spring 2027 leave & return applications',
  '2027학년도 전과 접수기간': '2027 change-of-major applications', '2027학년도 전과 면접': '2027 change-of-major interviews', '2026학년도 전기 졸업사정': 'Graduation review (Feb. 2027)',
  '2027학년도 1학기 수강신청기간': 'Spring 2027 course registration', '2026학년도 전기 학위수여식 (ERICA)': 'Commencement, Feb. 2027 (ERICA)', '2027학년도 입학식 (ERICA)': '2027 Entrance ceremony (ERICA)',
  '신 · 편입생 수강신청기간': 'Course registration for new & transfer students', '학사일정은 사정에 따라 변경될 수 있습니다.': 'The calendar may change.', '한양대학교 학사캘린더에서 자세히 보기': 'Full calendar at Hanyang University',
  // 장학
  '학부생이 받을 수 있는 주요 장학금입니다.': 'Main scholarships for undergraduates.', '교내 장학금': 'University scholarships', '국가장학금 (1, 2 유형)': 'National Scholarship (Types I & II)',
  '국가우수장학금': 'National Merit Scholarship', '국가근로장학금': 'National Work-Study Scholarship', '교외장학금 등': 'External scholarships, etc.', 'ERICA 장학제도 안내': 'ERICA scholarships', '장학금별 자격 · 신청 방법': 'Eligibility & how to apply',
  '대학원 수업료,': 'Graduate tuition support', '최대 100%': 'up to 100%', '지원': '', '수업료': 'Tuition',
  '한양대 출신 (자대생)': 'Hanyang graduates', '다른 대학 출신 (타대생)': 'Graduates of other universities', '석박사통합과정': 'Integrated M.S./Ph.D.', '석사과정': 'M.S. program', '박사과정': 'Ph.D. program', '학석사연계과정': 'Combined B.S.–M.S.',
  '자대생 가능': 'Hanyang grads: yes', '타대생 가능': 'Other universities: yes', '타대생 불가': 'Other universities: no', '기간': 'Period', '조건': 'Requirement', '1~2학기 100% · 3~6학기 70%': 'Sem. 1–2: 100% · Sem. 3–6: 70%',
  '학부 평점 3.5 이상': 'Undergrad GPA 3.5+', '학기별 지원 · 자격 요건': 'Support by semester & eligibility', '지원 기준': 'Basis', '3학기': 'Sem. 3', '4학기': 'Sem. 4', '5학기': 'Sem. 5', '6학기': 'Sem. 6',
  '대상': 'Who', '일반대학원 석박사통합과정 특별전형 · 특별전형2 신입학자 (일반학과 합격자, 학과간협동과정 제외)': 'New integrated M.S./Ph.D. students admitted through Special Admission 1 or 2 (excluding interdisciplinary programs)',
  '학부 평점': 'Undergrad GPA', '3.5/4.5 이상 (만점 4.3 대학은 3.3, 4.0 대학은 3.0 이상) · 졸업예정자는 졸업 학기 성적 제외 · 제1전공 기준': '3.5/4.5 or higher (3.3 on a 4.3 scale, 3.0 on a 4.0 scale) · final semester excluded for expected graduates · first major',
  '유지 조건': 'To keep it', '직전 학기 장학용 평점 3.75 이상 · 매 학기 연구조교 임용': 'GPA 3.75+ in the previous semester · research assistant every semester', '우수 석박사통합과정 장학 · 입학금은 감면 대상 아님': 'Integrated M.S./Ph.D. merit scholarship · admission fee not covered',
  '4개 학기': '4 semesters', '3개 학기': '3 semesters', '본교 학부 평점 3.75 이상': 'Hanyang undergrad GPA 3.75+', '학부 평점 3.75 이상': 'Undergrad GPA 3.75+', '일반대학원 석사학위과정 특별전형 · 특별전형2 신입학자': 'New M.S. students admitted through Special Admission 1 or 2',
  '자격': 'Eligibility', '본교 학부(서울/ERICA) 졸업예정자 또는 졸업 3년 이내 · 학부 평점 3.75/4.5 이상 (제1전공 기준)': 'Hanyang (Seoul/ERICA) graduates or expected graduates within 3 years · GPA 3.75/4.5+ (first major)',
  '석사과정 자대생(HY-in) 장학 · 입학금은 감면 대상 아님': 'M.S. HY-in scholarship · admission fee not covered', 'ERICA 석사 평점 3.75 이상': 'ERICA M.S. GPA 3.75+', '석사 평점 3.75 이상': 'M.S. GPA 3.75+',
  '일반대학원 박사학위과정 특별전형 · 특별전형2 신입학자 (4단계 BK21사업 선정학과 · 인공지능융합학과 제외)': 'New Ph.D. students admitted through Special Admission 1 or 2 (excluding BK21 FOUR and AI Convergence departments)',
  '본교 일반대학원 석사과정(ERICA) 졸업예정자 또는 졸업자 · 석사 평점 3.75/4.5 이상': 'Hanyang ERICA M.S. graduates or expected graduates · M.S. GPA 3.75/4.5+', '박사과정 자대생(HY-in) 장학 · 입학금은 감면 대상 아님': 'Ph.D. HY-in scholarship · admission fee not covered',
  '학석사연계과정 선발자': 'Selected combined B.S.–M.S. students', '학석사연계과정 선발자로 본교 일반대학원 신입학자': 'Combined B.S.–M.S. students entering the Graduate School', '학석사연계과정 장학 · 입학금은 감면 대상 아님': 'Combined B.S.–M.S. scholarship · admission fee not covered',
  '알아두세요': 'Good to know', '입학금은 감면 대상이 아닙니다.': 'The admission fee is not covered.', '이미 입학한 학생에게 소급해 선발하지 않습니다.': 'Students already enrolled are not selected retroactively.',
  '게시 내용 · 모집요강 · 내규가 서로 다를 때는 내규가 우선합니다.': 'If this page, the admission guide and the regulations differ, the regulations apply.', '이 밖에 BK21사업 장학 등 학과 · 사업단 장학이 있습니다.': 'Department and BK21 scholarships are also available.',
  '일반대학원 장학 내규': 'Graduate School scholarship regulations', '2022.5.19. 공포 · 2023학년도 전기 신입생부터 적용': 'Issued May 19, 2022 · applies from Spring 2023 entrants', '대학원 행정 문의': 'Graduate office',
  // 대학원 교과과정 · 안내
  '논문연구': 'Thesis research', '전공선택': 'Elective', '연구선택': 'Research elective', '연구필수': 'Research (req.)', '석사논문연구': 'M.S. Thesis Research', '박사논문연구1': 'Ph.D. Thesis Research 1', '박사논문연구2': 'Ph.D. Thesis Research 2',
  '최적제어이론': 'Optimal Control Theory', '응용광학및레이저가공': 'Applied Optics and Laser Processing', '나노공정개론': 'Introduction to Nanofabrication', 'Industry4.0첨단소재부품장비': 'Industry 4.0 Advanced Materials, Parts & Equipment',
  '터보기계개론': 'Introduction to Turbomachinery', '기계역학특론': 'Advanced Machine Dynamics', '고등고체역학및응용': 'Advanced Solid Mechanics and Applications', '정밀공학': 'Precision Engineering', '기계설계논문연구': 'Machine Design Thesis Research',
  '첨단장비설계공학': 'Advanced Equipment Design', '첨단제조공정종합분석': 'Analysis of Advanced Manufacturing Processes', '유한요소구조해석': 'Finite Element Structural Analysis', '정밀구동장치및제어': 'Precision Actuators and Control',
  '반도체/디스플레이핵심공정및장비': 'Key Semiconductor/Display Processes and Equipment', '전산유체역학': 'Computational Fluid Dynamics', '터보기계윤활이론2': 'Turbomachinery Lubrication Theory 2', '회전기계상태진단및진동분석': 'Rotating Machinery Diagnostics and Vibration',
  '플랜트응용설계공학': 'Applied Plant Design', '대류열전달': 'Convective Heat Transfer', '정밀생산공학': 'Precision Manufacturing', '마이크로나노열유체공학': 'Micro/Nano Thermal-Fluid Engineering', '반도체프로젝트I': 'Semiconductor Project I',
  '산학프로젝트1': 'Industry Project 1', '로봇공학기초': 'Fundamentals of Robotics', '나노바이오기계및소재': 'Nano-Bio Machines and Materials', '볼트체결부설계': 'Bolted Joint Design', '박판성형이론및전산해석': 'Sheet Forming Theory and Simulation',
  '열공정시스템': 'Thermal Process Systems', '머신비전과스마트제조': 'Machine Vision and Smart Manufacturing', '기계설계론': 'Machine Design Theory', '신뢰성기반설계': 'Reliability-Based Design', '기계설계논문연구2': 'Machine Design Thesis Research 2',
  '첨단인쇄공정장비': 'Advanced Printing Process Equipment', '터보기계윤활이론1': 'Turbomachinery Lubrication Theory 1', '터보기계회전체동역학': 'Turbomachinery Rotordynamics', '소성가공및응용': 'Metal Forming and Applications', '난류모델링': 'Turbulence Modeling',
  '고등전산유체': 'Advanced CFD', '생산공학특론': 'Advanced Production Engineering', '절삭가공학특론': 'Advanced Machining', '반도체프로젝트II': 'Semiconductor Project II', '선형시스템및제어': 'Linear Systems and Control', '산학프로젝트2': 'Industry Project 2',
  'AI기반반도체장비최적설계및제어': 'AI-Based Optimal Design and Control of Semiconductor Equipment',
  '대학원 기계설계공학과 석사 및 박사 학위취득 로드맵입니다.': 'Degree roadmap for M.S. and Ph.D. students in Mechanical Design Engineering.', '학위취득 로드맵 (PDF)': 'Degree roadmap (PDF)', '대학원 기계설계공학과 석사 및 박사': 'M.S. and Ph.D., Mechanical Design Engineering',
  '대학원 학적 · 수강 등 학사 업무는 한양대학교 대학원에서 안내합니다.': 'Graduate records and registration are handled by the Hanyang University Graduate School.', '대학원 학사안내': 'Graduate academic info',
  '학위논문 심사 절차와 일정은 한양대학교 대학원에서 안내합니다.': 'Thesis review procedures and schedules are provided by the Graduate School.', '논문심사 안내': 'Thesis review guide',
  '대학원 학기별 일정은 한양대학교 대학원 학사일정에서 확인할 수 있습니다.': 'See the Graduate School academic calendar for semester schedules.', '대학원 학사일정': 'Graduate academic calendar',
  // 연구
  '4단계 BK21': 'BK21 FOUR', '교육연구단': 'Education & Research Program', 'ERICA 소재부품융합 첨단제조장비 혁신인재 교육연구단 (2020년 선정, 소재 · 부품 · 장비 분야)': 'ERICA Advanced Manufacturing Equipment Innovation Program (selected 2020; materials, parts & equipment)',
  'BK21 FOUR 교육연구단 홈페이지': 'BK21 FOUR program website', '참여 사업 이력': 'Past programs', '4단계 BK21 교육연구단 · 스마트건설기계 인력양성사업': 'BK21 FOUR · Smart Construction Machinery workforce program',
  '에너지인력양성사업': 'Energy workforce program', 'PRIME 사업': 'PRIME program', '수도권대학 특성화 사업 (CK-II)': 'CK-II specialization program', '2단계 BK21 기계분야 사업단': 'BK21 Phase 2 (mechanical)',
  '학연산 클러스터(기계부품) 특성화사업': 'University–institute–industry cluster program (machine parts)', '1단계 BK21 기계분야 사업단 (서울대학교와 공동)': 'BK21 Phase 1 (mechanical, with Seoul National University)',
  '학과 연구 현황을 정리한 리서치 프로파일입니다. 그림을 누르면 상세 자료(PDF)가 열립니다.': "The department's research profile. Click the image to open the full PDF.", '2025 ERICA Research Profiles (국문)': '2025 ERICA Research Profiles (Korean)',
  // 게시판 안내
  '게시물 제목은 학과 원문(한국어) 그대로 표시합니다.': 'Post titles are shown in the original Korean.',
  '대학원·장학': 'Graduate & Scholarships', '날짜': 'Date', '석학교수': 'Distinguished', '홈페이지 ↗': 'Website ↗', '등록된 초빙교수가 없습니다': 'No visiting professors listed', '초빙교수 정보는 추후 업데이트됩니다.': 'Visiting faculty information will be added later.', '등록된 연구교수가 없습니다': 'No research professors listed', '연구교수 정보는 추후 업데이트됩니다.': 'Research faculty information will be added later.',
});
EN_RULES.push(
  [/^홈 › (.+)$/, (m, rest) => 'Home › ' + rest.split(' › ').map(x => EN[x] !== undefined ? EN[x] : x).join(' › ')],
  [/^(\d)학년$/, (m, y) => `Year ${y}`],
  [/^(\d)학기$/, (m, s) => `Sem. ${s}`],
  [/^(\d+)학점$/, (m, c) => `${c} credits`],
  [/^(\d+)명$/, (m, n) => n],
  [/^(\d{4})년 (\d+)월 – (\d+)월$/, (m, y, a, b) => `${MON[a - 1]} – ${MON[b - 1]} ${y}`],
  [/^제(\d)공학관 (.+)호$/, (m, b, r) => `Engineering Building #${b}, Room ${r}`],
);
if (LANG === 'en') addEventListener('DOMContentLoaded', () => {
  // 입력칸 안내 문구도 영어로
  document.querySelectorAll('[placeholder]').forEach(e => { const k = e.getAttribute('placeholder').trim(); if (EN[k]) e.setAttribute('placeholder', EN[k]); });
  // 게시판: 글 제목은 원문(한국어) 그대로라는 안내
  const tools = document.querySelector('main .tools');
  if (tools && document.querySelector('.btable')) { const p = document.createElement('p'); p.className = 'b-en'; p.setAttribute('data-keep', ''); p.textContent = 'Post titles are shown in the original Korean.'; tools.after(p); }
});
