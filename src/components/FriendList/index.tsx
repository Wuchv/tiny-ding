import * as React from 'react';
import { useHistory } from 'react-router';
import { List } from 'antd';
import { RxDocument } from 'rxdb';
import { ConversationManager, UserManager } from '@src/modules/RemoteGlobal';
import { useReduxData } from '@src/hooks/useRedux';
import { chooseChatPartnerAction } from '@src/redux/reducers/chatReducer';
import { getAllUsers } from '@src/services';

import { Avatar } from '@src/components/Avatar';

import './style.less';

export const FriendList: React.FC<unknown> = React.memo(() => {
  const history = useHistory();
  const [dispatch, { uid, currentCid }] = useReduxData();
  const [userList, setUserList] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    getAllUsers().then((res) => UserManager.bulkInsert(res));

    UserManager.getOther().then((users) => {
      setUserList(users);
    });
  }, []);

  const jumpToChat = React.useCallback(async (user: IUser) => {
    const res: RxDocument<IConversation>[] = await ConversationManager.findWithOneKey(
      'toId',
      user.uid
    );
    let conversation: IConversation = null;
    if (res.length > 0) {
      conversation = res[0].toJSON();
      if (conversation.cid === currentCid) {
        conversation = null;
      }
    } else {
      conversation = {
        cid: `${uid}:${user.uid}`,
        toId: user.uid,
        title: String(user.nickname),
        unread: 0,
        avatarUrl: user.avatarUrl ? user.avatarUrl : '',
      };
      await ConversationManager.upsert(conversation);
    }
    !!conversation &&
      dispatch(
        chooseChatPartnerAction({
          currentCid: conversation.cid,
          currentTo: conversation.toId,
          currentConversationTitle: conversation.title,
          currentConversationAvatar: conversation.avatarUrl,
        })
      );
    history.push('/main/chat-list');
  }, []);

  return (
    <List
      className="friend-list"
      itemLayout="horizontal"
      dataSource={userList}
      renderItem={(user: IUser) => (
        <List.Item onDoubleClick={() => jumpToChat(user)}>
          <List.Item.Meta
            avatar={
              <Avatar text={user.nickname} src={user.avatarUrl} size="large" />
            }
            title={String(user.nickname)}
          />
        </List.Item>
      )}
    />
  );
});
