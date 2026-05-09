// currentUserSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserResponseDto } from "../../api/user/user.type";
interface MediaArray {
  id: string;
  url: string;
}
interface CurrentUserState {
  data: CurrentUserResponseDto | null;
  elementId: string | any;
  mediaUrls: MediaArray[];
}

const initialState: CurrentUserState = {
  data: null,
  elementId: true,
  mediaUrls: [],
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<CurrentUserResponseDto | null>
    ) => {
      state.data = action.payload;
    },
    setCurrentElementId: (state, action: PayloadAction<string | null>) => {
      state.elementId = action.payload;
    },
    setMediaUrl: (state, action: PayloadAction<MediaArray[]>) => {
      state.mediaUrls = action.payload;
    },
  },
});

export const { setCurrentUser, setCurrentElementId,setMediaUrl } = currentUserSlice.actions;

export default currentUserSlice.reducer;
