// 업무 관리 앱 - 서버 (Node.js 내장 http 모듈만 사용)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3100;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// 업무 목록 읽기
function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

// 업무 목록 저장
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

function sendJson(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // 업무 목록 조회
  if (pathname === '/api/tasks' && req.method === 'GET') {
    return sendJson(res, 200, loadTasks());
  }

  // 업무 추가
  if (pathname === '/api/tasks' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body.title) return sendJson(res, 400, { error: '제목이 필요합니다' });
    const tasks = loadTasks();
    const task = { id: Date.now(), title: body.title, status: 'todo' };
    tasks.push(task);
    saveTasks(tasks);
    return sendJson(res, 201, task);
  }

  // 업무 상태 변경
  const matchPatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (matchPatch && req.method === 'PATCH') {
    const body = await readBody(req);
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === Number(matchPatch[1]));
    if (!task) return sendJson(res, 404, { error: '없는 업무입니다' });
    if (body.status) task.status = body.status;
    saveTasks(tasks);
    return sendJson(res, 200, task);
  }

  // 업무 삭제
  if (matchPatch && req.method === 'DELETE') {
    const tasks = loadTasks();
    const next = tasks.filter((t) => t.id !== Number(matchPatch[1]));
    if (next.length === tasks.length) return sendJson(res, 404, { error: '없는 업무입니다' });
    saveTasks(next);
    return sendJson(res, 200, { ok: true });
  }

  // 정적 파일
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  const full = path.join(__dirname, 'public', file);
  if (fs.existsSync(full) && fs.statSync(full).isFile()) {
    const type = full.endsWith('.html') ? 'text/html; charset=utf-8'
      : full.endsWith('.js') ? 'text/javascript; charset=utf-8'
      : full.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    return res.end(fs.readFileSync(full));
  }

  res.writeHead(404); res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`업무 관리 앱 실행 중: http://localhost:${PORT}`);
});
