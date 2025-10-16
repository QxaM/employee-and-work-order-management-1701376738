import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMyProfileImage } from '../api/data-download/profile.ts';

interface ProfileImageState {
  imageSrc: string | undefined;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProfileImageState = {
  imageSrc: undefined,
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchProfileImage = createAsyncThunk(
  'profileImage/fetchProfileImage',
  async (_, { rejectWithValue }) => {
    const response = await fetchMyProfileImage();
    if (response.error) {
      return rejectWithValue(response.error.message);
    }
    if (!response.data) {
      return rejectWithValue('No data received');
    }
    return response.data;
  }
);

const profileImageSlice = createSlice({
  name: 'profileImage',
  initialState,
  reducers: {
    clearImage: (state) => {
      if (state.imageSrc) {
        URL.revokeObjectURL(state.imageSrc);
      }
      state.imageSrc = undefined;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileImage.fulfilled, (state, action) => {
        if (state.imageSrc) {
          URL.revokeObjectURL(state.imageSrc);
        }
        state.loading = false;
        state.error = null;
        state.imageSrc = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearImage } = profileImageSlice.actions;
export default profileImageSlice.reducer;
