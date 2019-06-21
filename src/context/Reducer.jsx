export const Reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        loggedIn: action.value
      };
    case 'userId':
      return {
        ...state,
        userId: action.value
      };
    case 'dbs':
      return {
        ...state,
        Drivebys: action.value
      }
    case 'users':
      return {
        ...state,
        Users: action.value
      }
    case 'user':
      return {
        ...state,
        User: action.value
      }
    default:
      return state;
  }
};