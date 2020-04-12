 
function reducer(state = {cars:[]}, action){
  // console.log('Action', action.type);
  // console.log('Payload', action.payload);
  switch (action.type) {
    case 'addCar':
      return {
        ...state,
        cars: state.cars.concat(action.payload)
      }
    case 'setCars':
      return {
        ...state,
        cars: action.payload
      }
    case 'removeCar':
      return {
        ...state,
        cars: state.cars.filter(car=>car['_id']!==action.payload)
      }
    default:
      return state;
  }
}
 
export default reducer;
