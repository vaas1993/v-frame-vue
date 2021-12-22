<template>
    <el-aside :width="asideWidth" class="pv-2 v-frame-menu ov-auto">
        <el-menu :default-active="active" :router="true">
            <el-menu-item index="/site/index">
                <v-icon icon="icon-chart-3">
                </v-icon>
                <span class="ml-1">驾驶舱</span>
            </el-menu-item>
            <el-menu-item index="/notice/index">
                <v-icon icon="icon-warning-1">
                </v-icon>
                <span class="ml-1">提示</span>
            </el-menu-item>
            <el-menu-item index="/modal/index">
                <v-icon icon="icon-zoom-1">
                </v-icon>
                <span class="ml-1">模态框</span>
            </el-menu-item>
            <el-menu-item index="/form/index">
                <v-icon icon="icon-update-1">
                </v-icon>
                <span class="ml-1">表单</span>
            </el-menu-item>
            <el-menu-item index="/list/index">
                <v-icon icon="icon-list-1">
                </v-icon>
                <span class="ml-1">列表</span>
            </el-menu-item>
            <el-menu-item index="/map/index">
                <v-icon icon="icon-map-1">
                </v-icon>
                <span class="ml-1">地图</span>
            </el-menu-item>
            <el-sub-menu index="/common">
                <template #title>
                    <v-icon icon="icon-before-complete-1">
                    </v-icon>
                    <span class="ml-1">常用组件</span>
                </template>
                <el-menu-item index="/common/note">
                    <template #title>便签</template>
                </el-menu-item>
                <el-menu-item index="/common/tree">
                    <template #title>树组件</template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script>
import VIcon from "../../components/VIcon";
export default {
    name: "v-aside",
    components: {VIcon},
    props: ['asideWidth'],
    computed: {
        active() {
            return this.$route.path
        }
    },
}
</script>

<style scoped>
.v-frame-menu {
    border-right: 1px solid var(--el-border-color-extra-light);
}

.el-menu {
    border-right: none;
}
</style>