<template>
<span></span>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    name: "VToast",
    watch: {
        '$vf.toast'() {
            if( this.$vf.toast.id ) {
                ElMessage({
                    message: this.$vf.toast.message,
                    type: this.$vf.toast.type,
                    duration: this.$vf.toast.duration || 3000,
                    showClose: !!this.$vf.toast.showClose
                })
            }
        }
    },
}
</script>

<style scoped>

</style>