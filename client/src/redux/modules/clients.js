const initialState = {
  ts: new Date(),
  clients: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}
