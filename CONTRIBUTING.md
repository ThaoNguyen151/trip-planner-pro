# Đóng góp & quy ước làm việc

Tài liệu ngắn về **cấu trúc dự án**, **lệnh chạy**, và **cách đặt commit** để mọi người thống nhất khi làm việc chung.

---

## Yêu cầu môi trường

- **Node.js** (khuyến nghị phiên bản tương thích với `package.json` / CI)
- **npm** (dự án dùng `npm` để cài đặt và chạy script)

Cài dependency:

```bash
npm install
```

---

## Cấu trúc thư mục (tóm tắt)

```text
trip-planner-pro/
├── .github/workflows/     # CI (lint + build) khi push/PR
├── .husky/                # Git hooks (pre-commit, commit-msg)
├── commitlint.config.mjs  # Quy tắc kiểm tra nội dung commit
├── public/                # Tài nguyên tĩnh (favicon, …)
├── scripts/husky/         # Hook chạy bằng Node (lint-staged, commitlint)
├── server/                # `static.mjs` — phục vụ bản build `dist/` (không phải API)
├── src/
│   ├── assets/            # Hình, SVG, …
│   ├── components/ui/     # Thành phần shadcn/ui (ví dụ Button)
│   ├── constants/         # Hằng số (routes, storage keys, …)
│   ├── hooks/             # Hook React (ví dụ bọc store)
│   ├── layouts/           # Layout chung (App shell: sidebar + header)
│   ├── lib/               # Tiện ích (vd: `cn()`)
│   ├── pages/             # Từng trang theo route (dashboard, itinerary, …)
│   ├── routes/            # Cấu hình `react-router` (`createBrowserRouter`)
│   ├── stores/            # Zustand + persist (localStorage)
│   ├── types/             # Kiểu TypeScript dùng chung
│   ├── App.tsx            # Root: `RouterProvider`
│   ├── main.tsx           # Entry + import CSS
│   └── index.css          # Tailwind + theme shadcn
├── vite.config.ts         # Alias `@` → `src/`
├── tsconfig.*.json
└── eslint.config.js
```

**Ghi chú nghiệp vụ:** đây là **frontend-only**; dữ liệu người dùng có thể lưu cục bộ qua **Zustand + `localStorage`** (không backend/DB trong repo).

---

## Alias import

Trong code ưu tiên import theo alias:

```ts
import { Button } from "@/components/ui/button";
```

Alias `@/*` trỏ tới thư mục `src/` (cấu hình trong `tsconfig` và `vite.config.ts`).

---

## Lệnh thường dùng

| Lệnh              | Mô tả                                                                               |
| ----------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`     | Chạy dev server (Vite + HMR)                                                        |
| `npm run build`   | Kiểm tra TypeScript + build production ra `dist/`                                   |
| `npm run lint`    | Chạy ESLint toàn project                                                            |
| `npm run preview` | Xem thử bản build bằng `vite preview`                                               |
| `npm start`       | Phục vụ thư mục `dist/` bằng Node (`server/static.mjs`) — cần `npm run build` trước |

---

## Git hooks (Husky)

Sau `npm install`, script `prepare` đăng ký **Husky**. Hai hook chính:

1. **`pre-commit`** — chạy **lint-staged**: chỉ với file `.ts` / `.tsx` đang stage, chạy `eslint --fix` (logic nằm trong `scripts/husky/pre-commit.mjs`).
2. **`commit-msg`** — chạy **commitlint** (Conventional Commits), file `scripts/husky/commit-msg.mjs`.

Nếu cần bỏ qua hook (chỉ dùng khi thật sự cần, ví dụ hotfix tạm):

```bash
git commit --no-verify -m "..."
```

Không nên lạm dụng; **CI** (`.github/workflows/ci.yml`) vẫn chạy lint và build.

---

## Cách đặt commit (bắt buộc theo Conventional Commits)

Nội dung commit phải theo dạng:

```text
<type>: <mô tả ngắn>
```

**Một số `type` thường dùng**

| type       | Khi nào dùng                |
| ---------- | --------------------------- |
| `feat`     | Thêm tính năng              |
| `fix`      | Sửa lỗi                     |
| `docs`     | Chỉ tài liệu                |
| `style`    | Format, UI không đổi logic  |
| `refactor` | Refactor, không đổi hành vi |
| `test`     | Thêm/sửa test               |
| `chore`    | Công cụ, config, dependency |
| `perf`     | Cải thiện hiệu năng         |
| `build`    | Build, bundler              |
| `ci`       | CI/CD                       |
| `revert`   | Revert commit trước         |

**Ví dụ hợp lệ**

```text
feat: add itinerary page layout
fix: correct sidebar active state
chore: update eslint config
docs: add contributing guide
```

**Ví dụ không hợp lệ** (commitlint sẽ từ chối):

```text
updated stuff
fix bug
WIP
```

Có thể thêm scope tùy chọn:

```text
feat(ui): add budget card component
fix(router): redirect unknown paths to dashboard
```

Chi tiết quy tắc nằm trong `commitlint.config.mjs` (mở rộng `@commitlint/config-conventional`).

---

## Kiểm tra commit message trên máy

```bash
echo "feat: test message" | npx commitlint
```

---

## Pull request

- Ưu tiên nhánh rõ ràng, commit message chuẩn như trên.
- Đảm bảo `npm run lint` và `npm run build` chạy thành công trước khi mở PR (trùng với CI).

Nếu thắc mắc về cấu trúc hoặc hook, mở issue / trao đổi trong nhóm để thống nhất cách làm.
