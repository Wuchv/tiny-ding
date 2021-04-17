// 收到视频通话邀请的弹窗
import * as React from 'react';
import { Typography, Button } from 'antd';
import { MessageCenter, ESignalType } from '@src/modules/RemoteGlobal';

import './style.less';

interface IVideoReceivedModal {
  fromId: string;
  toId: string;
}

export const VideoReceivedModal: React.FunctionComponent<IVideoReceivedModal> = React.memo(
  ({ fromId, toId }) => {
    const sendVideoCallSignal = React.useCallback(
      (type: ESignalType) => {
        MessageCenter.sendSignal({
          type,
          payload: { fromId: toId, toId: fromId },
        });
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
