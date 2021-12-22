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
export default {
    name: "VSelect",
    props: ['value', 'clearable', 'items'],
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