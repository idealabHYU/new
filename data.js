// 데모 데이터. 교수진은 현행 mech.hanyang.ac.kr/people_ 의 '주요 연구분야'를 2개 키워드로 요약,
// photo는 /people_ 프로필 사진, labName·room은 /-12 연구실 페이지 기준.
// 공지·일정·뉴스·장학 금액은 예시.
const FIELDS = [
  { id: 'robot',    name: '로봇·자동화',   phrase: '로봇을 설계하고 제어합니다',       kw: '특수목적 로봇 · 소프트 로봇' },
  { id: 'semi',     name: '반도체·전자',   phrase: '반도체 장비와 공정을 연구합니다', kw: '장비 · 플라즈마 · CMP' },
  { id: 'mobility', name: '모빌리티·우주', phrase: '자율주행차와 로켓 엔진을 다룹니다', kw: '자율주행 · 로켓 터보펌프' },
  { id: 'energy',   name: '에너지·원자력', phrase: '배터리·수소·원자로를 연구합니다', kw: '배터리 · 수소 · 원자로' },
  { id: 'bio',      name: '바이오·의료',   phrase: '혈류와 세포를 기계로 풀어냅니다', kw: '혈류역학 · 미세유체' },
  { id: 'ai',       name: '인공지능',       phrase: 'AI로 기계를 설계합니다',          kw: 'AI 설계 · 지능형 제조' },
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

// 교수진 묶음: 4대 역학 + 설계 + 생산 (2026-11-26 학과 지정). 교수진 페이지의 분류 버튼과 연구실 카드의 꼬리표에 사용.
const GROUPS = [
  { id: 'solid', name: '고체역학' }, { id: 'thermo', name: '열역학' }, { id: 'fluid', name: '유체역학' },
  { id: 'dyn', name: '동역학' }, { id: 'design', name: '설계' }, { id: 'prod', name: '생산' },
];
const GROUP_OF = {
  '윤준용': 'fluid', '이성환': 'prod', '이도형': 'fluid', '오제훈': 'solid', '류근': 'design', '김영득': 'thermo', '윤종헌': 'prod',
  '이원철': 'solid', '김남욱': 'dyn', '홍석준': 'fluid', '오준호': 'thermo', '김호준': 'fluid', '김진용': 'thermo', '최이현': 'design',
  '노형도': 'solid', '김태균': 'dyn', '박지혁': 'dyn', '박주현': 'thermo', '양선웅': 'design', '강석경': 'prod',
};
FACULTY.forEach(f => { f.grp = GROUP_OF[f.name]; f.grpName = (GROUPS.find(g => g.id === f.grp) || {}).name || ''; });

// 사진: 전부 Unsplash 무료 라이선스 사진(상업적 이용 가능 · 출처 표기 불필요). 강석경 교수 카드만 연구실 홈페이지 사진.
// U(id, 너비, 높이, [초점x, 초점y]) — 화면에 쓰이는 크기만큼만 받아서 가볍게.
const U = (id, w = 1600, h = 0, fp) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? '&h=' + h : ''}${fp ? `&crop=focalpoint&fp-x=${fp[0]}&fp-y=${fp[1]}${fp[2] ? '&fp-z=' + fp[2] : ''}` : ''}&q=72`;
const SZ = (u, w) => u && u.includes('images.unsplash.com') ? u.replace(/([?&])w=\d+/, `$1w=${w}`) : u;
const PIC = {
  robots:     '1647427060118-4911c9821b82',   // 산업용 로봇이 늘어선 자동화 공장
  robotArm:   '1655393001768-d946c97d6fd1',   // 흰색 로봇 팔
  wafer:      '1587845323226-bad89242c735',   // 반도체 웨이퍼 확대
  wafers:     '1717962688747-7e13dfa31538',   // 무지갯빛 웨이퍼 두 장
  rocket:     '1516849841032-87cbac4d88f7',   // 로켓 발사
  rocket2:    '1518364538800-6bae3c2ea0f2',   // 로켓 발사(정면)
  cooling:    '1630142895963-6996ae6b3a5b',   // 발전소 냉각탑
  plant:      '1772376920820-4fb715c21e79',   // 원자력 발전소 전경
  ct:         '1666214280352-db292c05fd80',   // 의료 영상 장비
  mri:        '1693264882139-6a308957c9ae',   // MRI 장비
  aiFace:     '1737644467636-6b0053476bb2',   // 휴머노이드(검은 배경)
  aiChip:     '1697577418970-95d99b5a55cf',   // AI 칩
  aiBrain:    '1753513291124-4f615bf1f6de',   // 칩 위에 떠 있는 두뇌(어두운 배경) — 첫 화면 인공지능
  lathe:      '1666634157070-6fd830fb5672',   // CNC 선반 가공
  milling:    '1740209475472-aa7d280f7452',   // CNC 밀링 가공
  carLine:    '1777383975764-bec6f5cabf00',   // 자동차 차체 조립 라인
  jet:        '1759610900660-b86f99e57c10',   // 비행 중인 전투기
};
const FIELD_DUAL = {};
// 첫 화면 사진 위치: 문구가 왼쪽에 있으므로 피사체가 오른쪽에 오도록
const FIELD_POS = { robot: '60% 50%', semi: '50% 50%', mobility: '80% 55%', energy: '70% 85%', bio: '72% 50%', mfg: '65% 50%' };
const FIELD_IMG = {
  robot:    [U(PIC.robotArm), U(PIC.robots)],     // 첫 화면: 흰색 로봇 팔
  semi:     [U(PIC.wafer),   U(PIC.wafers)],
  mobility: [U(PIC.rocket),  U(PIC.rocket2)],
  energy:   [U(PIC.cooling), U(PIC.plant)],
  bio:      [U(PIC.ct),      U(PIC.mri)],
  ai:       [U(PIC.aiBrain), U(PIC.aiChip)],      // 첫 화면: 두뇌 + 칩 (휴머노이드 얼굴 사진은 타 대학 사이트와 겹쳐 교체)
  mfg:      [U(PIC.lathe),   U(PIC.milling)],
};
// 홈 '8개 산업' 사진: 자동차 · 반도체 · 인공지능 · 항공우주 · 원자력 · 국방 · 로봇 · 바이오
const SHOW_IMG = [PIC.carLine, PIC.wafers, PIC.aiChip, PIC.rocket2, PIC.plant, PIC.jet, PIC.robots, PIC.mri];
// 연구실 대표 사진: 교수별 연구 키워드에 맞춘 사진 [id, 초점x, 초점y, 확대]. 어둡거나 추상적인 사진은 쓰지 않음
const LAB_PIC = {
  '윤준용': ['1583030225577-329fe6cc80d6'],            // 소용돌이치는 물 — 유체역학 · 난류
  '이성환': ['1735494033576-9c882e80504c'],            // 레이저 가공 — 레이저 미세가공
  '이도형': ['1548337138-e87d889cc369'],               // 해상 풍력 — 유체기계 · 신재생에너지
  '오제훈': ['1623134915837-d2fdb4f59035'],            // 심장 모형 — 혈류역학
  '류근':   ['1762208743487-11a4775c12f2'],            // 터보팬 엔진 — 회전기계 · 터보펌프
  '김영득': ['1644389355109-15b26f71c36b'],            // 수처리 플랜트 — 해수담수화 · 정화 공정
  '윤종헌': ['1741848137437-56fb14b7ba87'],            // 부품을 찍어내는 3D 프린터 — 3D 프린팅
  '이원철': ['1579165467219-b648fd10237e'],            // 칩 위 피펫 — 나노바이오 · 미세유체
  '김남욱': ['1555550252-fc3187f10240'],            // 미래형 친환경 콘셉트카 — 자동차 · 모빌리티
  '홍석준': ['1574232889174-1a6051231cf6'],            // 광학 테이블 위 레이저 장비 — 레이저 공정
  '오준호': ['1446608943998-cbd52b140335'],            // 잎 위 물방울 — 자연모사 · 상변화 열전달
  '김호준': ['1507413245164-6160d8298b31'],            // 플라즈마
  '김진용': ['1742899273038-67ff67477663'],            // 배터리 셀 — 배터리 열관리
  '최이현': ['1682159672286-40790338349b', .6, .5],    // 사람 손과 맞닿는 로봇 손 — 소프트 로보틱스
  '노형도': ['1771423406994-bb335b5ccd6f'],            // 탄소섬유 직조 — 복합재
  '김태균': ['1716191299980-a6e8827ba10b'],            // 공장의 산업용 로봇 — 특수목적 로봇 · 스마트팩토리
  '박지혁': ['1639782792143-d8ce97e5d330', .42, .5],   // 화성 탐사 로버 — 극한환경 로봇
  '박주현': ['1630142896875-d71a6ee6db03'],            // 원전 냉각탑 — 차세대 원자로
};
// 직접 지정하는 사진: 강석경 = 연구실 홈페이지 사진, 양선웅 = Unsplash 사진 2장('AI' 칩 + 설계 도면·가공 부품)을 합성한 img/lab-ai-design.jpg
const LAB_SITE_IMG = {
  '강석경': 'https://manufuture.hanyang.ac.kr/media/research/semiconductor-packaging_hu_d4416faf609e3e2c.jpeg',
  '양선웅': 'img/lab-ai-design.jpg',
};
// 카드(340×420) 크기에 맞춘 세로 사진만 받음
FACULTY.forEach(f => { const p = LAB_PIC[f.name]; f.img = LAB_SITE_IMG[f.name] || (p ? U(p[0], 680, 840, p[1] != null ? [p[1], p[2], p[3]] : null) : U(PIC.lathe, 680, 840)); });

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

// 학과 소식: 뉴스H 기사를 학과에서 직접 요약한 글. 홈에서는 news.html?n=번호 요약 페이지로 가고, 원문은 그 아래 링크로 연결.
// 요약은 원문에 있는 사실만 짧게 옮김(새 기사를 넣을 때도 원문에 없는 내용은 쓰지 않기).
const NEWS_MORE = 'https://www.newshyu.com/news/articleList.html?sc_area=A&view_type=sm&sc_word=%EA%B8%B0%EA%B3%84%EA%B3%B5%ED%95%99%EA%B3%BC';
const NEWS = [
  { cat: '연구 성과', date: '2026.03.24', fi: 'semi', url: 'https://www.newshyu.com/news/articleView.html?idxno=1023461',
    title: "홍석준 교수, 한국연구재단 '한우물파기 기초연구' 선정",
    lead: "기계공학과 홍석준 교수가 2026년 3월 초 한국연구재단의 '한우물파기 기초연구' 과제에 선정됐습니다.",
    pts: ['한 가지 연구 주제를 오랫동안 깊이 파고들 수 있도록 돕는 사업으로, 연간 약 1억 6천만 원을 최대 10년간 지원합니다.',
          '전국에서 20명 미만의 연구자만 선정되는 것으로 알려져 있습니다.',
          "홍 교수는 세계 상위 2% 연구자로, 주변 환경에 따라 색이 바뀌는 '카멜레온 로봇'과 레이저로 색을 구현하는 기술 등을 연구해 왔습니다.",
          '이번 선정을 계기로 이 분야 연구를 장기간 이어갈 계획입니다.'] },
  { cat: '우주공학', date: '2025.07.07', fi: 'mobility', url: 'https://www.newshyu.com/news/articleView.html?idxno=1019367',
    title: "국내 최초 '국제우주대학 우주연구 프로그램(SSP25)' ERICA에서 개최",
    lead: '국제우주대학 우주연구 프로그램(SSP25)이 2025년 6월 30일 ERICA 캠퍼스에서 개막했습니다. 국내에서는 처음, 아시아에서는 네 번째로 열린 행사입니다.',
    pts: ['37개국에서 123명이 참가해 핵심 강의, 분과별 활동, 팀 프로젝트를 8주 동안 진행합니다.',
          '우주공학 관련 기관 견학과 로켓 발사 행사 같은 실습 프로그램도 포함됩니다.',
          'ERICA는 기계공학과 류근 교수, 로봇공학과 최영진 교수 등의 연구력을 바탕으로 일반대학원 우주공학과를 신설했고, 2026학년도에 첫 신입생을 모집합니다.'] },
  { cat: '취업', date: '2024.03.25', fi: 'robot', url: 'https://www.newshyu.com/news/articleView.html?idxno=1013659',
    title: '한양대 ERICA, 취업률 71.3%로 전국 4년제 대학 7위',
    lead: 'ERICA 캠퍼스가 2023년 정보공시 취업통계(졸업생 2,000명 이상 4년제 대학 기준)에서 취업률 71.3%로 전국 7위를 기록했습니다.',
    pts: ['현행 조사 방식이 도입된 2015년 이후 가장 높은 취업률입니다.',
          '코로나 영향으로 62.8%까지 떨어졌던 2021년 공시와 비교해 빠르게 회복했습니다.',
          '1~4학년이 모두 듣는 취업 교과목, 학과별 취업 · 진로 지도교수제, 활발한 현장실습이 배경으로 꼽힙니다.',
          '현장실습에 참여한 학생의 취업률은 83%였습니다(대학 자체 조사).'] },
];
