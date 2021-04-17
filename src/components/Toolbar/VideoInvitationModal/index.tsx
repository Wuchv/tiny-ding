import * as React from 'react';
import { Typography } from 'antd';
import { Siri } from '@src/modules/Siri';

import './style.less';

export const VideoInvitationModal: React.FunctionComponent<unknown> = React.memo(
  () => {
    const siriCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const [siri, setSiri] = React.useState<Siri>(null);

    // 渲染siri
    React.useEffect(() => {
      if (siriCanvasRef.current) {
        const siri = new Siri(siriCanvasRef.current);
        siri.init(siri);
        setSiri(siri);
        let isRender = true;
        const render = () => {
          window.requestAnimationFrame(() => {
            siri.render();
            isRender && render();
          });
        };
        render();
        return () => {
          isRender = false;
        };
      }
    }, [siriCanvasRef]);

    return (
      <>
        <canvas ref={siriCanvasRef} onClick={() => siri.init()} />
        <Typography.Text>正在呼叫</Typography.Text>
        <span> .</span>
        <span> .</span>
        <span> .</span>
      </>
    );
  }
);
