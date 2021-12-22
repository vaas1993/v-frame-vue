<template>
    <el-container class="height-100">
        <el-header class="pa-0 v-frame-header bgg-primary">
            <el-container>
                <el-aside :width="asideWidth" class="v-frame-logo text-white">
                    {{$vf.mainConfig.name}}
                </el-aside>
                <el-main class="pa-0">
                </el-main>
            </el-container>
        </el-header>
        <el-container class="main-container">
            <v-aside :aside-width="asideWidth"></v-aside>
            <el-main class="pa-2 pt-0 main-inner-container">
                <v-action></v-action>
                <div class="router-container pa-2 pr-0 br-1">
                    <div class="height-100 ov-auto pr-2">
                        <router-view></router-view>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import VAside from "./aside";
import VAction from "./action";
export default {
    name: "index",
    components: {VAction, VAside},
    data() {
        return {
            asideWidth: '250px',
        }
    },
}
</script>

<style scoped>
    .ov-auto {
        overflow: auto;
    }

    .v-frame-logo {
        line-height: 60px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    .main-container {
        height: calc(100% - 60px);
    }

    .router-container {
        height: calc(100% - 80px);
        box-sizing: border-box;
        background-color: #FFF;
    }

    .main-inner-container {
        background-color: #F3F3F3;
    }
</style>