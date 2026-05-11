export async function sendTelegramMessage(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { success: false, error: "Telegram configuration missing" };
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Telegram API Error for chat ${chatId}:`, data);
      return { success: false, error: data.description || "Unknown error" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return { success: false, error: "Internal server error" };
  }
}
