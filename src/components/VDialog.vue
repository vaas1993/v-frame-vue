<template>
    <span></span>
</template>

<script>
import {ElMessageBox} from "element-plus"

export default {
    name: "VDialog",
    watch: {
        '$vf.dialog'() {
            if (this.$vf.dialog.id) {

                let method = this.$vf.dialog.showCancel ? 'confirm' : 'alert'

                ElMessageBox[method](
                    this.$vf.dialog.message,
                    this.$vf.dialog.title,
                    {
                        type: this.$vf.dialog.type,
                        showClose: this.$vf.dialog.showClose,
                        'close-on-click-modal': false,
                        'show-confirm-button': this.$vf.dialog.showConfirm,
                        'cancel-button-text': this.$vf.dialog.cancelText,
                        'confirm-button-text': this.$vf.dialog.confirmText,
                    }).then((action) => {
                        if( typeof this.$vf.dialog.callback === 'function' ) {
                            this.$vf.dialog.callback({
                                cancel: action === 'cancel',
                                confirm: action === 'confirm',
                                close: action === 'close',
                            })
                        }
                    }).catch((action) => {
                        if( typeof this.$vf.dialog.callback === 'function' ) {
                            this.$vf.dialog.callback({
                                cancel: action === 'cancel',
                                confirm: action === 'confirm',
                                close: action === 'close',
                            })
                        }
                    })
            }
        }
    }
}
</script>

<style scoped>

</style>