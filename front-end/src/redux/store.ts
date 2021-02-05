import {createStore, applyMiddleware, Store} from 'redux';
import thunk from 'redux-thunk';
import reducer, { AppState} from './reducer';
import { AppAction } from './actions';

const store: Store<AppState, AppAction> = createStore(reducer, applyMiddleware(thunk));

export default store;