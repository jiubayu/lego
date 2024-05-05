import {createStore} from 'vuex';
import templates, { TemplatesProps } from './template';
import users, {UserProps} from './user';

export interface GlobalDataProps {
  user: UserProps;
  data: TemplatesProps;
}

const store = createStore({
  modules: {
    templates,
    users,
  },
});
export default store;
