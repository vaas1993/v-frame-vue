<template>
    <div class="v-loading">
        <div class="v-loading-content full">
            <div class="v-loading-image">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "VLoading",
}
</script>

<style scoped>
    .v-loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 6000;
        background-color: rgba(0, 0, 0, .6);
    }

    .v-loading-content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .v-loading-image {
        background: #eaebed url(https://huawei-v3-web.oss-cn-hangzhou.aliyuncs.com/pc-static/images/pc-start-loading.gif) no-repeat 50%;
        background-size: 500px auto;
        width: 100%;
        height: 100%;
    }
</style>