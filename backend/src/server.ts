import { createApp } from "./app";
import { env } from "./config/env";
import { startCriminalRecordReminderJob } from "./jobs/criminalRecordReminder";

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`MobiBenin backend demarre sur http://localhost:${env.port}`);
  startCriminalRecordReminderJob();
});
