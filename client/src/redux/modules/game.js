// import merge from 'node.extend';

import {generateReduxSymbol} from '../helpers/redux';

const GAME_INPUT_HANDLE = generateReduxSymbol('game/GAME_INPUT_HANDLE');

const GAME_SET_STATS = generateReduxSymbol('game/GAME_SET_STATS');
const GAME_SET_THREE = generateReduxSymbol('game/GAME_SET_THREE');

const initialState = {
  player: {
    dir: 0
  },
  input: {},
  stats: null,
  three: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GAME_INPUT_HANDLE: {
      const newInput = {};
      newInput[action.code] = action.value;
      return {
        ...state,
        input: {
          ...state.input,
          ...newInput
        }
      };
    }

    case GAME_SET_STATS: {
      return {
        ...state,
        stats: action.stats
      };
    }

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

export function inputHandle(code, value) {
  return {
    type: GAME_INPUT_HANDLE,
    code,
    value
  };
}

export function setStats(stats) {
  return {
    type: GAME_SET_STATS,
    stats
  };
}

export function setThree(three) {
  return {
    type: GAME_SET_THREE,
    three
  };
}
