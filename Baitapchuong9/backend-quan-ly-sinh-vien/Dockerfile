# ==============================================================================
# DOCKERFILE MULTI-STAGE: BACKEND QUẢN LÝ SINH VIÊN (CHƯƠNG 09 - LAB 3)
# Base: Node.js 22 LTS Bookworm Slim | Package Manager: pnpm | Runtime: TypeScript ESM
# ==============================================================================

# STAGE 1: Biên dịch mã nguồn (Build Stage)
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Kích hoạt corepack để sử dụng pnpm đồng bộ phiên bản
RUN corepack enable

# Sao chép file cấu hình phụ thuộc trước để tận dụng Docker layer cache
COPY package.json pnpm-lock.yaml ./

# Cài đặt toàn bộ dependencies phục vụ compile TypeScript
RUN pnpm install --frozen-lockfile

# Sao chép mã nguồn và cấu hình build
COPY tsconfig*.json ./
COPY src ./src
COPY docs ./docs

# Biên dịch TypeScript ra mã JavaScript chuẩn (thư mục dist/)
RUN pnpm build

# STAGE 2: Môi trường chạy thực thi nhẹ (Runtime Stage)
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN corepack enable

# Sao chép package.json để cài duy nhất production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Sao chép sản phẩm đã build và tài nguyên tĩnh từ Stage 1
COPY --from=build /app/dist ./dist
COPY --from=build /app/docs ./docs
COPY public ./public

# Tạo thư mục uploads đảm bảo quyền ghi cho ảnh đại diện avatar
RUN mkdir -p /app/public/uploads

# Mở cổng API
EXPOSE 5000

# Khởi chạy ứng dụng
CMD ["node", "dist/server.js"]
