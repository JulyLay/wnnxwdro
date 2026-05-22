import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const prerender = false;

export const POST: APIRoute = async () => {
  const merchantAccount = import.meta.env.WAYFORPAY_MERCHANT_ACCOUNT;
  const secretKey = import.meta.env.WAYFORPAY_SECRET_KEY;

  if (!merchantAccount || !secretKey) {
    return new Response(
      JSON.stringify({ error: 'Wayforpay credentials not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const orderReference = `ORDER-${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);
  const amount = 149;
  const currency = 'UAH';
  const merchantDomainName = 'yuliialaiko.com';
  const productName = ['Стратсесія 1 з 3 — позиціонування і оффер за 3 години'];
  const productCount = [1];
  const productPrice = [amount];

  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice,
  ].join(';');

  const merchantSignature = crypto
    .createHmac('md5', secretKey)
    .update(signatureString)
    .digest('hex');

  return new Response(
    JSON.stringify({
      merchantAccount,
      merchantAuthType: 'SimpleSignature',
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productCount,
      productPrice,
      merchantSignature,
      returnUrl: 'https://yuliialaiko.com/thank-you',
      serviceUrl: 'https://yuliialaiko.com/api/wayforpay-callback',
      language: 'UA',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
