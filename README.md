# 업무 관리 앱 (taskflow-simple)

간단한 업무 관리 웹 앱입니다. 업무를 추가하고, 상태를 바꾸고, 삭제할 수 있습니다.

## 기술 스택

- 서버: Node.js 내장 `http` 모듈 (외부 의존성 없음)
- 저장소: `tasks.json` 파일
- 프론트: HTML + Vanilla JS + 순수 CSS

## 실행 방법

```bash
node server.js
```

브라우저에서 http://localhost:3100 접속

## 기능

| 기능 | 설명 |
| --- | --- |
| 추가 | 입력창에 제목을 넣고 `추가` 버튼 |
| 상태 변경 | 목록에서 `상태 변경` 버튼 (진행중 ↔ 완료) |
| 삭제 | 목록에서 `삭제` 버튼 |

## API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| GET | `/api/tasks` | 업무 목록 조회 |
| POST | `/api/tasks` | 업무 추가 (`{"title": "..."}`) |
| PATCH | `/api/tasks/:id` | 상태 변경 (`{"status": "todo"\|"done"}`) |
| DELETE | `/api/tasks/:id` | 업무 삭제 |

## 폴더 구조

```
taskflow-simple/
├── server.js          # API 서버 + 정적 파일 제공
├── public/index.html  # 화면
├── tasks.json         # 데이터 (실행 시 생성, git 제외)
└── README.md
```
