<template>
    <el-select
        v-model="modelValue"
        :clearable="clearable"
        @change="onChange"
    >
        <el-option
            v-for="item of items"
            :key="item.value"
            :label="item.name"
            :value="item.value"
        ></el-option>
    </el-select>
</template>

<script>
import DictHelper from "@vshen/v-frame-core/lib/helpers/DictHelper"

/**
 * 数据词典下拉
 * 从数据词典列表中读取对应组名的项作为下拉待选项
 */
export default {
    name: "VDictSelect",
    props: ['value', 'clearable', 'groupName', 'ignoreList'],
    computed: {
        items() {
            return DictHelper.getGroup(this.groupName, this.ignoreList || [])
        }
    },
    data() {
        return {
            modelValue: this.value
        }
    },
    watch: {
        value() {
            this.modelValue = this.value
        }
    },

    methods: {
        onChange() {
            this.$emit('update:modelValue', this.modelValue)
        }
    }
}
</script>

<style scoped>

</style>