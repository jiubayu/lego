import { Module } from "vuex";
import { GlobalDataProps } from ".";

export interface UserProps {
  isLogin: boolean;
  username?: string;
}
export interface UserState {
  user: UserProps;
}
const users: Module<UserState, GlobalDataProps> = {
  state: {
    user: {isLogin: false},
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin: true, username: 'dabao'};
    },
    logout(state) {
      state.user = {isLogin: false};
    },
  },
};
export default users;