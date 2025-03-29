require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = process.env.SVPORT || 2083;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', async (req, res) => {
  const { account, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM StudentAccounts WHERE account_name = ?',
      [account]
    );

    if (rows.length === 0) {
      return res.send('帳號不存在');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      res.send(`歡迎登入：${user.account_name}`);
    } else {
      res.send('密碼錯誤，請再試一次');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/login.html`);
});