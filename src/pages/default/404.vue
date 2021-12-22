<template>
    <div>
        <el-empty>
            <template #description>
                {{$route.path}}
            </template>
            <div class="content-container">
                <div class="text-black-8 text-extra-large text-bold mb-3">
                    404 页面不存在
                </div>

                <div class="text-warning text-base">
                    <div>
                        您正在访问一个不存在的页面，如果您是直接修改页面地址或者通过书签进行访问，请确认地址是否存在。
                    </div>
                    <div>
                        若您存在任何疑问，可以将页面完整截图发送给管理员。
                    </div>
                </div>

                <div class="mt-3">
                    <el-button @click="onBack">返回上一页</el-button>
                </div>
            </div>
        </el-empty>

    </div>
</template>

<script>
export default {
    name: "404",
    methods: {
        onBack() {
            this.$router.back()
        }
    }
}
</script>

<style scoped>

</style>