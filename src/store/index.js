// Utilities
import { createPinia } from 'pinia'
import { watch } from 'vue'

const pinia = createPinia()
if(localStorage.getItem('state')){
    pinia.state.value = JSON.parse(localStorage.getItem('state'));
}

watch(
    pinia.state,
    (state)=>{
        localStorage.setItem('state', JSON.stringify(state));
    },
    { deep: true }
)
export default pinia
