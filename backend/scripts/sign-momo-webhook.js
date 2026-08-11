// Aide de developpement : genere un appel curl signe pour simuler un webhook
// Mobile Money valide, sans attendre l'auto-confirmation.
// Usage : node scripts/sign-momo-webhook.js <reference> [SUCCESS|FAILED]
require("dotenv/config");
const crypto = require("node:crypto");

const reference = process.argv[2];
const status = process.argv[3] || "SUCCESS";
const secret = process.env.MOMO_WEBHOOK_SECRET;

if (!reference) {
  console.error("Usage: node scripts/sign-momo-webhook.js <reference> [SUCCESS|FAILED]");
  process.exit(1);
}
if (!secret) {
  console.error("MOMO_WEBHOOK_SECRET n'est pas defini dans .env");
  process.exit(1);
}

const body = JSON.stringify({ reference, status });
const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

console.log("Corps a envoyer tel quel (ne pas reformater, la signature porte sur ces octets exacts) :\n");
console.log(body);
console.log("\nCommande curl prete a l'emploi :\n");
console.log(
  `curl -X POST http://localhost:${process.env.PORT || 4000}/wallet/webhooks/momo \\\n` +
    `  -H "Content-Type: application/json" \\\n` +
    `  -H "x-momo-signature: ${signature}" \\\n` +
    `  -d '${body}'`
);
