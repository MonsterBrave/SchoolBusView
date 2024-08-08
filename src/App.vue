<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>
<!--
<script>标签里的内容即该组件的脚本，也就是js代码。
export default是ES6的语法，意思是将这个组件整体导出，之后就可以使用import导入组件。
大括号里的内容是这个组件的相关属性。
-->

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
}
body{
    margin: 0;
}
</style>