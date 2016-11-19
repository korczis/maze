import {generateReduxSymbol} from '../helpers/redux';

const GAME_SET_THREE = generateReduxSymbol('game/GAME_SET_THREE');

const initialState = {
  three: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GAME_SET_THREE: {
      return {
        ...state,
        three: action.three
      };
    }
    default:
      return state;
  }
}

export function setThree(three) {
  return {
    type: GAME_SET_THREE,
    three
  };
}
