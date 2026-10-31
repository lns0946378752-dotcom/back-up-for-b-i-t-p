import fs from 'fs';
import path from 'path';

const collection = {
  info: {
    _postman_id: 'b7a8c9d0-e1f2-4a5b-8c9d-0e1f2a3b4c5d',
    name: 'Buoi7-JWT-RBAC',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:5000', type: 'string' },
    { key: 'studentToken', value: '', type: 'string' },
    { key: 'adminToken', value: '', type: 'string' },
    { key: 'testMaSV', value: 'SV_C6_99', type: 'string' },
  ],
  item: [
    {
      name: '01. Auth - Register & Login (A01 - A12)',
      item: [
        {
          name: 'A01 - Register student moi (201)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 201", function () { pm.response.to.have.status(201); });',
                  'pm.test("Role is student", function () { var json = pm.response.json(); pm.expect(json.data.role).to.eql("student"); });',
                  'pm.test("No passwordHash returned", function () { var json = pm.response.json(); pm.expect(json.data.passwordHash).to.be.undefined; });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  fullName: 'Nguyen Minh An',
                  email: 'an.lab@example.com',
                  password: 'SinhVien@123',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/register',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'register'],
            },
          },
        },
        {
          name: 'A02 - Register trung email A01 (409)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 409 Conflict", function () { pm.response.to.have.status(409); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  fullName: 'Nguyen Minh An Trung',
                  email: 'an.lab@example.com',
                  password: 'SinhVien@123',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/register',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'register'],
            },
          },
        },
        {
          name: 'A03 - Register body them role=admin (400)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 400 Bad Request", function () { pm.response.to.have.status(400); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  fullName: 'Hacker Student',
                  email: 'hacker@example.com',
                  password: 'SinhVien@123',
                  role: 'admin',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/register',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'register'],
            },
          },
        },
        {
          name: 'A04 - Register thieu password hoac email sai (400)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 400 Bad Request", function () { pm.response.to.have.status(400); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  fullName: 'Loi Dinh Dang',
                  email: 'email_khong_hop_le',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/register',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'register'],
            },
          },
        },
        {
          name: 'A05 - Login dung student (200 & save token)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Has accessToken", function () { pm.expect(json.data.accessToken).to.be.a("string"); });',
                  'if (json.data && json.data.accessToken) { pm.collectionVariables.set("studentToken", json.data.accessToken); }',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  email: 'an.lab@example.com',
                  password: 'SinhVien@123',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/login',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'login'],
            },
          },
        },
        {
          name: 'A06 - Login sai password (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  email: 'an.lab@example.com',
                  password: 'WrongPassword@999',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/login',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'login'],
            },
          },
        },
        {
          name: 'A07 - Login email khong ton tai (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  email: 'nonexistent.user.2026@example.com',
                  password: 'SinhVien@123',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/login',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'login'],
            },
          },
        },
        {
          name: 'A08 - GET profile khong co token (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{baseUrl}}/api/auth/profile',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'profile'],
            },
          },
        },
        {
          name: 'A09 - Profile voi token bi sua 1 ky tu (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{studentToken}}X' }],
            url: {
              raw: '{{baseUrl}}/api/auth/profile',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'profile'],
            },
          },
        },
        {
          name: 'A10 - Profile voi JWT student hop le (200)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("User email matches", function () { pm.expect(json.data.email).to.eql("an.lab@example.com"); });',
                  'pm.test("No passwordHash", function () { pm.expect(json.data.passwordHash).to.be.undefined; });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{studentToken}}' }],
            url: {
              raw: '{{baseUrl}}/api/auth/profile',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'profile'],
            },
          },
        },
        {
          name: 'A11 - Profile voi token het han (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'GET',
            header: [
              {
                key: 'Authorization',
                value:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.X',
              },
            ],
            url: {
              raw: '{{baseUrl}}/api/auth/profile',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'profile'],
            },
          },
        },
        {
          name: 'A12 - Login Admin (200 & save adminToken)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Has accessToken", function () { pm.expect(json.data.accessToken).to.be.a("string"); });',
                  'if (json.data && json.data.accessToken) { pm.collectionVariables.set("adminToken", json.data.accessToken); }',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  email: 'admin.lab@example.com',
                  password: 'Admin@Secure2026!',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/auth/login',
              host: ['{{baseUrl}}'],
              path: ['api', 'auth', 'login'],
            },
          },
        },
      ],
    },
    {
      name: '02. RBAC - Phan quyen SinhVien (B01 - B12)',
      item: [
        {
          name: 'B01 - GET danh sach khong JWT (200 Public)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("data is array", function () { pm.expect(json.data).to.be.an("array"); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B02 - POST SinhVien khong JWT (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  maSV: '{{testMaSV}}',
                  hoTen: 'Sinh Vien Khong Token',
                  email: 'sv_notoken@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B03 - PUT SinhVien token khong hop le (401)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 401 Unauthorized", function () { pm.response.to.have.status(401); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'PUT',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer token_sai_chu_ky' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  hoTen: 'Sinh Vien Fake',
                  email: 'fake@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/SV01',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', 'SV01'],
            },
          },
        },
        {
          name: 'B04 - DELETE SinhVien voi JWT student (403)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 403 Forbidden", function () { pm.response.to.have.status(403); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'DELETE',
            header: [{ key: 'Authorization', value: 'Bearer {{studentToken}}' }],
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/SV01',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', 'SV01'],
            },
          },
        },
        {
          name: 'B05 - POST SinhVien voi JWT student (403)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 403 Forbidden", function () { pm.response.to.have.status(403); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{studentToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  maSV: '{{testMaSV}}',
                  hoTen: 'Student Hacker Post',
                  email: 'hacker_post@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B06 - PUT SinhVien voi JWT student (403)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 403 Forbidden", function () { pm.response.to.have.status(403); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'PUT',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{studentToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  hoTen: 'Student Hacker Put',
                  email: 'hacker_put@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/SV01',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', 'SV01'],
            },
          },
        },
        {
          name: 'B07 - POST SinhVien hop le bang Admin (201)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 201", function () { pm.response.to.have.status(201); });',
                  'var json = pm.response.json();',
                  'pm.test("Created maSV matches", function () { pm.expect(json.data.maSV).to.eql(pm.collectionVariables.get("testMaSV")); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{adminToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  maSV: '{{testMaSV}}',
                  hoTen: 'Sinh Vien Chuong Sau',
                  email: 'svc6_99@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B08 - PUT SinhVien hop le bang Admin (200)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Updated hoTen matches", function () { pm.expect(json.data.hoTen).to.eql("Sinh Vien Chuong Sau Da Sua"); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'PUT',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{adminToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  hoTen: 'Sinh Vien Chuong Sau Da Sua',
                  email: 'svc6_99_updated@example.com',
                  maLop: 'D21_TH02',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/{{testMaSV}}',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', '{{testMaSV}}'],
            },
          },
        },
        {
          name: 'B09 - DELETE SinhVien hop le bang Admin (200)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'DELETE',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/{{testMaSV}}',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', '{{testMaSV}}'],
            },
          },
        },
        {
          name: 'B10 - Admin POST body sai Zod (400)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 400 Bad Request", function () { pm.response.to.have.status(400); });',
                  'var json = pm.response.json();',
                  'pm.test("Has errors array", function () { pm.expect(json.errors).to.be.an("array"); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{adminToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  maSV: 'sv_viet_thuong_sai_regex',
                  hoTen: '',
                  email: 'email_sai',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B11 - Admin POST maSV da ton tai (409)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 409 Conflict", function () { pm.response.to.have.status(409); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{adminToken}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  maSV: 'SV01',
                  hoTen: 'Trung Ma SV01',
                  email: 'trung@example.com',
                  maLop: 'D21_TH01',
                },
                null,
                2
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien'],
            },
          },
        },
        {
          name: 'B12 - DELETE cung ma lan thu 2 bang Admin (404)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 404 Not Found", function () { pm.response.to.have.status(404); });',
                ],
                type: 'text/javascript',
              },
            },
          ],
          request: {
            method: 'DELETE',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: {
              raw: '{{baseUrl}}/api/v1/sinh-vien/{{testMaSV}}',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'sinh-vien', '{{testMaSV}}'],
            },
          },
        },
      ],
    },
  ],
};

const outputPath = path.resolve('postman/Buoi7-JWT-RBAC.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Collection written successfully to:', outputPath);
