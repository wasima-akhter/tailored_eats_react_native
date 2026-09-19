export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    sendEmailOtp: "/auth/send-email-otp",
    checkEmailOtp: "/auth/check-email-otp",
    forgotPassword: "/auth/forget-password",
    checkForgotPasswordOtp: "/auth/forget-password-check-otp",
    resetPassword: "/auth/reset-password",
  },

  user: {
    userDetail: "/user/user-detail",
  },

  meal: {
    getCustomMeals: "/meal/get-custom-meal",
    addCustomMeal: "/meal/add-custom-meal",
    updateCustomMeal: "/meal/update-custom-meal",
    deleteCustomMeal: "/meal/delete-custom-meal",
    ateMeal: "/meal/ate-meal",
    swapMeal: "/meal/swap-meal",
    filterMeal: "/meal/filter-meal",
  },

  goal: {
    createNewGoal: "/goal/create-new-goal",
    getAllGoals: "/goal/get-all-goal",
    markGoalCompleted: "/goal/mark-goal-completed",
    updateGoal: "/goal/update-goal",
    deleteGoal: "/goal/delete-goal",
    changeGoalType: "/goal/change-goal-type",
    completedGoalPercentage: "/goal/completed-goal-percentage",
  },

  consistency: {
    userConsistencyDetails: "/consistency/user-consistency-details",
    addUserWeight: "/consistency/add-user-weight",
    getUserWeight: "/consistency/get-user-weight",
    addUserImage: "/consistency/add-user-image",
    getUserImages: "/consistency/get-user-image",
  },

  friend: {
    getFriendSuggestions: "/friend/get-friend-suggestions",
    addFriend: "/friend/add-friend",
    searchFriend: "/friend/search-friend",
    getAllFriends: "/friend/get-all-friend",
    friendDetail: "/friend/friend-detail",
    getAllFriendRequests: "/friend/get-all-friend-request",
    acceptRequest: "/friend/accept-request",
    rejectRequest: "/friend/reject-request",
    makeUnfriend: "/friend/make-unfriend",
  },

  profile: {
    userDetail: "/user/user-detail",
    updateProfile: "/user/update-profile",
  },
} as const;
