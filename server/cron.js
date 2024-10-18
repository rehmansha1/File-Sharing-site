import { CronJob } from "cron";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const job = new CronJob(
    '0 */14 * * * *', // cronTime (every 14 minutes)
    async function () {
    // Handle async tasks, e.g., fetching from an API
    try {
        // Send POST request to the specified URL
        const res = await axios.get(`${process.env.SERVER_SERVER_URL}`);
        console.log(`${process.env.SERVER_SERVER_URL}`);
      } catch (error) {
        // Log any error that occurs during the request
      }
  },
  null, // onComplete
  true, // start the job right away
  "America/Los_Angeles" // timeZone
);
