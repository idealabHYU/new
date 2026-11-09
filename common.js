// 공통 헤더·푸터. 메뉴 구성은 현행 mech.hanyang.ac.kr 그대로 (6개 대메뉴).
// 주소를 따로 적지 않은 항목은 sub.html?m=&s= 하위 페이지로 연결
const MENU = [
  { name: '소개',   subs: [['학과소개'], ['학과장 인사말'], ['교수진', 'faculty.html'], ['연혁'], ['방문안내']] },
  { name: '입학',   subs: [['학부'], ['대학원']] },
  { name: '학부',   subs: [['교과과정'], ['전공이수체계도'], ['학사안내'], ['학생활동'], ['학사일정'], ['장학안내']] },
  { name: '대학원', subs: [['교과과정'], ['학위취득 로드맵'], ['학사안내'], ['논문심사'], ['학사일정'], ['장학안내']] },
  { name: '연구',   subs: [['연구실'], ['사업단'], ['리서치 프로파일']] },
  { name: '게시판', subs: [['학부 공지사항', 'board.html?c=학부'], ['대학원 공지사항', 'board.html?c=대학원'], ['취업정보', 'board.html?c=취업'], ['갤러리'], ['자료실'], ['행사일정']] },
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
  const [k, i] = SH_IMG[active] || ['robot', 0]; sh.style.setProperty('--sh-img', `url("${FIELD_IMG[k][i]}")`);
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
      <ul class="menu">${top}</ul>
      <div class="utl">
        <a href="https://ieng.hanyang.ac.kr/home" target="_blank" rel="noopener">공학대학</a>
        <a href="https://portal.hanyang.ac.kr/sso/lgin.do" target="_blank" rel="noopener">HY-in</a>
        <a href="https://hy-mooc.hanyang.ac.kr/hy-mooc" target="_blank" rel="noopener">HY-ON</a>
        <a class="lang" href="#" onclick="toggleLang(event)" data-keep>${LANG === 'en' ? 'KO' : 'EN'}</a>
      </div>
      <button class="burger" aria-label="메뉴" onclick="document.body.classList.toggle('open')">☰</button>
    </div>
  </header>`;
  const items = document.querySelectorAll('.menu > li');
  const closeAll = except => items.forEach(li => { if (li !== except) { li.classList.remove('open'); li.querySelector('.top').setAttribute('aria-expanded', 'false'); } });
  items.forEach(li => li.querySelector('.top').addEventListener('click', e => {
    e.stopPropagation();
    closeAll(li);
    const open = li.classList.toggle('open');
    li.querySelector('.top').setAttribute('aria-expanded', open);
  }));
  // 메뉴 하나에 마우스를 올리면 모든 메뉴의 하위 목록이 한 번에 펼쳐짐 (헤더를 벗어나면 닫힘)
  const gnb = document.querySelector('.gnb');
  document.querySelector('.menu').addEventListener('mouseenter', () => gnb.classList.add('mega'));
  gnb.addEventListener('mouseleave', () => gnb.classList.remove('mega'));
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
}

function renderFooter() {
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
  '대학원 공지사항': 'Graduate Notices', '취업정보': 'Careers', '갤러리': 'Gallery', '자료실': 'Archive', '행사일정': 'Events',
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
  '자동차연구회 BAQU4 자작자동차 대회': 'BAQU4 team, student-built vehicle contest', '졸업생 취업률': 'Graduate employment rate', '취업률 71.3%': 'Employment rate 71.3%', 'ERICA 2023 정보공시 · 전국 7위': 'ERICA, 2023 public data · 7th nationwide', '대표 진출처': 'Where graduates go', '하나의 전공, 8개 산업으로': 'One major, eight industries', '졸업 후 진로 보기': 'See careers', '학과 소식': 'News', '우주공학': 'Space', '주소': 'Address', '뉴스 더 보기': 'More news', '연구 성과': 'Research', '취업': 'Careers', '1979년부터 이어온 한양대학교 ERICA 기계공학과를 소개합니다.': 'Hanyang University ERICA Mechanical Engineering, since 1979.', '학부와 대학원 입학 정보를 한눈에 안내합니다.': 'Undergraduate and graduate admissions at a glance.', '4년 교육과정과 학사 정보를 안내합니다.': 'Four-year curriculum and academic information.', '석·박사 과정과 장학 제도를 안내합니다.': 'M.S./Ph.D. programs and scholarships.', '연구실과 BK21 교육연구단을 소개합니다.': 'Our labs and the BK21 program.', '학과 소식과 자료를 확인하세요.': 'Department news and resources.', '기계공학 전공자는': 'Mechanical engineers', '어디서 일할까요?': 'where do they work?', '예시': 'sample',
  // 분야
  '로봇·자동화': 'Robotics & Automation', '반도체·전자': 'Semiconductors & Electronics', '모빌리티·우주': 'Mobility & Space',
  '에너지·원자력': 'Energy & Nuclear', '환경·플랜트': 'Environment & Plant', '바이오·의료': 'Bio & Medical',
  'AI·디지털': 'AI & Digital', '제조·소재·구조': 'Manufacturing & Materials',
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
  '연구실 둘러보기': 'Explore Our Labs', '전체 교수진 · 연구실 보기 →': 'All faculty & labs →', '지도교수': 'Advisor', '위치': 'Location',
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
  [/^5공학관 (.+)호$/, (m, r) => `Eng. Bldg 5, Rm ${r}`],
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
