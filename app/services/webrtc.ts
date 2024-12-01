import { io, Socket } from 'socket.io-client';
import { useCallStore } from '~/components/CallNotification';

class WebRTCService {
  public socket: Socket;
  private peerConnection: RTCPeerConnection | null = null;
  private userId: string | null = null;

  constructor() {
    this.socket = io(import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:3000');
    this.setupSocketListeners();
  }

  public register(userId: string) {
    this.userId = userId;
    this.socket.emit('register', userId);
  }

  private async setupSocketListeners() {
    this.socket.on('incomingCall', async ({ from, offer }) => {
      useCallStore.getState().setCall(true, from);
      
      if (typeof window !== 'undefined') {
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        this.socket.emit('answerCall', { 
          answer, 
          to: from 
        });

        window.location.href = '/call';
      }
    });

    this.socket.on('callAnswered', async ({ answer }) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
  }

  public async acceptCall() {
    if (!this.peerConnection) {
      console.error('Peer connection not initialized');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      stream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, stream);
      });

    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  }

  public declineCall() {
    const caller = useCallStore.getState().caller;
    if (caller) {
      this.socket.emit('callDeclined', { to: caller });
    }
    this.cleanup();
    window.location.href = '/';
  }

  public call(to: string) {
    this.socket.emit('callRequest', { to, from: this.userId });
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  private cleanup() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export const webRTCService = new WebRTCService(); 