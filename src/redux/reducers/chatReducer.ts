import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationManager } from '@src/modules/RemoteGlobal';
import { IRootState } from './index';

export interface IChat {
  currentTo: string;
  currentCid: string;
  currentConversationTitle: string;
  currentConversationAvatar: string;
}
// @ts-ignore
const initialState: IChat = await ConversationManager.getLatestConversation();

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    chooseChatPartnerAction: (
      state,
      action: PayloadAction<Partial<IChat>>
    ) => ({ ...state, ...action.payload }),
    noConversation: (state) => {
      state.currentCid = null;
      state.currentCid = null;
      state.currentConversationTitle = null;
      state.currentConversationAvatar = null;
    },
  },
});

export const { chooseChatPartnerAction, noConversation } = chatSlice.actions;

export const selectChat = (state: IRootState) => ({
  currentTo: state.chat.currentTo,
  currentCid: state.chat.currentCid,
  currentConversationTitle: state.chat.currentConversationTitle,
  currentConversationAvatar: state.chat.currentConversationAvatar,
});

export default chatSlice.reducer;
