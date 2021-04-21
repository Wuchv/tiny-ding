// Real-Time Video，实时的视频流传输
import { fromEvent, Subscription, Observable } from 'rxjs';

type IcecandidateListener = (e: RTCPeerConnectionIceEvent) => void;

export default class RTCPeer implements IRTCPeer {
  private peerConnectionMap: Map<
    string,
    [RTCPeerConnection, Subscription, Subscription]
  >;
  private peerConnection: RTCPeerConnection;

  constructor() {
    this.peerConnectionMap = new Map<
      string,
      [RTCPeerConnection, Subscription, Subscription]
    >();
  }

  public get addStream$() {
    return fromEvent(this.peerConnection, 'onaddstream');
  }

  public get icecandidate$() {
    return fromEvent(
      this.peerConnection,
      'onicecandidate'
    ) as Observable<RTCPeerConnectionIceEvent>;
  }

  public get track$() {
    return fromEvent(
      this.peerConnection,
      'ontrack'
    ) as Observable<RTCTrackEvent>;
  }

  private getSubscription(fn: IcecandidateListener) {
    return fromEvent(this.peerConnection, 'onicecandidate').subscribe(fn);
  }

  public addConnection(
    fromId: string,
    toId: string,
    onicecandidate: IcecandidateListener,
    addIceCandidateSub: Subscription
  ) {
    const key = this.calcKey(fromId, toId);
    this.peerConnection = new RTCPeerConnection();
    const peerConnectionIcecandidateSub = this.getSubscription(onicecandidate);
    this.peerConnectionMap.set(key, [
      this.peerConnection,
      peerConnectionIcecandidateSub,
      addIceCandidateSub,
    ]);
  }

  public setConnection(fromId: string, toId: string) {
    const [connection] = this.peerConnectionMap.get(this.calcKey(fromId, toId));
    this.peerConnection = connection;
  }

  public addIceCandidate(iceCandidate: RTCIceCandidate) {
    this.peerConnection.addIceCandidate(iceCandidate);
  }

  public async createLocalSDP(): Promise<RTCSessionDescriptionInit> {
    const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  public setRemoteSDP(answer: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(answer);
  }

  public async acceptRemoteSDP(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  public close(fromId: string, toId: string) {
    const key = this.calcKey(fromId, toId);
    const [
      peerConnection,
      peerConnectionIcecandidateSub,
      addIceCandidateSub,
    ] = this.peerConnectionMap.get(key);
    peerConnection.close();
    peerConnectionIcecandidateSub.unsubscribe();
    addIceCandidateSub.unsubscribe();
    this.peerConnectionMap.delete(key);
  }

  private calcKey(fromId: string, toId: string): string {
    return fromId > toId ? fromId + toId : toId + fromId;
  }
}
