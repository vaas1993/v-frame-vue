<template>
    <el-config-provider class="height-100" :locale="locale">
        <div class="height-100">
            <v-loading-bar v-if="isLoadingShow"></v-loading-bar>
            <router-view></router-view>
        </div>
        <div v-if="vf">
            <v-toast></v-toast>
            <v-model></v-model>
            <v-notify></v-notify>
            <v-dialog></v-dialog>
        </div>
    </el-config-provider>
</template>

<script>
import locale from 'element-plus/lib/locale/lang/zh-cn'
import VToast from "./components/VToast"
import VModel from "./components/VModal"
import VNotify from "./components/VNotify"
import VDialog from "./components/VDialog"
import VLoadingBar from "./components/VLoadingBar";
export default {
    name: 'App',
    components: {VLoadingBar, VDialog, VNotify, VModel, VToast},
    computed: {
        vf() {
            return this.$vf
        },
        isLoadingShow() {
            return this.$vf.loading > 0
        }
    },
    data() {
        return {
            locale
        }
    }
}
</script>

<style>
body {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
