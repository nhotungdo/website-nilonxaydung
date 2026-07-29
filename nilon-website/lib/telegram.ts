/**
 * Utility to send messages to Telegram Bot (Optimized for Vercel Serverless)
 */

function escapeHTML(str: string) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendTelegramMessage(message: string) {
  // Sanitize environment variables (remove spaces or surrounding quotes if added on Vercel Dashboard)
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^["']|["']$/g, '');
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim().replace(/^["']|["']$/g, '');

  if (!botToken || !chatId) {
    console.error('[Telegram Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Environment Variables.');
    return { success: false, error: 'Server configuration error: Missing Telegram Token or Chat ID' };
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      // Ensure Vercel serverless fetch does not cache
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Telegram API Failed]', { status: response.status, data });
      return { success: false, error: data.description || 'Telegram API error' };
    }

    console.log('[Telegram Success] Message sent successfully to Chat ID:', chatId);
    return { success: true, data };
  } catch (error: unknown) {
    console.error('[Telegram Fetch Exception]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
    return { success: false, error: errorMessage };
  }
}

export { escapeHTML };
