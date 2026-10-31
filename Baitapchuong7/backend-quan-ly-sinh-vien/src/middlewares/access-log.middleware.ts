import fs from 'node:fs';
import path from 'node:path';
import morgan from 'morgan';

// Tạo thư mục logs nếu chưa tồn tại
const logsDir = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logsDir, { recursive: true });

// Đường dẫn file access.log
const logFile = path.join(logsDir, 'access.log');

// Mở stream ghi file với cờ 'a' (append: ghi nối tiếp vào cuối file khi server restart)
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

export const accessLogger = morgan('combined', {
  stream: logStream,
});
