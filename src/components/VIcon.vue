<template>
    <span>
        <i class="icon" :class="icon"></i>
        <slot></slot>
    </span>
</template>

<script>
export default {
    name: "VIcon",
    props: ['icon']
}
</script>