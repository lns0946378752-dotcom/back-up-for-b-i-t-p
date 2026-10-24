/**
 * Bộ kịch bản kiểm thử tự động toàn diện cho API Backend Quản lý Sinh viên (Buổi 4).
 * Kiểm tra đầy đủ: Hợp đồng HTTP, Đọc/Ghi SQL Server, Kiểm tra tính bền vững, Xử lý trùng mã 409, Ma trận lỗi Validation 400.
 */

const BASE_URL = 'http://localhost:5000';
const results = [];

async function runTest(name, url, options, expectedStatus, validator) {
  try {
    const res = await fetch(url, options);
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }

    const statusMatch = res.status === expectedStatus;
    const customPass = validator ? validator(data) : true;
    const passed = statusMatch && customPass;

    results.push({
      name,
      expectedStatus,
      actualStatus: res.status,
      passed,
      response: data,
    });

    console.log(
      `${passed ? '✅ PASS' : '❌ FAIL'} | ${name} | Status: ${res.status} (Kỳ vọng: ${expectedStatus})`
    );
    if (!passed) {
      console.log('   Chi tiết response:', JSON.stringify(data));
    }
  } catch (error) {
    console.log(`❌ ERROR | ${name} | Ngoại lệ: ${error.message}`);
    results.push({
      name,
      expectedStatus,
      actualStatus: 0,
      passed: false,
      response: error.message,
    });
  }
}

async function main() {
  console.log('================================================================');
  console.log('BẮT ĐẦU CHẠY BỘ KIỂM THỬ API - BUỔI 4 (SQL SERVER + SEQUELIZE)');
  console.log('================================================================\n');

  // 1. Kiểm tra Route gốc /
  await runTest(
    'T01: GET / (Kiểm tra trạng thái server)',
    `${BASE_URL}/`,
    { method: 'GET' },
    200,
    (d) => d.success === true && d.message.includes('đang hoạt động')
  );

  // 2. Kiểm tra GET danh sách sinh viên
  await runTest(
    'T02: GET /api/v1/sinh-vien (Đọc danh sách từ SQL Server)',
    `${BASE_URL}/api/v1/sinh-vien`,
    { method: 'GET' },
    200,
    (d) => d.success === true && Array.isArray(d.data) && d.data.some((sv) => sv.maSV === 'SV001')
  );

  // 3. Kiểm tra GET sinh viên tồn tại SV001
  await runTest(
    'T03: GET /api/v1/sinh-vien/SV001 (Tìm sinh viên có trong DB)',
    `${BASE_URL}/api/v1/sinh-vien/SV001`,
    { method: 'GET' },
    200,
    (d) => d.success === true && d.data.maSV === 'SV001'
  );

  // 4. Kiểm tra GET sinh viên không tồn tại SV999 -> 404
  await runTest(
    'T04: GET /api/v1/sinh-vien/SV999 (Sinh viên không tồn tại)',
    `${BASE_URL}/api/v1/sinh-vien/SV999`,
    { method: 'GET' },
    404,
    (d) => d.success === false && d.message === 'Không tìm thấy sinh viên'
  );

  // 5. Kiểm tra GET URL không tồn tại -> 404
  await runTest(
    'T05: GET /khong-co (Đường dẫn không tồn tại)',
    `${BASE_URL}/khong-co`,
    { method: 'GET' },
    404,
    (d) => d.success === false && d.message === 'Không tìm thấy đường dẫn'
  );

  // 6. Kiểm tra GET SV003 (đã được lưu bền vững vào SQL Server)
  await runTest(
    'T06: GET /api/v1/sinh-vien/SV003 (Kiểm tra dữ liệu lưu bền vững sau restart)',
    `${BASE_URL}/api/v1/sinh-vien/SV003`,
    { method: 'GET' },
    200,
    (d) => d.success === true && d.data.maSV === 'SV003'
  );

  // 7. Kiểm tra POST trùng mã SV003 -> 409 Conflict
  await runTest(
    'T07: POST /api/v1/sinh-vien (Trùng mã SV003)',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'SV003',
        hoTen: 'Ngọc Mai',
        email: 'ngocmai@example.com',
        maLop: '25CT114',
      }),
    },
    409,
    (d) => d.success === false && d.message === 'Mã sinh viên đã tồn tại'
  );

  // 8. Ma trận lỗi Validation (HTTP 400)
  // Ca V1: Thiếu họ tên
  await runTest(
    'T08: POST thiếu hoTen -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'SV099',
        hoTen: '   ',
        email: 'test@example.com',
        maLop: '25CT114',
      }),
    },
    400,
    (d) => d.success === false
  );

  // Ca V2: maSV sai định dạng
  await runTest(
    'T09: POST maSV sai định dạng (ABC004) -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'ABC004',
        hoTen: 'Nguyen Van A',
        email: 'vana@example.com',
        maLop: '25CT114',
      }),
    },
    400,
    (d) => d.success === false
  );

  // Ca V3: Email sai định dạng
  await runTest(
    'T10: POST email không hợp lệ -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'SV099',
        hoTen: 'Nguyen Van B',
        email: 'khong-phai-email',
        maLop: '25CT114',
      }),
    },
    400,
    (d) => d.success === false
  );

  // Ca V4: Thiếu mã lớp
  await runTest(
    'T11: POST thiếu maLop -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'SV099',
        hoTen: 'Nguyen Van C',
        email: 'vanc@example.com',
        maLop: '   ',
      }),
    },
    400,
    (d) => d.success === false
  );

  // Ca V5: hoTen vượt quá 150 ký tự
  await runTest(
    'T12: POST hoTen vượt quá 150 ký tự -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maSV: 'SV099',
        hoTen: 'A'.repeat(151),
        email: 'longname@example.com',
        maLop: '25CT114',
      }),
    },
    400,
    (d) => d.success === false
  );

  // Ca V6: JSON hỏng cú pháp
  await runTest(
    'T13: POST body JSON cú pháp lỗi -> 400',
    `${BASE_URL}/api/v1/sinh-vien`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"maSV":"SV099", "hoTen": ',
    },
    400,
    (d) => d.success === false
  );

  console.log('\n================================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(
    `TỔNG KẾT: ${results.filter((r) => r.passed).length}/${results.length} TEST CASES ĐẠT THÀNH CÔNG!`
  );
  console.log('================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

main();
