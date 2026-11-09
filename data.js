// 데모 데이터. 교수진은 현행 mech.hanyang.ac.kr/people_ 의 '주요 연구분야'를 2개 키워드로 요약,
// photo는 /people_ 프로필 사진, labName·room은 /-12 연구실 페이지 기준.
// 공지·일정·뉴스·장학 금액은 예시.
const FIELDS = [
  { id: 'robot',    name: '로봇·자동화',   phrase: '로봇을 설계하고 제어합니다',       kw: '특수목적 로봇 · 소프트 로봇' },
  { id: 'semi',     name: '반도체·전자',   phrase: '반도체 장비와 공정을 연구합니다', kw: '장비 · 플라즈마 · CMP' },
  { id: 'mobility', name: '모빌리티·우주', phrase: '자율주행차와 로켓 엔진을 다룹니다', kw: '자율주행 · 로켓 터보펌프' },
  { id: 'energy',   name: '에너지·원자력', phrase: '배터리·수소·원자로를 연구합니다', kw: '배터리 · 수소 · 원자로' },
  { id: 'bio',      name: '바이오·의료',   phrase: '혈류와 세포를 기계로 풀어냅니다', kw: '혈류역학 · 미세유체' },
  { id: 'ai',       name: 'AI·디지털',     phrase: 'AI로 기계를 설계합니다',          kw: 'AI 설계 · 지능형 제조' },
  { id: 'mfg',      name: '제조·소재·구조', phrase: '3D 프린팅과 복합재를 만듭니다',   kw: '3D 프린팅 · 복합재' },
];

const PH = 'https://mech.hanyang.ac.kr/documents/11097699/';
const FACULTY = [
  { name: '윤준용', email: 'joyoon@hanyang.ac.kr', office: '5공학관 301호', pos: '교수',   kw: '전산유체역학 · 난류 제어',       fields: ['energy'],             lab: '', labName: '유체공학 연구실', labEn: 'Fluid Engineering Lab', room: '5공학관 333호', photo: PH + '0/article+%282%29.jpg/c39b0ae1-8197-ff41-af9c-4edefcfa0056?t=1698125858942&download=true' },
  { name: '이성환', email: 'sunglee@hanyang.ac.kr', office: '5공학관 401호', pos: '교수',   kw: '레이저 미세가공 · MEMS',          fields: ['semi', 'mfg'],        lab: 'https://niml.vercel.app/', labName: '나노 지능형제조 연구실', labEn: 'NIML', room: '5공학관 428호', photo: PH + '0/article+%286%29.jpg/ddaff17b-ed77-62e0-37c1-6bbbbd8b8418?t=1698126821193&download=true' },
  { name: '이도형', email: 'dohyung@hanyang.ac.kr', office: '5공학관 302호', pos: '교수',   kw: '유체기계 설계 · 신재생에너지',    fields: ['energy'],             lab: '', labName: '전산응용설계 및 유체공학 연구실', labEn: 'ACDF Lab', room: '5공학관 334호', photo: PH + '0/article+%287%29.jpg/4dbf1bcb-0630-c163-be38-b9765625cbea?t=1698126827746&download=true' },
  { name: '오제훈', email: 'jehoon@hanyang.ac.kr', office: '5공학관 402호', pos: '교수',   kw: '기계설계 · 혈류역학',             fields: ['bio', 'mfg'],         lab: 'https://amid.hanyang.ac.kr/', labName: '신소재 및 혁신설계 연구실', labEn: 'AMID Lab', room: '5공학관 227호', photo: PH + '0/article+%288%29.jpg/8a018c81-f8af-7623-a4c1-1c4fc6a7798c?t=1698128397686&download=true' },
  { name: '류근', email: 'kryu@hanyang.ac.kr', office: '5공학관 201호',   pos: '교수',   kw: '회전기계 동역학 · 로켓 터보펌프', fields: ['mobility'],           lab: 'http://turbolab.hanyang.ac.kr/', labName: '터보기계 연구실', labEn: 'Turbomachinery Lab', room: '5공학관 226호', photo: PH + '0/article+%289%29.jpg/d82f3779-3295-0012-4ea5-6377cd680ae3?t=1698128404228&download=true' },
  { name: '김영득', email: 'youngdeuk@hanyang.ac.kr', office: '5공학관 207호', pos: '교수',   kw: '해수담수화 · 가스 정화 공정',     fields: ['energy'],             lab: 'http://eee.hanyang.ac.kr/', labName: '에너지 및 환경공학 연구실', labEn: 'EEE Lab', room: '5공학관 329호', photo: PH + '0/article+%2810%29.jpg/e433afd5-74ec-73d3-904e-be65800388e5?t=1698128411362&download=true' },
  { name: '윤종헌', email: 'jyoon@hanyang.ac.kr', office: '5공학관 206호', pos: '교수',   kw: '금속 성형 · 3D 프린팅',           fields: ['mfg', 'bio'],         lab: 'http://champ.hanyang.ac.kr/', labName: '하이브리드 소재성형 연구실', labEn: 'CHAMP Lab', room: '5공학관 221호', photo: PH + '0/article+%2811%29.jpg/ed57af44-6582-0eb8-242d-5cbb90ae149e?t=1772588816565&download=true' },
  { name: '이원철', email: 'wonchullee@hanyang.ac.kr', office: '5공학관 214호', pos: '교수',   kw: '나노바이오 기계시스템 · 미세유체', fields: ['bio', 'semi'],       lab: 'https://sites.google.com/site/nanobiohanyang', labName: '나노바이오 기계시스템 연구실', labEn: 'NanoBio Lab', room: '5공학관 217호', photo: PH + '0/article+%2812%29.jpg/02691a68-6fac-b830-e519-4f991a00512a?t=1698128956949&download=true' },
  { name: '김남욱', email: 'nwkim@hanyang.ac.kr', office: '5공학관 208호', pos: '교수',   kw: '친환경차 · 자율주행 제어',        fields: ['mobility', 'ai'],     lab: 'https://sites.google.com/view/mdlhyu/', labName: '기계역학 연구실', labEn: 'Machine Dynamics Lab', room: '5공학관 208호', photo: PH + '0/article+%2813%29.jpg/5b199b7e-9695-fce8-25aa-2f291901e438?t=1698128965139&download=true' },
  { name: '홍석준', email: 'sukjoonhong@hanyang.ac.kr', office: '5공학관 209호', pos: '교수',   kw: '레이저 나노소재 공정',            fields: ['semi', 'mfg'],        lab: 'https://sites.google.com/site/onlhanyang/', labName: '나노광공정 연구실', labEn: 'Optical Nanoprocessing Lab', room: '5공학관 221-1호', photo: PH + '0/article+%2814%29.jpg/a1d36647-81b7-e8e4-ed5f-92df5bf13e1a?t=1698128973814&download=true' },
  { name: '오준호', email: 'junhooh@hanyang.ac.kr', office: '5공학관 204호', pos: '부교수', kw: '상변화 열전달 · 열관리 시스템',   fields: ['energy'],             lab: 'https://better.hanyang.ac.kr/', labName: '자연모사 열전달 연구실', labEn: 'BETTER Lab', room: '5공학관 502호', photo: PH + '0/article+%2816%29.jpg/806d3fa6-090a-f81a-5d3c-437252ba4863?t=1698130489738&download=true' },
  { name: '김호준', email: 'hojunkim9158@hanyang.ac.kr', office: '5공학관 205-1호', pos: '교수',   kw: '반도체·디스플레이 장비 · 플라즈마', fields: ['semi'],             lab: 'http://csppl.hanyang.ac.kr/', labName: '카오스 시스템 및 플라즈마 물리 연구실', labEn: 'CSPP Lab', room: '5공학관 205-1호', photo: PH + '0/article+%2817%29.jpg/3de856b3-6ec3-36e4-954f-230d2c9a1fab?t=1698130495509&download=true' },
  { name: '김진용', email: 'jinyongkim@hanyang.ac.kr', office: '5공학관 502호', pos: '조교수', kw: '배터리 열관리 · 열폭주 해석',     fields: ['energy', 'mobility'], lab: 'https://real.hanyang.ac.kr', labName: '신재생 엔진 해석 연구실', labEn: 'REAL', room: '5공학관 427호', photo: PH + '0/article+%2818%29.jpg/2a0c635c-7e17-4bdf-b7bf-567f1343cea0?t=1698130502972&download=true' },
  { name: '최이현', email: 'krone@hanyang.ac.kr', office: '5공학관 303호', pos: '조교수', kw: '소프트 로보틱스 · 고분자 공정',   fields: ['robot', 'bio'],       lab: '', labName: '최이현 교수 연구실', labEn: 'A LAB', room: '5공학관 303호', photo: PH + '0/article+%2836%29.jpg/f467548b-6922-7c60-a845-b84d5f683182?t=1730808873727&download=true' },
  { name: '노형도', email: 'rhd1213@hanyang.ac.kr', office: '5공학관 403호', pos: '조교수', kw: '복합재 · AI 구조 건전성 진단',    fields: ['mfg', 'ai'],          lab: 'https://rhd1213.github.io/', labName: '스마트 복합재료 연구실', labEn: 'R Lab', room: '5공학관 228호', photo: PH + '0/article+%2820%29.jpg/b729efe9-614e-123a-6b4d-66b77632966b?t=1698131016838&download=true' },
  { name: '김태균', email: 'taegyunkim@hanyang.ac.kr', office: '5공학관 205-2호', pos: '부교수', kw: '특수목적 로봇 · 스마트팩토리',    fields: ['robot'],              lab: 'https://sites.google.com/hanyang.ac.kr/irslab/', labName: '지능형 로봇시스템 연구실', labEn: 'IRS Lab', room: '5공학관 231호', photo: PH + '0/article+%2837%29.jpg/07e20080-b67e-e68c-f73e-49f1db08107d?t=1730808946493&download=true' },
  { name: '박지혁', email: 'jihyuk@hanyang.ac.kr', office: '5공학관 210호', pos: '부교수', kw: '극한환경 로봇 · 메카트로닉스',    fields: ['robot', 'energy'],    lab: 'https://mesy.hanyang.ac.kr', labName: '메카트로닉스 시스템 연구실', labEn: 'MESY Lab', room: '5공학관 210호', photo: PH + '0/Photo-%EB%B0%95%EC%A7%80%ED%98%81%EA%B5%90%EC%88%98%EB%8B%98-2026.jpg/805a0962-4c8f-cce6-5511-59c9c913b053?t=1774405338109&download=true' },
  { name: '박주현', email: 'joohyunpark@hanyang.ac.kr', office: '5공학관 203호', pos: '조교수', kw: '차세대 원자로 · 수소 에너지',     fields: ['energy'],             lab: 'https://mars.hanyang.ac.kr', labName: '다물리 열시스템 연구실', labEn: 'MARS Lab', room: '5공학관 203호', photo: PH + '0/Photo-%EB%B0%95%EC%A3%BC%ED%98%84%EA%B5%90%EC%88%98%EB%8B%98-2026.jpg/8a5e5991-c83e-4c22-e5bd-9b5117efb855?t=1774313251342&download=true' },
  { name: '양선웅', email: 'sunwoongy@hanyang.ac.kr', office: '5공학관 211호', pos: '조교수', kw: '기계설계 · AI',                   fields: ['ai'],                 lab: 'https://idealab.hanyang.ac.kr', labName: '지능형 공학설계 연구실', labEn: 'IDEA Lab', room: '5공학관 211호', photo: PH + '0/Photo-%EC%96%91%EC%84%A0%EC%9B%85%EA%B5%90%EC%88%98%EB%8B%98-2026.jpg/61e5a9af-4a22-e63d-d8e7-c625a6b85f0c?t=1774313218408&download=true' },
  { name: '강석경', email: 'skkang00@hanyang.ac.kr', office: '5공학관 213호', pos: '조교수', kw: '반도체 CMP · AI 지능형 제조',     fields: ['semi', 'ai', 'mfg'],  lab: 'https://manufuture.hanyang.ac.kr', labName: '미래 제조기술 연구실', labEn: 'ManuFuture Lab', room: '5공학관 223호', photo: PH + '864850882/sukkyung-kang.jpg/1f925746-006d-4eec-ef30-de4e99089af9?t=1788394518595&download=true' },
];

// 연구실 대표사진 자리: 지금은 분야별 Wikimedia Commons 사진(임시). 실제 연구실 사진으로 교체 예정.
const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
const HERO_IMG = WM + '9/95/Diff_gear-grayscale.jpg/1280px-Diff_gear-grayscale.jpg';
const T = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/';
// 분야를 한눈에 알아볼 수 있는 대표 사진 (Wikimedia Commons, 임시 — 학과 실제 사진으로 교체 예정)
// 첫 화면에서 사진 두 장을 나란히 보여줄 분야 (제조: 밀링 + 소재)
const FIELD_DUAL = {};
// 첫 화면 사진 위치(피사체가 문구에 가리지 않게)
const FIELD_POS = { mobility: '70% 12%', energy: '70% 35%', robot: '50% 45%', mfg: '70% 50%' };
const FIELD_IMG = {
  robot:    ['https://upload.wikimedia.org/wikipedia/commons/6/67/BMW_Leipzig_MEDIA_050719_Download_Karosseriebau_max.jpg',
             'https://images.unsplash.com/photo-1637002722490-5f8ceed9774c?auto=format&fit=crop&w=1920&q=80'],
  semi:     ['https://images.unsplash.com/photo-1587845323226-bad89242c735?auto=format&fit=crop&w=1920&q=80',
             'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1920&q=80'],
  mobility: [T + '4/4b/STS-125_Atlantis_Liftoff_02.jpg/1920px-STS-125_Atlantis_Liftoff_02.jpg',
             T + 'c/c7/Space_Shuttle_Atlantis_launches_from_KSC_on_STS-132.jpg/1920px-Space_Shuttle_Atlantis_launches_from_KSC_on_STS-132.jpg'],
  energy:   ['https://images.unsplash.com/photo-1630142895963-6996ae6b3a5b?auto=format&fit=crop&w=1920&q=80',
             'https://images.unsplash.com/photo-1772376920820-4fb715c21e79?auto=format&fit=crop&w=1920&q=80'],
  bio:      ['https://upload.wikimedia.org/wikipedia/commons/0/04/Vantage_Atlas_MRI_scanner_from_Toshiba.jpg',
             T + '2/2d/An_MRI_scanner.JPG/1920px-An_MRI_scanner.JPG'],
  ai:       ['https://images.unsplash.com/photo-1737644467636-6b0053476bb2?auto=format&fit=crop&w=1920&q=80',
             'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80'],
  mfg:      ['https://images.unsplash.com/photo-1666634157070-6fd830fb5672?auto=format&fit=crop&w=1920&q=80',
             'https://images.unsplash.com/photo-1740209475472-aa7d280f7452?auto=format&fit=crop&w=1920&q=80'],
};
const LAB_IMG = {
  '윤준용': T + 'a/a1/HSW_1000_wind_turbine_close_up_in_the_wind_farm_Schwesing.jpg/1920px-HSW_1000_wind_turbine_close_up_in_the_wind_farm_Schwesing.jpg',
  '이성환': 'https://niml.vercel.app/_next/image?url=%2Fresearch%2Fresearch-workflow-hero-v3.png&w=1920&q=75',
  '이도형': T + '6/64/Wind_turbine_close-up_%284613873354%29.jpg/1920px-Wind_turbine_close-up_%284613873354%29.jpg',
  '오제훈': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/An_MRI_scanner.JPG/1920px-An_MRI_scanner.JPG',
  '류근': T + 'd/dd/Raptor-test-9-25-2016.jpg/1920px-Raptor-test-9-25-2016.jpg',
  '김영득': T + 'f/ff/Gear_Island_Water_Treatment_Plant_-_MC.jpg/1920px-Gear_Island_Water_Treatment_Plant_-_MC.jpg',
  '윤종헌': T + '2/22/MELT_3D_printer_ESA401434.jpg/1920px-MELT_3D_printer_ESA401434.jpg',
  '이원철': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Microfluidic_chip_for_point-of-care_medical_devices.jpg/1920px-Microfluidic_chip_for_point-of-care_medical_devices.jpg',
  '김남욱': T + 'c/cf/Waymo_self-driving_car_front_view.gk.jpg/1920px-Waymo_self-driving_car_front_view.gk.jpg',
  '홍석준': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/EPROM_Microchip_SuperMacro.jpg/1920px-EPROM_Microchip_SuperMacro.jpg',
  '오준호': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Cooling_tower_of_the_G%C3%B6sgen_Nuclear_Power_Plant%2C_close_view%2C_D%C3%A4niken%2C_Solothurn.jpg/1920px-Cooling_tower_of_the_G%C3%B6sgen_Nuclear_Power_Plant%2C_close_view%2C_D%C3%A4niken%2C_Solothurn.jpg',
  '김호준': T + '6/6d/CNE_cleanroom_1.jpg/1920px-CNE_cleanroom_1.jpg',
  '김진용': 'https://real.hanyang.ac.kr/assets/img/article%2014%20figure.png',
  '최이현': T + 'f/f6/Star_Wars_Bionic_hand.jpg/1920px-Star_Wars_Bionic_hand.jpg',
  '노형도': T + '6/64/Carbon_fiber_roving.jpg/1920px-Carbon_fiber_roving.jpg',
  '김태균': 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=1920&q=80',
  '박지혁': T + '0/0a/Anymal-robot-inspection-power-grid.jpg/1920px-Anymal-robot-inspection-power-grid.jpg',
  '박주현': 'https://images.unsplash.com/photo-1772376920820-4fb715c21e79?auto=format&fit=crop&w=1920&q=80',
  '양선웅': 'https://idealab.hanyang.ac.kr/images/Research%20Overview_260209.png',
  '강석경': 'https://manufuture.hanyang.ac.kr/media/research/semiconductor-packaging_hu_d4416faf609e3e2c.jpeg',
};
FACULTY.forEach(f => { f.img = LAB_IMG[f.name] || FIELD_IMG[f.fields[0]][0]; });

const TODAY = '2026-11-07';
const NOTICE_CATS = ['학부', '대학원', '장학', '취업'];
const NOTICES = [
  { cat: '학부',   title: '2027학년도 라이언스칼리지 전공진입 설명회 안내',      date: '2026-11-05', pin: true,  file: true },
  { cat: '대학원', title: '2027학년도 전기 대학원 신입생 모집 요강',             date: '2026-11-03', pin: true,  file: true },
  { cat: '장학',   title: '2026-2학기 대학원 BK21 연구장학생 선발 결과',         date: '2026-11-06', pin: false, file: false },
  { cat: '학부',   title: '2026-2학기 캡스톤디자인1 중간발표 일정 및 조 배정',   date: '2026-11-04', pin: false, file: true },
  { cat: '취업',   title: '모빌리티 R&D 부문 신입 채용설명회 (학과 세미나실)',   date: '2026-11-02', pin: false, file: false },
  { cat: '대학원', title: '정기 세미나 — AI 기반 공학설계의 현재와 미래',        date: '2026-11-01', pin: false, file: false },
  { cat: '학부',   title: '겨울방학 학부연구생 모집 (20개 연구실)',              date: '2026-10-30', pin: false, file: true },
  { cat: '장학',   title: '2027-1학기 학부 성적우수장학금 신청 안내',            date: '2026-10-28', pin: false, file: true },
  { cat: '취업',   title: '반도체 장비 기업 동계 현장실습 모집',                 date: '2026-10-27', pin: false, file: false },
  { cat: '대학원', title: '2026-2학기 학위청구논문 심사 일정',                   date: '2026-10-25', pin: false, file: true },
  { cat: '학부',   title: '2027-1학기 전공 교과목 수강 안내 및 선수과목 체계',   date: '2026-10-22', pin: false, file: true },
  { cat: '취업',   title: '에너지 공기업 직무 특강 — 기계직 선배와의 대화',      date: '2026-10-20', pin: false, file: false },
];

const SCHEDULE = [
  { date: '11.12', tag: '학부',   title: '학부 세미나 — 로봇 회사 엔지니어의 하루' },
  { date: '11.14', tag: '전공진입', title: '라이언스칼리지 전공진입 설명회' },
  { date: '11.20', tag: '대학원', title: '대학원 입학설명회 · 오픈랩 투어' },
  { date: '11.28', tag: '학부',   title: '캡스톤디자인 중간발표회' },
];

const NEWS = [
  { tag: '학생활동', title: '자동차연구회 BAQU4, 자작자동차 대회 입상', icon: 'car' },
  { tag: '교수진',   title: '2026년 신임 교수 4명 임용 — 로봇·원자력·AI·반도체', icon: 'people' },
  { tag: '교육',     title: '실무형 CAE 실습: CATIA · ANSYS · FLUENT', icon: 'cube' },
];
