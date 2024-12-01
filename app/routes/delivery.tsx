import { useEffect } from "react";
import { webRTCService } from "~/services/webrtc";

export default function Delivery() {
  useEffect(() => {
    webRTCService.register('delivery');
  }, []);

  return <div>
    <p>Delivery</p>
    <button className="bg-blue-500 text-white p-2 rounded" onClick={() => webRTCService.call('owner')}>Call Owner</button>
  </div>;
}
