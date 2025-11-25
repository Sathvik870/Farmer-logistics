import React, { useState } from "react";
import { useSettings } from "../../context/admin/settings/useSettings.ts";
import { registerForPushNotifications } from "../../utils/pushManager.ts";
import { HiOutlineVolumeUp, HiOutlineBell } from "react-icons/hi";
import { useAlert } from '../../context/common/AlertContext';

const SettingsPage: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { showAlert } = useAlert();
  const [pushStatus, setPushStatus] = useState(Notification.permission);
  const handleSoundToggle = () => {
    setSettings({ isSoundEnabled: !settings.isSoundEnabled });
  };

  const handlePushToggle = async () => {
    if (Notification.permission === 'denied') {
        showAlert(
            "Push notifications are blocked. Please enable them in your browser's site settings.",
            "error"
        );
        return;
    }

    try {
        const success = await registerForPushNotifications('admin');
        if (success) {
            showAlert("Push notifications enabled successfully!", "success");
            setPushStatus("granted");
        } else {
            showAlert("Failed to enable push notifications. Please try again.", "error");
        }
    } catch (error) {
        console.error(error);
        showAlert("An unexpected error occurred while enabling push notifications.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Notification Settings
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineVolumeUp size={24} className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-800">New Order Sound</p>
                <p className="text-sm text-gray-500">
                  Play a sound when a new order arrives.
                </p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                settings.isSoundEnabled ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                  settings.isSoundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineBell size={24} className="text-gray-500" />
              <div>
                <p className="font-semibold text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts even when the app is in the background.</p>
              </div>
            </div>
            
            {pushStatus === 'granted' ? (
                <span className="text-sm font-bold text-green-600">Enabled</span>
            ) : (
                <button
                    onClick={handlePushToggle}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                >
                    Enable
                </button>
            )}
          </div>
      </div>
    </div>
  );
};

export default SettingsPage;
