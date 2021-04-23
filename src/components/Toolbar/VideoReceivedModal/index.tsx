// 收到视频通话邀请的弹窗
import * as React from 'react';
import { Typography, Button, notification } from 'antd';
import { MessageCenter, ESignalType } from '@src/modules/RemoteGlobal';
import { openVideoCallWindow } from '@src/utils';

import './style.less';

interface IVideoReceivedModal {
  fromId: string;
  toId: string;
}

export const VideoReceivedModal: React.FunctionComponent<IVideoReceivedModal> = React.memo(
  ({ fromId, toId }) => {
    React.useEffect(() => {
      // 未接收对方通话邀请
      const notAnswered$ = MessageCenter.notAnswered$;

      const notAnsweredSub = notAnswered$.subscribe(
        (notAnsweredSignal: ISignal) => {
          notification.close(`receivedVideoCall:${fromId}`);
        }
      );

      return () => {
        notAnsweredSub.unsubscribe();
      };
    }, []);

    const sendVideoCallSignal = React.useCallback(
      async (type: ESignalType) => {
        MessageCenter.sendSignal({
          type,
          payload: { fromId: toId, toId: fromId },
        });
        if (type === ESignalType.AGREE_TO_VIDEO_CALL) {
          openVideoCallWindow({ fromId, toId }, false);
        }
        notification.close(`receivedVideoCall:${fromId}`);
      },
      [fromId, toId]
    );

    return (
      <>
        <Typography.Text>
          来自 <a>{fromId}</a> 的视频通话邀请
        </Typography.Text>
        <div className="button-wrapper">
          <Button
            type="primary"
            size="small"
            onClick={() => sendVideoCallSignal(ESignalType.AGREE_TO_VIDEO_CALL)}
          >
            同意
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => sendVideoCallSignal(ESignalType.REJECT_VIDEO_CALL)}
          >
            拒绝
          </Button>
        </div>
      </>
    );
  }
);
