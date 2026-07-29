/**
 * Utility to send messages to Telegram Bot (Optimized for Vercel Serverless & Robust HTML Fallback)
 */

function escapeHTML(str: string) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendTelegramMessage(message: string) {
  // Sanitize environment variables (remove whitespace or surrounding quotes if added on Vercel Dashboard)
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^["']|["']$/g, '');
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim().replace(/^["']|["']$/g, '');

  if (!botToken || !chatId) {
    console.error('[Telegram Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Environment Variables.');
    return { 
      success: false, 
      error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Vercel Environment Variables.' 
    };
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    // First attempt: HTML parse_mode
    let response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      cache: 'no-store'
    });

    let data = await response.json();

    // If HTML parsing failed due to special characters, fallback to plain text (stripping HTML tags)
    if (!response.ok && data?.description?.includes('parse')) {
      console.warn('[Telegram Warning] HTML parse failed, retrying in plain text mode:', data.description);
      const plainText = message.replace(/<[^>]*>/g, '');
      response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_web_page_preview: true,
        }),
        cache: 'no-store'
      });
      data = await response.json();
    }

    if (!response.ok) {
      console.error('[Telegram API Failed]', { status: response.status, description: data?.description });
      return { success: false, error: data?.description || 'Telegram API returned error' };
    }

    console.log('[Telegram Success] Message delivered to chat:', chatId);
    return { success: true, data };
  } catch (error: unknown) {
    console.error('[Telegram Fetch Exception]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
    return { success: false, error: errorMessage };
  }
}

export { escapeHTML };
