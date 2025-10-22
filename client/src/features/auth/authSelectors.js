import { createSelector } from 'reselect';

// Base selector
const selectAuth = (state) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectIsLoading = createSelector(
  [selectAuth],
  (auth) => auth.isLoading
);

export const selectError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

export const selectToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

export const selectUserId = createSelector(
  [selectUser],
  (user) => user?.id
);

export const selectUsername = createSelector(
  [selectUser],
  (user) => user?.username
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);
