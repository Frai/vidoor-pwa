import { useEffect, useState } from "react";
import { webRTCService } from "~/services/webrtc";

export default function Owner() {
  const [callId, setCallId] = useState<string | null>(null);

  useEffect(() => {
    webRTCService.register('owner');
  }, []);

  // checks if theres a call request
  useEffect(() => {
    webRTCService.on('incomingCall', ({ callId }) => {
      setCallId(callId);
    });
  }, []);
  
  return <div>
    <p>Owner</p>
    {callId && <button className="bg-blue-500 text-white p-2 rounded" onClick={() => webRTCService.acceptCall()}>Accept</button>}
    {callId && <button className="bg-red-500 text-white p-2 rounded" onClick={() => webRTCService.declineCall()}>Decline</button>}
  </div>;
}
