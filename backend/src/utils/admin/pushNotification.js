const webpush = require("web-push");
const db = require("../../config/db");
const logger = require("../../config/logger");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.subscribeAdmin = async (subscription) => {
  try {
    const query = `
      INSERT INTO admin_subscriptions (endpoint, keys)
      VALUES ($1, $2)
      ON CONFLICT (endpoint) DO NOTHING;
    `;
    await db.query(query, [
      subscription.endpoint,
      JSON.stringify(subscription.keys),
    ]);
    logger.info("[PUSH] New admin subscription saved.");
  } catch (error) {
    logger.error(`[PUSH] Failed to save subscription: ${error.message}`);
  }
};

exports.sendPushToAdmins = async (payload) => {
  try {
    const { rows } = await db.query("SELECT * FROM admin_subscriptions");

    const notifications = rows.map((sub) => {
      const subscription = {
        endpoint: sub.endpoint,
        keys: typeof sub.keys === "string" ? JSON.parse(sub.keys) : sub.keys,
      };

      return webpush
        .sendNotification(subscription, JSON.stringify(payload))
        .catch((err) => {
          console.error("Push send FAILED:", err);
          if (err.statusCode === 410 || err.statusCode === 404) {
            db.query("DELETE FROM admin_subscriptions WHERE id = $1", [sub.id]);
          }
        });
    });

    await Promise.all(notifications);
    logger.info(`[PUSH] Sent notifications to ${rows.length} admin devices.`);
  } catch (error) {
    logger.error(`[PUSH] Error sending push notifications: ${error.message}`);
  }
};
