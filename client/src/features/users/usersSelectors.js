import { createSelector } from 'reselect';

const selectUser = (state) => state.user || {
  profile: null,
  profileLoading: false,
  profileError: null,
  profileUpdating: false,
  profileUpdateError: null,
  users: [],
  currentUser: null,
  usersLoading: false,
  usersError: null,
  userUpdating: false,
  userUpdateError: null,
  userDeleting: false,
  userDeleteError: null
};

// Profile Selectors
export const selectProfile = createSelector(
  [selectUser],
  (user) => user.profile
);

export const selectProfileLoading = createSelector(
  [selectUser],
  (user) => user.profileLoading || false
);

export const selectProfileError = createSelector(
  [selectUser],
  (user) => user.profileError
);

export const selectProfileUpdating = createSelector(
  [selectUser],
  (user) => user.profileUpdating || false
);

export const selectProfileUpdateError = createSelector(
  [selectUser],
  (user) => user.profileUpdateError
);

// Users Management Selectors
export const selectAllUsers = createSelector(
  [selectUser],
  (user) => user.users || []
);

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const selectUsersLoading = createSelector(
  [selectUser],
  (user) => user.usersLoading || false
);

export const selectUsersError = createSelector(
  [selectUser],
  (user) => user.usersError
);

export const selectUserUpdating = createSelector(
  [selectUser],
  (user) => user.userUpdating || false
);

export const selectUserUpdateError = createSelector(
  [selectUser],
  (user) => user.userUpdateError
);

export const selectUserDeleting = createSelector(
  [selectUser],
  (user) => user.userDeleting || false
);

export const selectUserDeleteError = createSelector(
  [selectUser],
  (user) => user.userDeleteError
);

// Derived Selectors
export const selectIsAdmin = createSelector(
  [selectProfile],
  (profile) => profile?.role === 'admin'
);

export const selectUserStats = createSelector(
  [selectAllUsers],
  (users) => {
    const validUsers = users.filter(user => user);
    const total = validUsers.length;
    const admins = validUsers.filter(user => user.role === 'admin').length;
    const regularUsers = validUsers.filter(user => user.role === 'user').length;
    const vendors = validUsers.filter(user => user.role === 'vendor').length;
    
    return {
      total,
      admins,
      regularUsers,
      vendors
    };
  }
);

export const selectUsersByRole = createSelector(
  [selectAllUsers],
  (users) => {
    const grouped = {
      admin: [],
      user: [],
      vendor: []
    };
    
    users.forEach(user => {
      if (user && user.role && grouped[user.role]) {
        grouped[user.role].push(user);
      }
    });
    
    return grouped;
  }
);