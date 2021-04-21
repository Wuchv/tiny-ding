import { Subscription, Observable } from 'rxjs';

type IcecandidateListener = (e: RTCPeerConnectionIceEvent) => void;

export interface RTCPeer {
  icecandidate$: Observable<RTCPeerConnectionIceEvent>;
  track$: Observable<RTCTrackEvent>;

  addConnection(
    fromId: string,
    toId: string,
    onicecandidate: IcecandidateListener,
    addIceCandidateSub: Subscription
  ): void;
  setConnection(fromId: string, toId: string): void;
  addIceCandidate(iceCandidate: RTCIceCandidate): void;
  createLocalSDP(): Promise<RTCSessionDescriptionInit>;
  setRemoteSDP(answer: RTCSessionDescriptionInit): void;
  acceptRemoteSDP(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit>;
  close(fromId: string, toId: string): void;
}
