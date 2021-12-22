<template>
    <div class="v-info-window">
        {{content}}

        <div class="mt-1">
            <el-tag>标签1</el-tag>
            <el-tag class="ml-1">标签2</el-tag>
            <el-tag class="ml-1">标签3</el-tag>
            <el-tag class="ml-1">标签4</el-tag>
        </div>
    </div>
</template>

<script>
export default {
    name: "VInfoWindow",
    props: {
        content: {
            type: String
        }
    },
}
</script>

<style scoped>
.v-info-window {
    width: 300px;
}
</style>