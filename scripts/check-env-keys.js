const fs = require('fs');
const t = fs.readFileSync('d:/ICON-KJSIM/.env', 'utf8');
const keys = [
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'SMS_ENABLED',
  'WHATSAPP_ENABLED',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'MONGODB_URI',
];
for (const k of keys) {
  const m = t.match(new RegExp('^' + k + '=(.*)$', 'm'));
  if (!m) {
    console.log(k + ': MISSING');
    continue;
  }
  let v = (m[1] || '').trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  const sensitive = /KEY|TOKEN|URI|SECRET|SID|PASSWORD|PASS/.test(k);
  if (!v) console.log(k + ': EMPTY');
  else if (/your_|change_me|re_your_resend|example\.com/.test(v)) console.log(k + ': PLACEHOLDER');
  else if (sensitive) console.log(k + ': SET (len=' + v.length + ')');
  else console.log(k + ': ' + v);
}
