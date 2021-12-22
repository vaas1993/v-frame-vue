<template>
    <div class="text-center">
        <el-button
            v-for="(item, index) of items"
            :key="index"
            @click="onClick(item)"
            size="mini"
            plain
            v-bind="item.options || {type: 'info'}"
            round
        >
            <v-icon v-if="item.icon" :icon="item.icon"></v-icon>
            <span v-else>
                {{item.name}}
            </span>
        </el-button>
    </div>
</template>

<script>
import VIcon from "../VIcon";
export default {
    name: "VActionColumn",
    components: {VIcon},
    props: {
        items: {
            type: Array,
            required: true,
        }
    },
    methods: {
        onClick(item) {
            this.$emit('actionClick', item)
        }
    }
}
</script>

<style scoped>

</style>