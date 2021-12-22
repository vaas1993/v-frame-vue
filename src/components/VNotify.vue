<template>
    <span></span>
</template>

<script>
import {ElNotification} from "element-plus";

export default {
    name: "VNotify",
    watch: {
        '$vf.notify'() {
            if (this.$vf.notify.id) {
                ElNotification({
                    title: this.$vf.notify.title,
                    dangerouslyUseHTMLString: !!this.$vf.notify.html,
                    message: this.$vf.notify.message,
                    type: this.$vf.notify.type,
                    duration: typeof this.$vf.notify.duration === 'number' ? this.$vf.notify.duration : 3000,
                    showClose: !!this.$vf.notify.showClose,
                })
            }
        }
    }
}
</script>

<style scoped>

</style>