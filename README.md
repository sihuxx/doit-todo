# DoIt — 할일 관리 앱

Next.js 14 + Supabase + Vercel 기반 투두 앱입니다.

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일 | Tailwind CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | JWT (jose) + bcryptjs |
| 배포 | Vercel |

---

## 로컬 실행 방법

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 내용 전체 붙여넣기 → Run
3. **Project Settings > API** 에서 아래 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Supabase 값으로 채워주세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=my-super-secret-jwt-key-32chars-min
```

### 3. 패키지 설치 & 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

---

## Vercel 배포 방법

### 1. GitHub에 푸시

```bash
git init
git add .
git commit -m "init: DoIt todo app"
git remote add origin https://github.com/your-username/doit-todo.git
git push -u origin main
```

### 2. Vercel 연결

1. [vercel.com](https://vercel.com) → New Project → GitHub 저장소 선택
2. **Environment Variables** 탭에서 `.env.local`의 4개 값 입력
3. Deploy 클릭

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts   # POST 회원가입
│   │   │   ├── login/route.ts    # POST 로그인
│   │   │   ├── logout/route.ts   # POST 로그아웃
│   │   │   └── me/route.ts       # GET 세션 확인
│   │   ├── todos/
│   │   │   ├── route.ts          # GET 목록, POST 생성
│   │   │   └── [id]/route.ts     # PATCH 수정, DELETE 삭제
│   │   └── categories/
│   │       ├── route.ts          # GET 목록, POST 생성
│   │       └── [id]/route.ts     # DELETE 삭제
│   ├── todos/
│   │   ├── layout.tsx            # 사이드바 공통 레이아웃
│   │   ├── page.tsx              # 전체 할일 페이지
│   │   └── [categoryId]/page.tsx # 카테고리별 페이지
│   ├── page.tsx                  # 로그인/회원가입
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   └── Sidebar.tsx
│   └── todo/
│       ├── TodoItem.tsx
│       └── AddTodoForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useTodos.ts
│   └── useCategories.ts
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── auth.ts                   # JWT 유틸
│   └── utils.ts                  # 공통 헬퍼
└── types/
    └── index.ts                  # TypeScript 타입
```

---

## 구현 기능

- ✅ 회원가입 / 로그인 (닉네임 + 비밀번호)
- ✅ JWT 세션 (httpOnly 쿠키, 7일 유지)
- ✅ 할일 추가 / 완료 체크 / 수정 (더블클릭) / 삭제
- ✅ 카테고리 생성 / 삭제 / 색상 선택
- ✅ 카테고리별 필터링
- ✅ 마감일 설정 + D-day 표시 (임박/초과 색상 경고)
- ✅ 사용자별 데이터 완전 격리

## 다음 단계 (Step 4)

- 📊 주간/월간 완료율 통계 차트
- 🔔 마감 임박 알림
