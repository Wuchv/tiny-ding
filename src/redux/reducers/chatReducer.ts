import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationManager } from '@src/modules/RxdbManager';
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
  },
});

export const { chooseChatPartnerAction } = chatSlice.actions;

export const selectChat = (state: IRootState) => ({
  currentTo: state.chat.currentTo,
  currentCid: state.chat.currentCid,
  currentConversationTitle: state.chat.currentConversationTitle,
  currentConversationAvatar: state.chat.currentConversationAvatar,
});

export default chatSlice.reducer;
