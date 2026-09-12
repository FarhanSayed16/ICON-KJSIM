/**
 * Quick email delivery test.
 * Usage:
 *   node --env-file=.env scripts/send-test-email.js you@example.com
 */
const { Resend } = require('resend');

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error('Usage: node --env-file=.env scripts/send-test-email.js you@example.com');
    process.exit(1);
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('❌ RESEND_API_KEY is missing in .env');
    console.error('   1) Create account at https://resend.com');
    console.error('   2) API Keys → Create');
    console.error('   3) Add: RESEND_API_KEY=re_xxxx to .env');
    console.error('   4) Restart npm run dev');
    process.exit(1);
  }

  const from =
    process.env.EMAIL_FROM ||
    'ICON 2026 | K J Somaiya Institute of Management <onboarding@resend.dev>';
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  const resend = new Resend(key);

  console.log('Sending test email...');
  console.log('  From:', from);
  if (replyTo) console.log('  Reply-To:', replyTo);
  console.log('  To:  ', to);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    ...(replyTo ? { replyTo } : {}),
    subject: 'ICON 2026 | KJSIM — Test Email',
    html: `<div style="font-family:sans-serif;padding:20px;color:#333">
      <div style="background:#b71c1c;padding:16px;text-align:center">
        <h1 style="color:#fff;margin:0">ICON 2026</h1>
        <p style="color:#ffcdd2;margin:8px 0 0">K J Somaiya Institute of Management</p>
      </div>
      <p style="margin-top:20px">Hi Farhan,</p>
      <p>If you received this, email delivery for ICON 2026 is working.</p>
      <p style="color:#666;font-size:13px">Sent at: ${new Date().toISOString()}</p>
    </div>`,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    console.error('\nCommon fixes:');
    console.error('- Free tier with onboarding@resend.dev can only send to YOUR Resend login email');
    console.error('- Custom EMAIL_FROM domain must be verified in Resend → Domains');
    console.error('- Check API key is valid (starts with re_)');
    process.exit(1);
  }

  console.log('✅ Sent! Resend id:', data?.id);
  console.log('Check inbox (and spam) for:', to);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
