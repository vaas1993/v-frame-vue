<template>
    <div class="loading-bar">
        <div class="inner-loading bgg-primary"></div>
    </div>
</template>

<script>
export default {
    name: "VLoadingBar",
}
</script>

<style scoped>
.loading-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 3px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, .4);
    z-index: 3000;
}

.inner-loading {
    width: 60%;
    height: 100%;
    position: absolute;
    left: -60%;
    animation: loading infinite linear 1.5s;
}

@keyframes loading {
    0% {
        left: -60%;
    }
    75% {
        left: 120%;
    }
    100% {
        left: 120%;
    }
}
</style>