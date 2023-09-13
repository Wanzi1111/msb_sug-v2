
<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <template v-for="item in actions">
      <el-menu-item v-if="item.type === 'item'" :key="item.value" :index="item.value" disabled>{{ item.title }}</el-menu-item>
      <el-submenu v-if="item.type === 'submenu'" :key="item.value" :index="item.value">
        <template slot="title">{{ item.title }}</template>
        <el-menu-item v-for="v in item.children" :key="v.value" :index="v.value">{{ v.title }}</el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>
<script>

export default {
  name: 'BasicsMenuTaps',
  props: {
    mode: {
      default: 'horizontal',
      type: String
    },
    handleSelect: {
      default: () => {},
      type: Function
    },
    activeIndex: {
      default: '1',
      type: String
    },
    actions: {
      default: () => [],
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin boxStyle() {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    padding: 0;
    margin-right: 40px;
  }
  .el-menu-demo {
    border-bottom: none;
    margin-bottom: 15px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 2px;
      width: 100%;
      background: #E4E7ED;
      bottom: 0;
      left: 0;
    }
    /deep/ .el-menu-item, .el-submenu, .el-submenu__title {
      @include boxStyle();
    }
    /deep/ .el-submenu__title {
      &:hover {
        background: transparent;
      }
    }
    /deep/ .is-active {
      color: #3C56F2;
      .el-submenu__title {
        color: #3C56F2;
      }
    }
    /deep/ .el-submenu__title {
      @include boxStyle();
      margin-right: 0;
    }
  }
.el-menu--horizontal .el-menu .el-menu-item.is-active{
    color: #3C56F2 !important;
  }
</style>
