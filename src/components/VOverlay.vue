<template>
    <div class="v-overlay absolute"></div>
</template>

<script>
export default {
    name: "VOverlay"
}
</script>

<style scoped>
.v-overlay {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .3);
    z-index: 5000;
}
</style>