# Database Setup Guide

## Cấu hình Database

### 1. Cài đặt MySQL
Đảm bảo bạn đã cài đặt MySQL server trên máy tính.

### 2. Tạo Database
```sql
CREATE DATABASE leetcode_ai_dev;
CREATE DATABASE leetcode_ai_test;
CREATE DATABASE leetcode_ai_prod;
```

### 3. Cấu hình Environment Variables
Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

Cập nhật các thông tin database trong file `.env`:
```env
# Database Configuration
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=leetcode_ai_dev
DB_HOST=localhost
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Chạy Migrations
```bash
# Chạy tất cả migrations
npm run db:migrate

# Hoặc chạy từng migration
npx sequelize-cli db:migrate
```

### 5. Seed Database (Dữ liệu mẫu)
```bash
# Chạy tất cả seeders
npm run db:seed

# Hoặc chạy từng seeder
npx sequelize-cli db:seed:all
```

### 6. Reset Database (Nếu cần)
```bash
# Xóa tất cả migrations và seeders, sau đó chạy lại
npm run db:reset
```

## Database Schema

### Tables
1. **Categories** - Danh mục bài tập
2. **Problems** - Bài tập lập trình
3. **TestCases** - Test cases cho mỗi bài tập
4. **Users** - Người dùng (cho tương lai)
5. **Submissions** - Kết quả nộp bài

### Relationships
- Category (1) -> (N) Problems
- Problem (1) -> (N) TestCases
- Problem (1) -> (N) Submissions
- User (1) -> (N) Submissions

## API Endpoints

### Categories
- `GET /api/categories` - Lấy tất cả categories
- `GET /api/categories/:id` - Lấy category theo ID
- `POST /api/categories` - Tạo category mới
- `PUT /api/categories/:id` - Cập nhật category
- `DELETE /api/categories/:id` - Xóa category

### Problems
- `GET /api/problems` - Lấy tất cả problems (có thể filter theo difficulty, categoryId)
- `GET /api/problems/:id` - Lấy problem theo ID
- `POST /api/problems` - Tạo problem mới
- `PUT /api/problems/:id` - Cập nhật problem
- `DELETE /api/problems/:id` - Xóa problem

### Submissions
- `GET /api/submissions` - Lấy tất cả submissions
- `POST /api/submissions` - Tạo submission mới

## Troubleshooting

### Lỗi kết nối database
1. Kiểm tra MySQL server đang chạy
2. Kiểm tra thông tin kết nối trong file `.env`
3. Kiểm tra database đã được tạo chưa

### Lỗi migration
```bash
# Xem trạng thái migrations
npx sequelize-cli db:migrate:status

# Undo migration cuối cùng
npx sequelize-cli db:migrate:undo

# Undo tất cả migrations
npx sequelize-cli db:migrate:undo:all
```

### Lỗi seeder
```bash
# Xem trạng thái seeders
npx sequelize-cli db:seed:status

# Undo seeder cuối cùng
npx sequelize-cli db:seed:undo

# Undo tất cả seeders
npx sequelize-cli db:seed:undo:all
```
