// Налаштування турнірної таблиці (Supabase).
// Поки поля порожні, таблиця показує «скоро запрацює», а гра працює як звичайно.
// Як заповнити — див. LEADERBOARD.md
window.LEADERBOARD_CONFIG = {
  url: "https://eecnmjuxbpejqyafvtfj.supabase.co",      // наприклад: "https://abcdefgh.supabase.co"
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY25tanV4YnBlanF5YWZ2dGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NDgxMzYsImV4cCI6MjEwNzMyNDEzNn0.54U3mXMAO5VrtX634RD_yd-b_Bv0Hkfj7iS9tS3yOAI",   // Project Settings → API → anon public key
  // Пряме посилання на мініапку з @BotFather (див. ONLINE.md), наприклад "https://t.me/ukrmovych_bot/game".
  // Поки порожнє — друзі приєднуються до онлайн-ігор за кодом кімнати.
  telegramAppLink: "https://t.me/ukrmovych_bot/battle",
  // Сторінка підписки «Спільнота Укрмовича» в Base by mono. Порожнє — кнопки підписки не видно.
  proLink: "https://base.monobank.ua/sp/DG8NzmnGCQV3An"
};
