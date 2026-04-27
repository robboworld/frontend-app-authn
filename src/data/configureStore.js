import { getConfig } from '@edx/frontend-platform';
import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';

import createRootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
let configuredStore;

function composeMiddleware() {
  if (getConfig().ENVIRONMENT === 'development') {
    const loggerMiddleware = createLogger({
      collapsed: true,
    });
    return composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware));
  }

  return compose(applyMiddleware(thunkMiddleware, sagaMiddleware));
}

export default function configureStore(initialState = {}) {
  if (configuredStore) {
    return configuredStore;
  }

  const store = createStore(
    createRootReducer(),
    initialState,
    composeMiddleware(),
  );
  sagaMiddleware.run(rootSaga);

  configuredStore = store;
  return store;
}
