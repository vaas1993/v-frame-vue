<template>
    <div class="v-array-tag-column">
        <template v-for="(name, index) of model.getValue(field) || []">
            <el-tag :key="index" v-if="index < count" size="mini" :type="type">
                {{name}}
            </el-tag>
        </template>

        <el-popover
            v-if="model.getValue(field).length !== count"
            :width="500"
            trigger="hover"
        >
            <template #reference>
                <el-tag size="mini" :type="type" class="text-pointer">
                    ...共 {{model.getValue(field).length}} 项...
                </el-tag>
            </template>
            <template #default>
                <el-tag
                    v-for="(name, index) of model.getValue(field) || []"
                    :key="index"
                    size="mini"
                    :type="type"
                    class="mr-1 mb-1"
                >
                    {{name}}
                </el-tag>
            </template>
        </el-popover>

    </div>
</template>

<script>

export default {
    name: "VArrayTagColumn",
    props: {
        model: {
            type: Object
        },

        field: {
            type: String
        },

        count: {
            type: Number,
            default: 5,
        },

        type: {
            type: String,
            default: 'info',
        },
    },
}
</script>

<style scoped>
</style>