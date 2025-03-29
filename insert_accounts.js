require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcrypt');

// 輸入要建立帳號的學號清單
const studentAccounts = [
  '411630212',
  '411630121',
  '411630816',
  '411631020',
  '411630097'
];

const DEFAULT_PASSWORD = 'tkuim113';

(async () => {
  for (const studentId of studentAccounts) {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    try {
      await db.execute(
        `INSERT INTO StudentAccounts (student_id, account_name, password_hash)
         VALUES (?, ?, ?)`,
        [studentId, studentId, hashedPassword]
      );
      console.log(`新增帳號 ${studentId}`);
    } catch (err) {
      console.error(`無法新增 ${studentId}：`, err.message);
    }
  }

  process.exit();
})();