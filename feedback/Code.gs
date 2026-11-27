/**
 * 기계공학과 홈페이지 피드백 — 저장용 구글 Apps Script (코멘트 묶음 · 본인 글 삭제 지원)
 *
 * 하는 일: 피드백 글을 구글 시트에, 사진·파일을 구글 드라이브 폴더에 '원본 그대로' 저장하고,
 *          피드백 사이트(GitHub 페이지)가 이 스크립트 주소로 글 목록·파일을 주고받게 합니다.
 *
 * 설정 순서 (처음 한 번, 약 5분) — 자세한 그림 설명은 사이트의 '설정 안내' 참고
 *  1. https://script.new 접속 → 이 파일 내용 전체를 붙여넣기 (기존 내용은 지움)
 *  2. 아래 ADMIN_CODE 를 원하는 관리자 암호로 바꾸기 (선택: ACCESS_CODE 도 설정)
 *  3. 위쪽 함수 선택 칸에서 setup 선택 → 실행 → 권한 허용 (시트와 폴더가 자동으로 만들어짐)
 *  4. 배포 → 새 배포 → 유형 '웹 앱' → 실행 계정 '나', 액세스 권한 '모든 사용자' → 배포
 *  5. 나온 '웹 앱 URL'(…/exec 로 끝남)을 복사해서 Claude에게 알려주기
 */

const ADMIN_CODE = 'change-me';   // 관리자 암호: '반영 완료' 표시 · 글 삭제에 필요. 꼭 바꾸세요.
const ACCESS_CODE = '';           // 입장 암호(선택): 비워 두면 링크를 아는 사람은 누구나 쓰고 볼 수 있음.
const MAX_FILE_MB = 25;           // 파일 하나의 최대 크기

const P = PropertiesService.getScriptProperties();

/** 처음 한 번 실행: 저장용 시트와 드라이브 폴더를 만든다. 다시 실행해도 새로 만들지 않는다. */
function setup() {
  let ssId = P.getProperty('SHEET_ID'), folderId = P.getProperty('FOLDER_ID');
  if (!ssId) {
    const ss = SpreadsheetApp.create('기계공학과 홈페이지 피드백');
    const a = ss.getSheets()[0]; a.setName('피드백');
    a.appendRow(['id', '작성 시각', '교수', '대상 페이지', '내용', '상태', '첨부 파일 id', '관리자 메모']);
    const f = ss.insertSheet('파일');
    f.appendRow(['파일 id', '피드백 id', '파일 이름', '크기(byte)', '종류', '드라이브 파일 id', '작은 미리보기', '올린 시각']);
    a.setFrozenRows(1); f.setFrozenRows(1);
    ssId = ss.getId(); P.setProperty('SHEET_ID', ssId);
  }
  if (!folderId) {
    folderId = DriveApp.createFolder('기계공학과 홈페이지 피드백 — 첨부 파일').getId();
    P.setProperty('FOLDER_ID', folderId);
  }
  Logger.log('시트: https://docs.google.com/spreadsheets/d/' + ssId);
  Logger.log('폴더: https://drive.google.com/drive/folders/' + folderId);
  Logger.log('이제 [배포 → 새 배포 → 웹 앱]을 진행하세요.');
}

const sheet = name => SpreadsheetApp.openById(P.getProperty('SHEET_ID')).getSheetByName(name);
const out = obj => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
const uid = () => Utilities.getUuid().replace(/-/g, '').slice(0, 12);
const okAccess = code => !ACCESS_CODE || code === ACCESS_CODE;
const okAdmin = code => ADMIN_CODE && ADMIN_CODE !== 'change-me' && code === ADMIN_CODE;

function doGet(e) {
  try {
    const q = e.parameter || {};
    if (!P.getProperty('SHEET_ID')) return out({ ok: false, error: 'setup 을 먼저 실행하세요.' });
    if (q.action === 'ping') return out({ ok: true, needCode: !!ACCESS_CODE });
    return out({ ok: false, error: '알 수 없는 요청' });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

/** 교수님: 글 등록, 본인 글 보기 · 수정.  관리자(ADMIN_CODE): 전체 목록 · 원본 받기 · 상태 · 답변 · 삭제. */
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (!okAccess(b.code)) return out({ ok: false, error: 'code' });
    if (b.action === 'check') return out({ ok: true });
    if (b.action === 'upload') return out(saveFile(b));
    if (b.action === 'add') return out(addFeedback(b));
    const me = String(b.who || '').trim();
    if (b.action === 'mine') return out({ ok: true, items: me ? listAll().filter(x => String(x.who) === me) : [] });
    if (b.action === 'edit') return out(editFeedback(b, me));
    if (b.action === 'remove') return out(removeOwn(b, me));
    if (b.action === 'file' && !okAdmin(b.admin)) return out(readFile(b.id, me));   // 교수님은 본인 글의 첨부만
    if (!okAdmin(b.admin)) return out({ ok: false, error: 'admin' });
    if (b.action === 'admin') return out({ ok: true });
    if (b.action === 'list') return out({ ok: true, items: listAll() });
    if (b.action === 'file') return out(readFile(b.id));
    if (b.action === 'status') return out(setStatus(b));
    if (b.action === 'delete') return out(removeFeedback(b));
    return out({ ok: false, error: '알 수 없는 요청' });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

/** 파일 하나 저장: 받은 내용을 그대로 드라이브에 넣는다(화질·용량 변환 없음). */
function saveFile(b) {
  const bytes = Utilities.base64Decode(b.data);
  if (bytes.length > MAX_FILE_MB * 1024 * 1024) return { ok: false, error: '파일이 너무 큽니다.' };
  const name = String(b.name || 'file').slice(0, 200);
  const file = DriveApp.getFolderById(P.getProperty('FOLDER_ID')).createFile(Utilities.newBlob(bytes, b.mime || 'application/octet-stream', name));
  const id = uid();
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { sheet('파일').appendRow([id, '', name, bytes.length, b.mime || '', file.getId(), String(b.thumb || '').slice(0, 45000), new Date()]); }
  finally { lock.releaseLock(); }
  return { ok: true, id: id, name: name, size: bytes.length };
}

/** 코멘트 묶음: [{url, text}] → 정리 · 시트에 읽기 좋게 쓸 글 */
function cmtsOf(b) {
  return (Array.isArray(b.comments) ? b.comments : []).slice(0, 30)
    .map(c => ({ url: String((c && c.url) || '').trim().slice(0, 500), text: String((c && c.text) || '').trim().slice(0, 8000) }))
    .filter(c => c.text);
}
const readable = cs => cs.map((c, i) => '[Comment ' + (i + 1) + ']' + (c.url ? '\nURL: ' + c.url : '') + '\n' + c.text).join('\n\n');

function addFeedback(b) {
  const cs = cmtsOf(b);
  const who = String(b.who || '').trim().slice(0, 40), text = (cs.length ? readable(cs) : String(b.text || '').trim()).slice(0, 40000);
  if (!who || !text) return { ok: false, error: '이름과 내용이 필요합니다.' };
  const id = uid(), files = (b.files || []).map(String).slice(0, 30);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    sheet('피드백').appendRow([id, new Date(), who, cs.length ? '코멘트 ' + cs.length + '개' : String(b.page || '').slice(0, 60), text, '접수', files.join(','), '', '', cs.length ? JSON.stringify(cs) : '']);
    if (files.length) {   // 첨부 파일에 이 글의 id 를 적어 둔다
      const sh = sheet('파일'), v = sh.getDataRange().getValues();
      for (let r = 1; r < v.length; r++) if (files.indexOf(String(v[r][0])) >= 0) sh.getRange(r + 1, 2).setValue(id);
    }
  } finally { lock.releaseLock(); }
  return { ok: true, id: id };
}

/** 본인 글 수정: 이름이 같은 글만. 내용 · 해당 부분을 바꾸고 첨부를 더할 수 있다. 수정하면 상태는 '접수'로 돌아간다. */
function editFeedback(b, me) {
  const cs = cmtsOf(b);
  const text = (cs.length ? readable(cs) : String(b.text || '').trim()).slice(0, 40000);
  if (!me || !text) return { ok: false, error: '이름과 내용이 필요합니다.' };
  const add = (b.files || []).map(String).slice(0, 30);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const r = rowOf(b.id); if (!r) return { ok: false, error: '글을 찾을 수 없습니다.' };
    const sh = sheet('피드백'), row = sh.getRange(r, 1, 1, 8).getValues()[0];
    if (String(row[2]) !== me) return { ok: false, error: '본인이 쓴 글만 수정할 수 있습니다.' };
    const files = String(row[6] || '').split(',').filter(String).concat(add).slice(0, 30);
    sh.getRange(r, 4, 1, 4).setValues([[cs.length ? '코멘트 ' + cs.length + '개' : String(b.page || '').slice(0, 60), text, '접수', files.join(',')]]);
    sh.getRange(r, 10).setValue(cs.length ? JSON.stringify(cs) : '');
    sh.getRange(r, 9).setValue(new Date());   // 수정 시각
    if (add.length) {
      const fs = sheet('파일'), v = fs.getDataRange().getValues();
      for (let i = 1; i < v.length; i++) if (add.indexOf(String(v[i][0])) >= 0) fs.getRange(i + 1, 2).setValue(String(b.id));
    }
  } finally { lock.releaseLock(); }
  return { ok: true };
}

/** 본인 글 삭제: 이름이 같은 글만. 시트의 줄만 지우고 첨부 파일은 드라이브에 남긴다. */
function removeOwn(b, me) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const r = rowOf(b.id); if (!r) return { ok: false, error: '글을 찾을 수 없습니다.' };
    const sh = sheet('피드백');
    if (!me || String(sh.getRange(r, 3).getValue()) !== me) return { ok: false, error: '본인이 쓴 글만 삭제할 수 있습니다.' };
    sh.deleteRow(r);
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function listAll() {
  const fv = sheet('파일').getDataRange().getValues(), files = {};
  for (let r = 1; r < fv.length; r++) files[String(fv[r][0])] = { id: String(fv[r][0]), name: fv[r][2], size: fv[r][3], mime: fv[r][4], thumb: fv[r][6] };
  const v = sheet('피드백').getDataRange().getValues(), items = [];
  for (let r = 1; r < v.length; r++) {
    if (!v[r][0]) continue;
    items.push({ id: String(v[r][0]), at: new Date(v[r][1]).getTime(), who: v[r][2], page: v[r][3], text: v[r][4], status: v[r][5] || '접수',
      files: String(v[r][6] || '').split(',').filter(String).map(k => files[k]).filter(Boolean), memo: v[r][7] || '', edited: v[r][8] ? new Date(v[r][8]).getTime() : 0, comments: parseCmts(v[r][9]) });
  }
  return items.sort((x, y) => y.at - x.at);
}

function parseCmts(raw) { try { const a = JSON.parse(raw || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }

/** 원본 파일을 그대로 돌려준다(사이트가 받아서 저장). 드라이브 공유 설정을 바꿀 필요가 없다. */
function readFile(fileId, me) {
  const fv = sheet('파일').getDataRange().getValues();
  for (let r = 1; r < fv.length; r++) if (String(fv[r][0]) === String(fileId)) {
    if (me !== undefined) {   // 관리자가 아니면 본인 글에 붙은 파일만
      const fr = rowOf(fv[r][1]);
      if (!me || !fr || String(sheet('피드백').getRange(fr, 3).getValue()) !== me) return { ok: false, error: '본인 글의 첨부 파일만 받을 수 있습니다.' };
    }
    const blob = DriveApp.getFileById(fv[r][5]).getBlob();
    return { ok: true, name: fv[r][2], mime: fv[r][4] || blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) };
  }
  return { ok: false, error: '파일을 찾을 수 없습니다.' };
}

function rowOf(id) {
  const v = sheet('피드백').getDataRange().getValues();
  for (let r = 1; r < v.length; r++) if (String(v[r][0]) === String(id)) return r + 1;
  return 0;
}
function setStatus(b) {
  const r = rowOf(b.id); if (!r) return { ok: false, error: '글을 찾을 수 없습니다.' };
  const sh = sheet('피드백'); sh.getRange(r, 6).setValue(b.status === '반영 완료' ? '반영 완료' : '접수');
  if (b.memo !== undefined) sh.getRange(r, 8).setValue(String(b.memo).slice(0, 2000));
  return { ok: true };
}
/** 글 삭제: 시트의 줄만 지운다. 첨부 파일은 드라이브 폴더에 그대로 남는다. */
function removeFeedback(b) {
  const r = rowOf(b.id); if (!r) return { ok: false, error: '글을 찾을 수 없습니다.' };
  sheet('피드백').deleteRow(r); return { ok: true };
}
