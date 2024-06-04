import {createStore} from 'vuex';
import templates, { TemplatesProps } from './template';
import users, { UserProps } from './user';
import editor, {EditorProps} from './editor';

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

export interface ActionPayload {
  urlParams?: {[key: string]: any};
  data?: any;
  searchParams?: {[key: string]: any};
}

const store = createStore({
  modules: {
    templates,
    users,
    editor,
  },
});
export default store;
