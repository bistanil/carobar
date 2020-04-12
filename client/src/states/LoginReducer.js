function reducer(state = {
  loggedIn: false,
  token:null,
  user:{}
}, action){
  // console.log('Action', action.type);
  // console.log('Payload', action.payload);
  switch (action.type) {
    case 'login':
      return {
        ...state,
        loggedIn: true,
        token: action.payload.token,
        user: action.payload.user
      }
    case 'register':
      return {
        ...state,
        loggedIn: true,
        token: action.payload.token,
        user: action.payload.user
      }
    case 'logout':
      return {
        loggedIn: false,
        token: null,
        user: {}
      }
    case 'localState':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loggedIn: true
      }
    default:
      return state
  }
}
 
export default reducer;
