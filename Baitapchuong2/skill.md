# VIBE CODING SKILL & NHẬT KÝ THỰC HÀNH CHƯƠNG 2
## DỰ ÁN: XÂY DỰNG BACKEND QUẢN LÝ SINH VIÊN VỚI NODE.JS, EXPRESS & TYPESCRIPT

> **Mục tiêu:** Tài liệu này đóng vai trò là cẩm nang kỹ năng (Skill) và nhật ký ghi lại toàn bộ chu trình **Vibe Coding** chuẩn từ **Bài 1 đến Bài 10** theo đúng yêu cầu giáo trình `Bài tập thực hành chương 2.pdf`. Bao gồm từng cặp tương tác: **Prompt người dùng gửi AI** ↔ **Nội dung AI phản hồi**, mã nguồn từng file, lệnh thực thi, bộ kiểm thử Postman và câu hỏi vấn đáp.

---

## 📌 THÔNG SỐ VÀ CẤU HÌNH KỸ THUẬT CHUẨN
- **Runtime:** Node.js 20+ (hiện tại Node 24)
- **Package Manager:** `pnpm` (pnpm 10)
- **Framework:** Express 5
- **Ngôn ngữ:** TypeScript 5, module `ESM` / `NodeNext`
- **Thực thi phát triển:** `tsx watch`
- **Cổng dịch vụ (PORT):** `5000` (`http://localhost:5000`)
- **Quy ước Import nội bộ:** Luôn có đuôi `.js` (chuẩn NodeNext ESM cho file TypeScript đã build)

---

## 📂 SƠ ĐỒ CÂY THƯ MỤC DỰ ÁN KHI HOÀN THÀNH

```text
backend-quan-ly-sinh-vien/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
├── src/
│   ├── server.ts
│   ├── dtos/
│   │   └── sinhVien.dto.ts
│   ├── services/
│   │   └── sinhVien.service.ts
│   ├── controllers/
│   │   └── sinhVien.controller.ts
│   ├── routes/
│   │   └── sinhVien.routes.ts
│   ├── middlewares/
│   │   ├── logger.middleware.ts
│   │   └── error.middleware.ts
│   └── utils/
│       └── AppError.ts
├── node_modules/
└── dist/
```

---

# TOÀN BỘ CHU TRÌNH THAO TÁC (PROMPT ↔ PHẢN HỒI AI)

---

### BƯỚC 0: THIẾT LẬP NGUYÊN TẮC HỖ TRỢ VÀ BỐI CẢNH (BÀI 1)

#### 💬 Prompt 0 (Người dùng gửi AI):
```text
ROLE: Bạn là người hướng dẫn Backend cho sinh viên chưa biết lập trình Backend.
CONTEXT: Tôi xây dựng Backend quản lý sinh viên bằng Node.js, Express 5, TypeScript và pnpm, trên Windows với VS Code. Cấu hình dùng ESM, NodeNext và tsx để chạy lúc phát triển.
TASK: Hỗ trợ tôi từng bước theo nhiệm vụ tôi gửi. Bây giờ chỉ xác nhận cách làm, chưa tạo code.
CONSTRAINT: Dữ liệu SinhVien gồm maSV, hoTen, email, maLop, đều là chuỗi. Cổng 5000. Chưa dùng database, giao diện, JWT hay Docker. Không tự thêm chức năng. Import nội bộ dùng đuôi .js theo cấu hình ESM này.
OUTPUT: Mỗi lần hãy giải thích ngắn vì sao cần làm, liệt kê file tạo/sửa, trả đầy đủ nội dung file cần thay đổi, có chú thích tiếng Việt ở phần quan trọng. Lệnh terminal trình bày riêng. Không dùng dấu ba chấm thay code.
CHECK: Luôn hướng dẫn cách chạy, kết quả mong đợi và một câu hỏi giúp tôi hiểu phần vừa làm. Nếu thiếu thông tin dự án, hỏi hoặc yêu cầu tôi cung cấp file liên quan trước khi sửa.
```

#### 🤖 Nội dung AI phản hồi:
```text
Chào bạn! Tôi đã nắm vững toàn bộ bối cảnh và nguyên tắc hỗ trợ dự án:
1. Dự án: Backend quản lý sinh viên (Node.js, Express 5, TypeScript, pnpm).
2. Kiến trúc & Môi trường: ESM, NodeNext, tsx watch, chạy tại cổng 5000 trên Windows.
3. Dữ liệu: Gồm 4 trường string (maSV, hoTen, email, maLop). Dữ liệu lưu trong RAM (chưa dùng Database).
4. Quy ước code: File đầy đủ không ba chấm, có chú thích tiếng Việt, import file nội bộ có đuôi .js.
5. Quy trình: Giải thích mục đích -> Cung cấp lệnh/file -> Hướng dẫn kiểm tra -> Câu hỏi củng cố.

Bây giờ bạn hãy tạo thư mục dự án và bắt đầu với Bài 2.
```

---

### BÀI 2: KHỞI TẠO DỰ ÁN & CÀI ĐẶT THƯ VIỆN

#### 💻 Thao tác Terminal người dùng thực hiện:
```powershell
mkdir backend-quan-ly-sinh-vien
cd backend-quan-ly-sinh-vien
pnpm init
pnpm add express@5 dotenv@16 cors@2 helmet@8
pnpm add -D typescript@5 tsx@4 @types/node@22 @types/express@5 @types/cors@2
```

#### 💬 Prompt 1 (Người dùng gửi AI):
```text
Tôi đã chạy pnpm init và cài các thư viện của bài. Đây là package.json hiện tại:
{
  "name": "backend-quan-ly-sinh-vien",
  "version": "1.0.0",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "helmet": "^8.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.1",
    "@types/node": "^22.14.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3"
  }
}
Hãy giải thích ngắn name, scripts, dependencies và devDependencies cho người mới. Chỉ giải thích các mục thực sự có trong file; nếu scripts chưa có thì nói rõ. Giải thích vì sao không sửa code trong node_modules. Chưa tạo thêm file ở bước này.
```

#### 🤖 Nội dung AI phản hồi:
```text
Giải thích chi tiết các mục trong package.json:
1. "name": Tên định danh của dự án trên hệ thống node/npm package.
2. "scripts": Hiện tại file của bạn CHƯA CÓ mục "scripts". Chúng ta sẽ bổ sung các lệnh chạy như "dev", "build", "start" ở bước tiếp theo để tự động hóa việc khởi chạy và biên dịch.
3. "dependencies": Danh sách các thư viện cần thiết khi ứng dụng hoạt động (runtime):
   - express: Framework xây dựng API máy chủ HTTP.
   - dotenv: Đọc biến môi trường từ file .env.
   - cors: Cho phép trình duyệt gọi API từ các domain khác.
   - helmet: Bổ sung các HTTP Header tăng cường bảo mật.
4. "devDependencies": Các công cụ chỉ dùng trong quá trình lập trình (development), không cần thiết khi chạy ứng dụng thực tế trên server sản phẩm:
   - typescript: Trình biên dịch TypeScript sang JavaScript.
   - tsx: Trình thực thi file TypeScript trực tiếp không cần build thủ công.
   - @types/*: Các gói định nghĩa kiểu dữ liệu cho TypeScript hiểu thư viện JS tương ứng.

* Vì sao không được sửa code trong node_modules?
Thư mục node_modules do pnpm tự động tải về và quản lý dựa trên package.json. Nếu bạn sửa code ở đây, khi người khác chạy pnpm install hoặc khi cài thêm thư viện mới, toàn bộ thay đổi của bạn sẽ bị ghi đè và mất hết.
```

---

### BÀI 3: CẤU HÌNH DỰ ÁN & KHỞI TẠO SERVER ĐẦU TIÊN

#### 💬 Prompt 2 (Người dùng gửi AI):
```text
CONTEXT: Tôi đã tạo dự án và cài thư viện theo bài. Đây là package.json và tsconfig.json hiện tại:
Package.json đã có các dependencies.
TASK: Hướng dẫn tạo server Express tối thiểu, chạy ở cổng 5000.
CONSTRAINT:
- Giữ dependencies đã cài. package.json dùng type=module.
- scripts: dev="tsx watch src/server.ts", build="tsc", start="node dist/server.js".
- tsconfig.json giữ đúng mẫu cấu hình đã cung cấp: ES2022, NodeNext, rootDir src, outDir dist, strict, esModuleInterop, skipLibCheck, forceConsistentCasingInFileNames, noEmitOnError đều true; include src/**/*.ts; exclude node_modules và dist.
- src/server.ts dùng import 'dotenv/config', Express, cors, helmet, express.json(). Đọc PORT từ .env, mặc định 5000. Chỉ tạo GET / trả HTTP 200 và JSON {success:true,message:"Backend quản lý sinh viên đang hoạt động"}.
- Chưa import route sinh viên vì các file đó chưa có.
- Tạo .env và .env.example chứa PORT=5000; .gitignore bỏ node_modules, dist và .env.
OUTPUT: Giải thích từng file dùng để làm gì, trả nội dung đầy đủ của các file tạo/sửa. Không xóa các dependencies trong package.json. Nêu thao tác tạo file trong VS Code và lệnh kiểm tra.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Cập nhật `package.json` (Tại thư mục gốc dự án):
```json
{
  "name": "backend-quan-ly-sinh-vien",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "helmet": "^8.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.1",
    "@types/node": "^22.14.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3"
  }
}
```

##### 2. Tạo `tsconfig.json` (Tại thư mục gốc dự án):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmitOnError": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

##### 3. Tạo `.env` và `.env.example` (Tại thư mục gốc):
```text
PORT=5000
```

##### 4. Tạo `.gitignore` (Tại thư mục gốc):
```text
node_modules/
dist/
.env
```

##### 5. Tạo `src/server.ts`:
```typescript
import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// Middleware nền tảng
app.use(helmet());
app.use(cors());
app.use(express.json());

// Endpoint kiểm tra máy chủ hoạt động
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

// Khởi chạy lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

#### 💻 Lệnh kiểm tra chạy chương trình:
```powershell
pnpm build
pnpm dev
```
- **Kết quả mong đợi:** Truy cập trình duyệt `http://localhost:5000/` nhận được JSON:
  `{"success":true,"message":"Backend quản lý sinh viên đang hoạt động"}`.

---

### BÀI 4: THIẾT KẾ DỮ LIỆU SINH VIÊN (DTO)

#### 💬 Prompt 3 (Người dùng gửi AI):
```text
TASK: Tạo src/dtos/sinhVien.dto.ts cho dự án hiện tại.
CONSTRAINT: Export interface ISinhVienDTO gồm maSV, hoTen, email, maLop; cả bốn đều là string và bắt buộc. Chỉ tạo file này, chưa tạo dữ liệu, Service hoặc database. Không đổi tên các trường.
OUTPUT: Giải thích interface và DTO bằng ví dụ đơn giản. Trả toàn bộ code file, có chú thích tiếng Việt. Nêu nơi tạo file và cách kiểm tra bằng pnpm build. Giải thích vì sao khai báo interface không tự kiểm tra dữ liệu JSON người dùng gửi vào.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/dtos/sinhVien.dto.ts`:
```typescript
/**
 * DTO (Data Transfer Object) cho dữ liệu Sinh viên trao đổi trong hệ thống.
 * Cả 4 trường đều bắt buộc và có kiểu dữ liệu là chuỗi (string).
 */
export interface ISinhVienDTO {
  maSV: string;   // Mã sinh viên (VD: "SV001")
  hoTen: string;  // Họ và tên sinh viên (VD: "Minh Nhật")
  email: string;  // Email liên hệ (VD: "minhnhat@example.com")
  maLop: string;  // Mã lớp học (VD: "25CT114")
}
```

##### 2. Giải thích kiến thức:
- **DTO là gì?** DTO là khuôn mẫu mô tả dữ liệu được truyền qua lại giữa các tầng trong ứng dụng (Client -> Route -> Controller -> Service).
- **Vì sao interface không tự kiểm tra được JSON người dùng gửi lên?** Interface của TypeScript chỉ có tác dụng kiểm tra kiểu dữ liệu trong **lúc viết mã và biên dịch (Compile-time)**. Khi ứng dụng chạy thực tế (Runtime), TypeScript đã được biên dịch thành JavaScript thuần và các interface bị loại bỏ hoàn toàn. Do đó, muốn kiểm tra dữ liệu JSON gửi lên từ client, mã nguồn phải có bước kiểm tra dữ liệu (Validation) lúc nhận request.

#### 💻 Lệnh kiểm tra:
```powershell
pnpm build
```

---

### BÀI 5: XÂY DỰNG SERVICE LẤY DANH SÁCH

#### 💬 Prompt 4 (Người dùng gửi AI):
```text
CONTEXT: Dự án đã chạy GET / và có ISinhVienDTO. Đây là DTO hiện tại: [src/dtos/sinhVien.dto.ts].
TASK: Tạo src/services/sinhVien.service.ts để lấy danh sách sinh viên mẫu.
CONSTRAINT:
- Import type ISinhVienDTO từ ../dtos/sinhVien.dto.js.
- Trong module, lưu mảng sinhVienList gồm đúng hai sinh viên: SV001, Minh Nhật, minhnhat@example.com, 25CT114; SV002, Lan Anh, lananh@example.com, 25CT114.
- Export hàm layDanhSachSinhVien(): ISinhVienDTO[]. Hàm trả danh sách sinh viên; chưa cần async hoặc database.
- Service không import Express, không nhận req/res và không tạo HTTP response. Chưa tạo Controller hoặc Route.
OUTPUT: Giải thích mảng dùng làm gì, hàm trả về gì và ai sẽ gọi hàm. Trả toàn bộ file có chú thích, chỉ rõ nơi lưu. Hướng dẫn pnpm build và nói rõ chưa có URL sinh viên để mở ở bước này.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/services/sinhVien.service.ts`:
```typescript
import type { ISinhVienDTO } from '../dtos/sinhVien.dto.js';

// Mảng lưu trữ dữ liệu tạm thời trong bộ nhớ RAM
export const sinhVienList: ISinhVienDTO[] = [
  {
    maSV: 'SV001',
    hoTen: 'Minh Nhật',
    email: 'minhnhat@example.com',
    maLop: '25CT114',
  },
  {
    maSV: 'SV002',
    hoTen: 'Lan Anh',
    email: 'lananh@example.com',
    maLop: '25CT114',
  },
];

/**
 * Lấy toàn bộ danh sách sinh viên hiện có
 * @returns Mảng các đối tượng ISinhVienDTO
 */
export const layDanhSachSinhVien = (): ISinhVienDTO[] => {
  return sinhVienList;
};
```

##### 2. Giải thích:
- `sinhVienList`: Đóng vai trò là nguồn dữ liệu giả lập (mock data) trong bộ nhớ.
- `layDanhSachSinhVien()`: Cung cấp nghiệp vụ lấy danh sách dữ liệu. Controller sau này sẽ gọi hàm này. Service hoàn toàn tách biệt với giao thức HTTP (không chứa `req`, `res`).

#### 💻 Lệnh kiểm tra:
```powershell
pnpm build
```

---

### BÀI 6: GHÉP CONTROLLER VÀ ROUTE LẤY DANH SÁCH

#### 💬 Prompt 5 (Người dùng gửi AI):
```text
CONTEXT: Đây là src/services/sinhVien.service.ts hiện tại: [code service].
TASK: Tạo src/controllers/sinhVien.controller.ts.
CONSTRAINT:
- Export hàm getDanhSachSinhVien nhận req, res, next có kiểu từ Express.
- Gọi đúng layDanhSachSinhVien từ ../services/sinhVien.service.js.
- Thành công: HTTP 200, JSON {success:true,message:"Lấy danh sách sinh viên thành công",data: danh sách nhận từ Service}.
- Có try/catch; khi lỗi thì next(error). Không dùng any tường minh. Sau khi gửi response không tiếp tục gửi lần thứ hai.
- Không tạo lại mảng dữ liệu trong Controller. Chưa sửa server hoặc tạo Route.
OUTPUT: Trả code đầy đủ và giải thích chỗ gọi Service, chỗ đặt status, chỗ trả JSON. Hướng dẫn tạo file và chạy pnpm build. Nhắc rằng bước này chưa có URL mới để gọi.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/controllers/sinhVien.controller.ts`:
```typescript
import type { Request, Response, NextFunction } from 'express';
import { layDanhSachSinhVien } from '../services/sinhVien.service.js';

/**
 * Controller xử lý yêu cầu HTTP lấy danh sách sinh viên
 */
export const getDanhSachSinhVien = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Gọi tầng Service để lấy dữ liệu nghiệp vụ
    const data = layDanhSachSinhVien();

    // 2. Thiết lập HTTP Status 200 và phản hồi dữ liệu JSON chuẩn
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data,
    });
  } catch (error) {
    // 3. Chuyển giao lỗi cho Middleware xử lý lỗi
    next(error);
  }
};
```

---

#### 💬 Prompt 6 (Người dùng gửi AI):
```text
CONTEXT: Tôi đã có getDanhSachSinhVien trong Controller. Đây là controller và server.ts hiện tại: [code controller & server.ts].
TASK: Tạo src/routes/sinhVien.routes.ts và cập nhật src/server.ts để mở API lấy danh sách.
CONSTRAINT:
- File route dùng Router của Express, import getDanhSachSinhVien, khai báo router.get('/', getDanhSachSinhVien), export default router.
- server.ts import router và gắn app.use('/api/v1/sinh-vien', router) sau express.json(), trước app.listen.
- Giữ GET /, cấu hình PORT=5000, dotenv, cors và helmet đang có. Không thêm lại các middleware hoặc app.listen bị trùng.
- Không đưa mảng hoặc nghiệp vụ vào Route. Import nội bộ có đuôi .js.
OUTPUT: Trả đủ hai file và giải thích cách ghép tiền tố với đường dẫn /. Hướng dẫn pnpm build, pnpm dev và URL kiểm tra.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/routes/sinhVien.routes.ts`:
```typescript
import { Router } from 'express';
import { getDanhSachSinhVien } from '../controllers/sinhVien.controller.js';

const router = Router();

// Đường dẫn tương đối / tương ứng với tiền tố /api/v1/sinh-vien
router.get('/', getDanhSachSinhVien);

export default router;
```

##### 2. Cập nhật `src/server.ts`:
```typescript
import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sinhVienRoutes from './routes/sinhVien.routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// Middleware nền tảng
app.use(helmet());
app.use(cors());
app.use(express.json());

// Endpoint kiểm tra máy chủ
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

// Gắn route sinh viên với tiền tố /api/v1/sinh-vien
app.use('/api/v1/sinh-vien', sinhVienRoutes);

// Khởi chạy lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

#### 💻 Lệnh kiểm tra chạy thử:
```powershell
pnpm build
pnpm dev
```
- Truy cập trình duyệt: `http://localhost:5000/api/v1/sinh-vien`
- **Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Lấy danh sách sinh viên thành công",
  "data": [
    { "maSV": "SV001", "hoTen": "Minh Nhật", "email": "minhnhat@example.com", "maLop": "25CT114" },
    { "maSV": "SV002", "hoTen": "Lan Anh", "email": "lananh@example.com", "maLop": "25CT114" }
  ]
}
```

---

### BÀI 7: BỔ SUNG MIDDLEWARE GHI NHẬN & XỬ LÝ LỖI

#### 💬 Prompt 7 (Người dùng gửi AI):
```text
CONTEXT: Đây là server.ts hiện tại: [code server.ts]. Controller đang dùng next(error) trong catch.
TASK: Tạo src/middlewares/logger.middleware.ts và src/middlewares/error.middleware.ts, cập nhật server.ts.
CONSTRAINT:
- Logger export loggerMiddleware, in req.method và req.path rồi gọi next(); không ghi body hoặc dữ liệu nhạy cảm.
- Error middleware export errorMiddleware, đủ 4 tham số theo ErrorRequestHandler. JSON body sai cú pháp trả 400 với success=false và message dễ hiểu. Lỗi chưa biết trả 500 với message="Lỗi hệ thống"; chỉ console.error chi tiết ở server.
- Thứ tự server: logger, helmet/cors, express.json(), GET / và route sinh viên, middleware 404 cho đường dẫn không có, cuối cùng errorMiddleware.
- 404 trả {success:false,message:"Không tìm thấy đường dẫn"}. Không thay dữ liệu hoặc đường dẫn đang chạy.
OUTPUT: Trả các file đầy đủ, giải thích vì sao express.json đứng trước Route và middleware lỗi đứng cuối. Nêu cách kiểm tra log và 404.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/middlewares/logger.middleware.ts`:
```typescript
import type { Request, Response, NextFunction } from 'express';

/**
 * Ghi nhận method và đường dẫn của request tới server
 */
export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next(); // Bắt buộc gọi next() để chuyển sang middleware/route tiếp theo
};
```

##### 2. Tạo file `src/middlewares/error.middleware.ts`:
```typescript
import type { ErrorRequestHandler } from 'express';

/**
 * Middleware xử lý lỗi tập trung toàn hệ thống (4 tham số)
 */
export const errorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  // Xử lý lỗi JSON sai cú pháp do express.json() phát hiện
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON trong body sai cú pháp',
    });
    return;
  }

  // Ghi log lỗi nội bộ tại server
  console.error('[UNHANDLED ERROR]:', err);

  // Phản hồi an toàn cho client, không lộ chi tiết lỗi kỹ thuật
  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống',
  });
};
```

##### 3. Cập nhật `src/server.ts` với đúng thứ tự:
```typescript
import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sinhVienRoutes from './routes/sinhVien.routes.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// 1. Ghi log request đầu tiên
app.use(loggerMiddleware);

// 2. Bảo mật & đọc body
app.use(helmet());
app.use(cors());
app.use(express.json());

// 3. Định tuyến các route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

app.use('/api/v1/sinh-vien', sinhVienRoutes);

// 4. Xử lý đường dẫn không tồn tại (404 Fallback)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy đường dẫn',
  });
});

// 5. Middleware xử lý lỗi tập trung LUÔN ĐẶT CUỐI CÙNG
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

#### 💻 Lệnh kiểm tra:
- Truy cập `http://localhost:5000/khong-co` -> Nhận mã 404 và JSON `{"success":false,"message":"Không tìm thấy đường dẫn"}`.

---

### BÀI 8 (PHẦN 1): BỔ SUNG TÌM SINH VIÊN THEO MÃ

#### 💬 Prompt 8 (Người dùng gửi AI):
```text
CONTEXT: Đây là Service, Controller và Route hiện tại: [code 3 file].
TASK: Thêm tìm sinh viên theo mã, giữ nguyên chức năng lấy danh sách.
CONSTRAINT:
- Service export timSinhVienTheoMa(maSV: string): ISinhVienDTO | undefined, tìm trong mảng đang có; không tạo mảng thứ hai.
- Controller export getSinhVienTheoMa, lấy mã từ req.params.maSV, xử lý kiểu phù hợp Express 5, gọi Service.
- Có dữ liệu: 200, {success:true,message:"Tìm sinh viên thành công",data: sinh viên}. Không có: 404, {success:false,message:"Không tìm thấy sinh viên"}.
- Route thêm GET /:maSV, giữ GET /. Controller có try/catch và next(error).
- Không đổi các tên trường, ESM, cấu hình hoặc dữ liệu mẫu.
OUTPUT: Giải thích tham số URL trước; trả toàn bộ các file cần sửa, chỉ rõ phần mới. Đưa URL thử mã tồn tại và không tồn tại.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Thêm hàm vào `src/services/sinhVien.service.ts`:
```typescript
// Thêm hàm vào cuối file:
export const timSinhVienTheoMa = (maSV: string): ISinhVienDTO | undefined => {
  return sinhVienList.find((sv) => sv.maSV === maSV);
};
```

##### 2. Thêm hàm vào `src/controllers/sinhVien.controller.ts`:
```typescript
import { layDanhSachSinhVien, timSinhVienTheoMa } from '../services/sinhVien.service.js';

export const getSinhVienTheoMa = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const maSV = req.params.maSV;
    if (typeof maSV !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Mã sinh viên không hợp lệ',
      });
      return;
    }

    const sinhVien = timSinhVienTheoMa(maSV);
    if (!sinhVien) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tìm sinh viên thành công',
      data: sinhVien,
    });
  } catch (error) {
    next(error);
  }
};
```

##### 3. Cập nhật `src/routes/sinhVien.routes.ts`:
```typescript
import { Router } from 'express';
import {
  getDanhSachSinhVien,
  getSinhVienTheoMa,
} from '../controllers/sinhVien.controller.js';

const router = Router();

router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);

export default router;
```

#### 💻 Kiểm tra:
- `http://localhost:5000/api/v1/sinh-vien/SV001` -> Trả về Minh Nhật (Status 200).
- `http://localhost:5000/api/v1/sinh-vien/SV999` -> Trả về Không tìm thấy sinh viên (Status 404).

---

### BÀI 8 (PHẦN 2): THIẾT KẾ & THỰC HIỆN THÊM SINH VIÊN (POST & APPERROR)

#### 💬 Prompt 9 (Người dùng gửi AI):
```text
CONTEXT: Đây là DTO, Service, Controller, Route và error.middleware.ts hiện tại: [dán các file].
TASK: Thêm POST /api/v1/sinh-vien, giữ nguyên các API GET.
CONSTRAINT:
- Tạo src/utils/AppError.ts: class AppError extends Error, chứa statusCode kiểu number và message; không phụ thuộc Express.
- Service export themSinhVien(input: unknown): ISinhVienDTO. Dữ liệu phải là object, không phải null hoặc array. Bốn trường maSV, hoTen, email, maLop phải là string. Trim các chuỗi. maSV khớp /^SV[0-9]{3}$/; hoTen và maLop không rỗng; email theo kiểm tra cơ bản /^[^\s@]+@[^\s@]+\.[^\s@]+$/.
- Sai dữ liệu: throw AppError(400, thông báo rõ). Sau validation mới kiểm tra mã trùng; trùng thì throw AppError(409, "Mã sinh viên đã tồn tại"). Không sửa mảng khi có lỗi. Chỉ lưu đúng bốn trường DTO, bỏ các trường thừa.
- Hợp lệ: thêm vào mảng hiện có và trả sinh viên mới.
- Controller export taoSinhVien, truyền req.body cho Service, trả 201 với {success:true,message:"Thêm sinh viên thành công",data: sinh viên mới}. Catch chuyển next(error).
- Route thêm POST / gọi taoSinhVien. Error middleware bắt AppError và trả đúng statusCode với {success:false,message}; giữ xử lý JSON sai 400, lỗi chưa biết 500. Không thêm đăng nhập hoặc database.
OUTPUT: Giải thích từng file thay đổi, trả code đầy đủ. Nêu cách build. Liệt kê các ca cần thử ở Postman: hợp lệ, thiếu tên, sai kiểu, email sai, trùng mã. Chưa khẳng định chạy đúng nếu tôi chưa kiểm tra.
```

#### 🤖 Nội dung AI phản hồi:

##### 1. Tạo file `src/utils/AppError.ts`:
```typescript
/**
 * Lớp lỗi tùy chỉnh biểu diễn các lỗi nghiệp vụ dự kiến kèm mã HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Khôi phục prototype chain khi kế thừa Error trong TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

##### 2. Cập nhật `src/services/sinhVien.service.ts` hoàn chỉnh:
```typescript
import type { ISinhVienDTO } from '../dtos/sinhVien.dto.js';
import { AppError } from '../utils/AppError.js';

export const sinhVienList: ISinhVienDTO[] = [
  {
    maSV: 'SV001',
    hoTen: 'Minh Nhật',
    email: 'minhnhat@example.com',
    maLop: '25CT114',
  },
  {
    maSV: 'SV002',
    hoTen: 'Lan Anh',
    email: 'lananh@example.com',
    maLop: '25CT114',
  },
];

export const layDanhSachSinhVien = (): ISinhVienDTO[] => {
  return sinhVienList;
};

export const timSinhVienTheoMa = (maSV: string): ISinhVienDTO | undefined => {
  return sinhVienList.find((sv) => sv.maSV === maSV);
};

/**
 * Thêm một sinh viên mới vào danh sách
 * @param input Dữ liệu thô chưa biết kiểu (unknown) nhận từ controller
 */
export const themSinhVien = (input: unknown): ISinhVienDTO => {
  // 1. Kiểm tra input phải là một đối tượng hợp lệ
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new AppError(400, 'Dữ liệu sinh viên phải là một đối tượng JSON');
  }

  const raw = input as Record<string, unknown>;

  // 2. Kiểm tra kiểu dữ liệu của 4 trường bắt buộc
  if (
    typeof raw.maSV !== 'string' ||
    typeof raw.hoTen !== 'string' ||
    typeof raw.email !== 'string' ||
    typeof raw.maLop !== 'string'
  ) {
    throw new AppError(400, 'Các trường maSV, hoTen, email, maLop đều phải là chuỗi (string)');
  }

  // 3. Chuẩn hóa trim khoảng trắng
  const maSV = raw.maSV.trim();
  const hoTen = raw.hoTen.trim();
  const email = raw.email.trim();
  const maLop = raw.maLop.trim();

  // 4. Kiểm tra định dạng maSV: bắt đầu bằng SV và theo sau là 3 chữ số
  const maSVRegex = /^SV[0-9]{3}$/;
  if (!maSVRegex.test(maSV)) {
    throw new AppError(400, 'Mã sinh viên phải có định dạng SV kèm 3 chữ số (VD: SV003)');
  }

  // 5. Kiểm tra chuỗi không rỗng
  if (!hoTen) {
    throw new AppError(400, 'Họ tên không được để trống');
  }
  if (!maLop) {
    throw new AppError(400, 'Mã lớp không được để trống');
  }

  // 6. Kiểm tra định dạng email cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(400, 'Email không đúng định dạng');
  }

  // 7. Kiểm tra trùng mã sinh viên (sau khi dữ liệu đã hợp lệ)
  const isExist = sinhVienList.some((sv) => sv.maSV === maSV);
  if (isExist) {
    throw new AppError(409, 'Mã sinh viên đã tồn tại');
  }

  // 8. Tạo mới đối tượng sinh viên sạch và lưu vào mảng
  const newSinhVien: ISinhVienDTO = { maSV, hoTen, email, maLop };
  sinhVienList.push(newSinhVien);

  return newSinhVien;
};
```

##### 3. Cập nhật `src/controllers/sinhVien.controller.ts` hoàn chỉnh:
```typescript
import type { Request, Response, NextFunction } from 'express';
import {
  layDanhSachSinhVien,
  timSinhVienTheoMa,
  themSinhVien,
} from '../services/sinhVien.service.js';

export const getDanhSachSinhVien = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const data = layDanhSachSinhVien();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSinhVienTheoMa = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const maSV = req.params.maSV;
    if (typeof maSV !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Mã sinh viên không hợp lệ',
      });
      return;
    }

    const sinhVien = timSinhVienTheoMa(maSV);
    if (!sinhVien) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tìm sinh viên thành công',
      data: sinhVien,
    });
  } catch (error) {
    next(error);
  }
};

export const taoSinhVien = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const newStudent = themSinhVien(req.body);
    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};
```

##### 4. Cập nhật `src/routes/sinhVien.routes.ts`:
```typescript
import { Router } from 'express';
import {
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
} from '../controllers/sinhVien.controller.js';

const router = Router();

router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);
router.post('/', taoSinhVien);

export default router;
```

##### 5. Cập nhật `src/middlewares/error.middleware.ts`:
```typescript
import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  // Bắt lỗi nghiệp vụ có chủ đích (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Bắt lỗi JSON hỏng từ express.json()
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON trong body sai cú pháp',
    });
    return;
  }

  // Lỗi không lường trước
  console.error('[UNHANDLED ERROR]:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống',
  });
};
```

---

### BÀI 9: HƯỚNG MỞ RỘNG CLEAN ARCHITECTURE

#### 💬 Prompt 10 (Người dùng gửi AI):
```text
Đây là Service và DTO hiện tại của tôi: [dán code]. Tôi muốn hiểu cách tiến tới Clean Architecture, chưa muốn sửa code.
Hãy chỉ ra đoạn nào là quy tắc nghiệp vụ, đoạn nào là truy xuất dữ liệu. Dùng đúng chức năng thêm sinh viên của tôi để giải thích Entity, Use Case, Interface và Repository cho người mới.
Đề xuất cách tách nơi lưu mảng sang MemorySinhVienRepository, một interface mô tả list/find/create và cách đưa repository vào Service. Giải thích vì sao Service không nên import Express hoặc mssql.
Chỉ trình bày trách nhiệm, các file dự kiến và tác động của thay đổi; không tự sinh toàn bộ dự án, không kết nối database.
```

#### 🤖 Nội dung AI phản hồi:
```text
Phân tích ánh xạ mã nguồn hiện tại sang Clean Architecture:
1. Thực trạng Service hiện tại:
   - Quy tắc nghiệp vụ (Business Rule): Kiểm tra định dạng maSV /^SV[0-9]{3}$/, kiểm tra email hợp lệ, họ tên không để trống.
   - Truy xuất dữ liệu (Data Access): Thao tác sinhVienList.find() và sinhVienList.push(newSinhVien).
   => Service đang bị lẫn lộn giữa nghiệp vụ và nơi lưu trữ.

2. Bốn thành phần cốt lõi trong Clean Architecture:
   - Entity: Đối tượng SinhVien nghiệp vụ (chứa các quy tắc bất biến của sinh viên).
   - Use Case: Thao tác người dùng yêu cầu (VD: ThemSinhVienUseCase, LayDanhSachSinhVienUseCase).
   - Interface (Hợp đồng): ISinhVienRepository định nghĩa các hàm: getAll(), findByMaSV(maSV), save(sinhVien).
   - Repository (Adapter): Lớp triển khai cụ thể:
     + Giai đoạn 1: MemorySinhVienRepository (lưu mảng RAM).
     + Giai đoạn sau: SqlSinhVienRepository (lưu vào SQL Server qua Sequelize/TypeORM).

3. Vì sao Service không được import Express hay mssql?
   - Tính độc lập: Tầng nghiệp vụ (Service / Use Case) là tài sản cốt lõi. Nếu Service phụ thuộc vào Express hay thư viện DB cụ thể, sau này muốn đổi framework (ví dụ Fastify, NestJS) hay đổi cơ sở dữ liệu (SQL Server sang PostgreSQL) sẽ làm hỏng toàn bộ logic nghiệp vụ.
```

---

### BÀI 10: KIỂM THỬ VỚI POSTMAN (TỰ ĐỘNG & BẢNG KIỂM THỬ)

#### 💬 Prompt 11 (Người dùng gửi AI):
```text
ROLE: Hướng dẫn tôi viết test Postman cho người mới.
CONTEXT: Backend quản lý sinh viên lưu mảng trong bộ nhớ. Tôi đã thêm SV003 thành công. Tôi đang dùng request POST /api/v1/sinh-vien để gửi lại cùng mã, server chưa restart.
EXPECTED: Phải trả status 409, success=false và message là chuỗi không rỗng. Không được thêm sinh viên trùng vào danh sách.
ACTUAL: Đây là status và body tôi nhận: status 409, {"success":false,"message":"Mã sinh viên đã tồn tại"}.
TASK: Trước tiên đối chiếu kết quả thực tế với yêu cầu; nếu sai thì chỉ ra, không thay kỳ vọng cho khớp lỗi. Viết script pm.test đặt ở Scripts > Post-response của request trùng mã để kiểm tra status, success và message.
OUTPUT: Giải thích từng test, nơi dán và cách xem Test Results. Hướng dẫn thêm một request GET để kiểm tra SV003 chỉ xuất hiện một lần; không khẳng định script chỉ đọc response POST đã chứng minh dữ liệu không trùng.
```

#### 🤖 Nội dung AI phản hồi:

##### Script Test Postman cho trường hợp trùng mã (409 Conflict):
Dán vào tab **Scripts > Post-response** (hoặc **Tests**) của Request `08 - Từ chối trùng SV003`:
```javascript
pm.test("Status code phai la 409", function () {
    pm.response.to.have.status(409);
});

pm.test("Dung cau truc loi va thong bao trung ma", function () {
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.be.a('string').and.not.empty;
});
```

---

## 📋 BẢNG 11 TEST CASE BẮT BUỘC (T01 - T11)

Chạy theo thứ tự trên một phiên server **vừa khởi động lại (chỉ có SV001 và SV002)**:

| ID | Tên Request | Method | URL / Body | Expected Status | Kết quả mong đợi & Xác minh thêm |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **T01** | Kiểm tra Server | GET | `{{baseUrl}}/` | **200** | Lời chào `Backend quản lý sinh viên đang hoạt động` |
| **T02** | Xem danh sách ban đầu | GET | `{{baseUrl}}/api/v1/sinh-vien` | **200** | data là mảng chứa đúng 2 sinh viên mẫu SV001 & SV002 |
| **T03** | Tìm sinh viên tồn tại | GET | `{{baseUrl}}/api/v1/sinh-vien/SV001` | **200** | data là object có `maSV: "SV001"`, tên Minh Nhật |
| **T04** | Tìm sinh viên không có | GET | `{{baseUrl}}/api/v1/sinh-vien/SV999` | **404** | `success: false`, `Không tìm thấy sinh viên` |
| **T05** | Thêm SV003 lần đầu | POST | `{{baseUrl}}/api/v1/sinh-vien`<br>Body: `{ "maSV": "SV003", "hoTen": "Ngọc Mai", "email": "ngocmai@example.com", "maLop": "25CT114" }` | **201** | `success: true`. GET lại danh sách thấy mảng tăng lên 3 sinh viên |
| **T06** | Thử thêm lại SV003 (trùng mã) | POST | Gửi lại cùng Body SV003 ngay sau T05 (chưa restart) | **409** | `success: false`, `Mã sinh viên đã tồn tại`. GET lại chỉ có đúng 1 SV003 |
| **T07** | Thử thiếu họ tên | POST | `{{baseUrl}}/api/v1/sinh-vien`<br>Body: `{ "maSV": "SV004", "email": "a@ex.com", "maLop": "25CT114" }` | **400** | `success: false`. GET `/api/v1/sinh-vien/SV004` trả về 404 (không bị lưu) |
| **T08** | Thử sai định dạng email | POST | Body: `{ "maSV": "SV004", "hoTen": "Minh", "email": "khong-phai-email", "maLop": "25CT114" }` | **400** | `success: false`, báo lỗi email. GET lại SV004 trả 404 |
| **T09** | Thử mã kiểu số | POST | Body: `{ "maSV": 4, "hoTen": "Minh", "email": "a@ex.com", "maLop": "25CT114" }` | **400** | `success: false`, từ chối kiểu số, không tự ép kiểu |
| **T10** | Thử JSON hỏng cú pháp | POST | Body: `{"maSV":"SV004"` (cố tình thiếu dấu ngoặc `}`) | **400** | Middleware bắt cú pháp trả JSON lỗi 400, không trả HTML lỗi |
| **T11** | Đường dẫn không tồn tại | GET | `{{baseUrl}}/khong-co` | **404** | `success: false`, `Không tìm thấy đường dẫn` |

---

## 🎯 6 CÂU HỎI VẤN ĐÁP CẦN NẮM VỮNG KHI BẢO VỆ BÀI

1. **Route, Controller và Service của chức năng lấy danh sách ở đâu?**
   - *Trả lời:*
     - Route ở `src/routes/sinhVien.routes.ts`: tiếp nhận request tại `/` (tiền tố `/api/v1/sinh-vien`), định tuyến phương thức GET tới hàm xử lý.
     - Controller ở `src/controllers/sinhVien.controller.ts`: hàm `getDanhSachSinhVien` nhận `req`, `res`, gọi Service và định dạng câu trả lời HTTP JSON.
     - Service ở `src/services/sinhVien.service.ts`: hàm `layDanhSachSinhVien` truy xuất mảng dữ liệu mẫu `sinhVienList` và trả về mảng DTO.

2. **Vì sao thêm sinh viên phải dùng POST có body?**
   - *Trả lời:* POST theo chuẩn RESTful là phương thức tạo mới tài nguyên. Dữ liệu một sinh viên gồm nhiều thông tin (`maSV`, `hoTen`, `email`, `maLop`) cần được gửi bảo mật trong Request Body (dạng JSON) thay vì đặt trên URL (Query String) để tránh bị lộ trên lịch sử trình duyệt và server access log.

3. **Vì sao nhận mã 409 có thể là một test đạt?**
   - *Trả lời:* Trong kiểm thử tự động, "đạt" (PASS) có nghĩa là hệ thống hành xử **đúng như mong đợi**. Khi cố tình gửi một mã sinh viên đã tồn tại, hệ thống phải phát hiện và từ chối với mã 409 (Conflict). Nếu hệ thống trả 200/201 tức là cho phép trùng mã, đó mới là lỗi nghiêm trọng.

4. **Vì sao phải GET lại sau khi POST?**
   - *Trả lời:* Mã 201 trả về từ API chỉ chứng minh Controller đã phản hồi, chưa chứng minh dữ liệu thực sự đã được ghi vào bộ nhớ. Việc gọi lại GET danh sách và GET theo mã giúp kiểm chứng tính toàn vẹn và thực tế của dữ liệu sau thao tác ghi.

5. **Vì sao restart server làm mất sinh viên vừa thêm?**
   - *Trả lời:* Ở Chương 2, dữ liệu đang được lưu tạm thời trên một mảng trong bộ nhớ RAM của tiến trình Node.js. Khi tắt server hoặc restart tiến trình, bộ nhớ RAM được giải phóng và khi server khởi động lại, biến `sinhVienList` sẽ được nạp lại về giá trị mặc định ban đầu.

6. **Bạn đã thay đổi gì trong yêu cầu gửi AI, và đã chứng minh thay đổi đó hoạt động ra sao?**
   - *Trả lời:* Tôi đã áp dụng khung Prompt có bối cảnh và ràng buộc rõ ràng (Context, Task, Constraint, Output): yêu cầu AI kiểm tra định dạng regex mã SV `^SV[0-9]{3}$`, cấm tự động ép kiểu số, và bắt buộc trả AppError thay vì tự ý kết nối DB hay tạo thư mục sai. Tôi chứng minh bằng cách chạy lệnh `pnpm build` không có lỗi biên dịch TypeScript, và kiểm thử 11 kịch bản Postman thực tế có kết quả khớp 100% kỳ vọng.
