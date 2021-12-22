<template>
    <el-drawer
        size="900px"
        v-model="isModalShow"
        :title="modalData.title"
        :before-close="onBeforeClose"
    >
        <component
            v-if="isModalShow"
            v-bind:is="modalData.content.widget"
            v-bind="modalData.content.options || {}"
            v-on="modalData.content.events || {}"
        ></component>
    </el-drawer>
</template>

<script>
import VFrame from "@vshen/v-frame-core/lib/VFrame";

export default {
    name: "VModel",
    data() {
        return {
            isModalShow: false,
        }
    },
    computed: {
        modalData() {
            return VFrame.getInstance().modal
        }
    },
    watch: {
        'modalData.id'() {
            this.isModalShow = !!this.modalData.id
        }
    },
    methods: {
        onBeforeClose(done) {
            done()
        }
    },
}
</script>

<style scoped>
</style>