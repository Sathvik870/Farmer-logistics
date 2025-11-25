import api from "../api";

const PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerForPushNotifications = async (
  userType: "admin" | "customer"
) => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.error("Push not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      });
    }
    const subscribeUrl =
      userType === "admin"
        ? "/api/admin/push/subscribe"
        : "/api/customer/push/subscribe";

    const subscribe = await api.post(subscribeUrl, subscription);
    console.log("Push Registered:", subscribe);
    return true;
  } catch (error) {
    console.error("Push Registration Failed:", error);
    return false;
  }
};

export const unsubscribeFromPushNotifications = async () => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await api.post('/api/customer/push/unsubscribe', subscription);
      await subscription.unsubscribe();
      console.log('Push Unsubscribed');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Push Unsubscription Failed:', error);
    return false;
  }
};