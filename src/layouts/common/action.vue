<template>
    <div class="text-medium text-bold action-container pv-2 hidden">
        <el-button circle class="mr-2 float-left" title="返回" v-if="isBackShow" @click="onBack">
            <v-icon icon="icon-back-1"></v-icon>
        </el-button>

        <span class="page-name float-left">
            {{ meta.name }}
        </span>

        <div class="float-right" v-if="component">
            <component
                v-bind:is="component.widget"
                v-bind="component.options || {}"
                v-on="component.events || {}"
            ></component>
        </div>
    </div>
</template>

<script>
import VIcon from "../../components/VIcon";
export default {
    name: "v-action",
    components: {VIcon},
    methods: {
        onBack() {
            history.back()
        }
    },
    computed: {
        component() {
            return this.$vf.pageActionComponent
        },

        meta() {
            return this.$route.meta
        },
    },
    data() {
        return {
            isBackShow: history.length > 0
        }
    },
    updated() {
        this.isBackShow = history.length > 0
    }
}
</script>

<style scoped>
.action-container {
    height: 80px;
    box-sizing: border-box;
}

.action-container .page-name {
    line-height: 40px;
}
</style>