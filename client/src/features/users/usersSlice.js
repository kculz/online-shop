import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProfileThunk,
  updateProfileThunk,
  fetchAllUsersThunk,
  fetchUserByIdThunk,
  updateUserThunk,
  deleteUserThunk,
} from './usersThunks';

const initialState = {
  // Current user profile
  profile: null,
  profileLoading: false,
  profileError: null,
  profileUpdating: false,
  profileUpdateError: null,

  // Users management (admin)
  users: [],
  currentUser: null,
  usersLoading: false,
  usersError: null,
  userUpdating: false,
  userUpdateError: null,
  userDeleting: false,
  userDeleteError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.profileError = null;
      state.profileUpdateError = null;
    },
    clearUsersError: (state) => {
      state.usersError = null;
      state.userUpdateError = null;
      state.userDeleteError = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.currentUser = null;
    },
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfileThunk.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.profileUpdating = true;
        state.profileUpdateError = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profileUpdating = false;
        state.profile = action.payload;
        state.profileUpdateError = null;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.profileUpdating = false;
        state.profileUpdateError = action.payload;
      })
      
      // Fetch All Users
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
        state.usersError = null;
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Fetch User by ID
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.currentUser = action.payload;
        state.usersError = null;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.userUpdating = true;
        state.userUpdateError = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.userUpdating = false;
        state.currentUser = action.payload;
        
        // Update in users list if exists
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
        
        state.userUpdateError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.userUpdating = false;
        state.userUpdateError = action.payload;
      })
      
      // Delete User
      .addCase(deleteUserThunk.pending, (state) => {
        state.userDeleting = true;
        state.userDeleteError = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.userDeleting = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.currentUser = null;
        state.userDeleteError = null;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.userDeleting = false;
        state.userDeleteError = action.payload;
      });
  },
});

export const { 
  clearProfileError, 
  clearUsersError, 
  clearCurrentUser, 
  clearUsers,
  updateProfileLocally 
} = userSlice.actions;
export default userSlice.reducer;