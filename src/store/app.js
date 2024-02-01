// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    originatingPage:''
  }),
  actions:{
    setLoginData(user_data){
      this.user = user_data;
    },
    logout(){
      this.user = null;
    }
  }
})
