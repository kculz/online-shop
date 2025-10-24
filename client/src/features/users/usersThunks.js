import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from './usersAPI';

export const fetchProfileThunk = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Fetching user profile...');
      const response = await userAPI.getProfile();
      console.log('✅ [Thunk] Profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to fetch profile:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile'
      );
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Updating user profile...');
      const response = await userAPI.updateProfile(profileData);
      console.log('✅ [Thunk] Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to update profile:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update profile'
      );
    }
  }
);

export const fetchAllUsersThunk = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Fetching all users...');
      const response = await userAPI.getAllUsers();
      console.log('✅ [Thunk] Users fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to fetch users:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch users'
      );
    }
  }
);

export const fetchUserByIdThunk = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Fetching user:', userId);
      const response = await userAPI.getUserById(userId);
      console.log('✅ [Thunk] User fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to fetch user:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch user'
      );
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Updating user:', userId);
      const response = await userAPI.updateUser(userId, userData);
      console.log('✅ [Thunk] User updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to update user:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update user'
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Deleting user:', userId);
      await userAPI.deleteUser(userId);
      console.log('✅ [Thunk] User deleted successfully');
      return userId;
    } catch (error) {
      console.error('❌ [Thunk] Failed to delete user:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete user'
      );
    }
  }
);