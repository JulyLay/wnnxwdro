import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const secretKey = import.meta.env.WAYFORPAY_SECRET_KEY;

    // Перевірка підпису від Wayforpay
    const {
      merchantAccount,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode,
      merchantSignature: receivedSignature,
      email,
    } = body;

    const signatureString = [
      merchantAccount,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode,
    ].join(';');

    const expectedSignature = crypto
      .createHmac('md5', secretKey)
      .update(signatureString)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      console.error('[wayforpay-callback] Invalid signature');
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Логуємо успішну оплату
    if (transactionStatus === 'Approved') {
      console.log(`[wayforpay-callback] ✅ Payment approved: ${orderReference}, email: ${email}`);

      // TODO: відправити email через Resend або MailerLite
      // Приклад з Resend:
      // const resend = new Resend(import.meta.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'Юлія Лайко <hello@yuliialaiko.com>',
      //   to: email,
      //   subject: 'Ти на стратсесії — ось Zoom-посилання 🎉',
      //   html: `<p>Дякую за оплату! Zoom: <a href="${import.meta.env.ZOOM_LINK}">${import.meta.env.ZOOM_LINK}</a></p>`,
      // });
    } else {
      console.log(`[wayforpay-callback] ⚠️ Payment status: ${transactionStatus}, order: ${orderReference}`);
    }

    // Відповідь для Wayforpay (обов'язковий формат)
    const responseTime = Math.floor(Date.now() / 1000);
    const responseSignatureString = `${orderReference};accept;${responseTime}`;
    const responseSignature = crypto
      .createHmac('md5', secretKey)
      .update(responseSignatureString)
      .digest('hex');

    return new Response(
      JSON.stringify({
        orderReference,
        status: 'accept',
        time: responseTime,
        signature: responseSignature,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[wayforpay-callback] Error:', err);
    return new Response(
      JSON.stringify({ status: 'error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
