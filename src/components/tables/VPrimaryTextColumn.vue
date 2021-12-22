<template>
    <span class="text-primary" @click="onClick">
        {{model.getValue(field)}}
    </span>
</template>

<script>
export default {
    name: "VPrimaryTextColumn",
    props: {
        model: {
            type: Object
        },

        field: {
            type: String
        },

        type: {
            type: String,
            default: 'primary',
        },
    },
    methods: {
        onClick() {
            this.$emit('click', this.model)
        }
    }
}
</script>

<style scoped>

</style>