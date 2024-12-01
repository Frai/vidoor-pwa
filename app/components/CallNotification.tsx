import { useEffect } from 'react';
import { create } from 'zustand';
import { webRTCService } from '~/services/webrtc';

interface CallState {
  isReceivingCall: boolean;
  caller: string | null;
  setCall: (isReceivingCall: boolean, caller?: string | null) => void;
}

const useCallStore = create<CallState>((set) => ({
  isReceivingCall: false,
  caller: null,
  setCall: (isReceivingCall, caller = null) => set({ isReceivingCall, caller }),
}));

export function CallNotification() {
  const { isReceivingCall, caller, setCall } = useCallStore();

  const handleAccept = () => {
    webRTCService.acceptCall();
    setCall(false);
  };

  const handleDecline = () => {
    webRTCService.declineCall();
    setCall(false);
  };

  if (!isReceivingCall) {
    return <div>No call</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm">
      <div className="flex flex-col gap-3">
        <p className="font-medium">
          Incoming call from Delivery Person
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

// Export for use in webRTC service
export { useCallStore }; 