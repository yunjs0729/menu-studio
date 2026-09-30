# 메뉴 스튜디오

Spring Boot와 React 기반 메뉴 관리 실습 프로젝트입니다. Montage 디자인 토큰을 활용한 UI에 청록빛 딥그린 테마와 카테고리별 색상을 적용했습니다.

## 기능

- 메뉴 목록과 페이지네이션
- 이름 검색, 가격 초과 조건, 카테고리 필터
- 메뉴 상세, 등록, 수정, 삭제 확인
- 로딩, 빈 목록, 오류 상태
- 검색 조건을 URL에 보관

## 구성

- `chap06-spring-data-jpa/`: Spring Boot, Spring Data JPA, MySQL, Swagger
- `menu-app/`: React, Vite, React Router, Axios
- `menu-app/design/montage.tokens.json`: 디자인 토큰
- `api-docs.json`: 서버에서 추출한 API 명세

디자인 시스템 원본은 저장소에 포함하지 않습니다. 원본: https://github.com/wanteddev/montage-web

제공받은 vibe-design-practice 참고용 완성본을 기반으로 디자인과 설정을 수정한 실습 프로젝트입니다.

## 실행

JDK 17, MySQL(3306), Node.js 20.19 이상 또는 22.12 이상을 준비합니다.

1. 백엔드의 `sql/` 파일을 순서대로 실행합니다. 기존 DB가 있다면 초기화 SQL을 다시 실행하지 마세요.
2. `application-local.example.yaml`을 같은 폴더의 `application-local.yaml`로 복사하고 본인의 접속 정보를 입력합니다. 로컬 파일은 Git에서 제외됩니다. 환경 변수 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`로도 설정할 수 있습니다.
3. 백엔드를 실행합니다.

```powershell
cd chap06-spring-data-jpa
.\gradlew.bat bootRun
```

4. 새 터미널에서 프론트엔드를 실행합니다.

```powershell
cd menu-app
npm install
npm run tokens
npm run dev
```

앱: http://localhost:5173 · API: http://localhost:8080 · Swagger: http://localhost:8080/swagger-ui.html

5173이나 8080이 사용 중이면 기존 서버를 종료하고 다시 실행하세요.

## 확인

```powershell
cd menu-app
npm run lint
npm run build
```
