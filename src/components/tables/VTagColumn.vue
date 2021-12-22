<template>
    <div>
        <el-tag :type="type" size="mini">
            {{model.getValue(field)}}
        </el-tag>
    </div>
</template>

<script>
export default {
    name: "VTagColumn",
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
}
</script>

<style scoped>

</style>