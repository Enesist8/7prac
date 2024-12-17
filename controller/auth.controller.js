const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const result = await db.query(
      "SELECT id, login, password, role FROM person WHERE login = $1", // Добавьте поле role в запрос
      [login],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const dbUser = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    // Роль теперь доступна напрямую из dbUser
    const token = generateJWT(dbUser.id, dbUser.login, dbUser.role);
    res.json({ token, role: dbUser.role }); // Возвращаем роль в ответе
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Ошибка авторизации" });
  }
};

// Функция getUserByLogin больше не нужна

function generateJWT(userId, login, role) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not set!");
    return null;
  }
  return jwt.sign({ userId, login, role }, secret, { expiresIn: "1h" });
}
