import 'dotenv/config';
import { Sequelize } from 'sequelize';

/**
 * Đọc và kiểm tra các biến môi trường bắt buộc cho kết nối SQL Server.
 * Báo rõ tên biến nếu thiếu nhưng tuyệt đối không log giá trị mật khẩu.
 */
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST ?? '127.0.0.1';

const missingVars: string[] = [];
if (!DB_NAME) missingVars.push('DB_NAME');
if (!DB_USER) missingVars.push('DB_USER');
if (!DB_PASSWORD) missingVars.push('DB_PASSWORD');

if (missingVars.length > 0) {
  throw new Error(
    `[DATABASE CONFIG ERROR] Thiếu các biến môi trường bắt buộc: ${missingVars.join(', ')}`
  );
}

// Xử lý cổng DB_PORT thành số nguyên hợp lệ trong khoảng 1..65535
const rawPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433;
if (isNaN(rawPort) || rawPort < 1 || rawPort > 65535) {
  throw new Error(`[DATABASE CONFIG ERROR] DB_PORT không hợp lệ: ${process.env.DB_PORT}`);
}
const DB_PORT = rawPort;

/**
 * Chuyển đổi an toàn giá trị cấu hình Tedious (encrypt và trustServerCertificate).
 * Tránh lỗi Boolean("false") === true trong JavaScript.
 */
const isEncrypt = process.env.DB_ENCRYPT !== 'false';
const isTrustCert = process.env.DB_TRUST_CERT === 'true';

/**
 * Instance Sequelize 6 dùng chung toàn bộ ứng dụng.
 * Lưu ý: dialect: 'mssql', sử dụng driver 'tedious'.
 * Cấu hình pool giữ kết nối ấm (min: 2) và timeout 60s để đảm bảo ổn định tuyệt đối trên môi trường máy ảo.
 */
export const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mssql',
  logging: console.log,
  pool: {
    max: 10,
    min: 2,
    acquire: 60000,
    idle: 300000,
  },
  dialectOptions: {
    options: {
      encrypt: isEncrypt,
      trustServerCertificate: isTrustCert,
      connectTimeout: 60000,
      requestTimeout: 60000,
    },
  },
});
