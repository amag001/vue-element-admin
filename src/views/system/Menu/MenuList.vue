<template>
  <el-main style="padding: 0px 20px">
    <el-form>
      <el-form-item style="margin-bottom: 0px; padding: 10px">
        <el-button type="primary" size="medium" @click="addMenu"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :height="tableHeight"
      :data="menuList"
      border
      stripe
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="label" label="菜单名称"></el-table-column>
      <el-table-column prop="type" align="center" label="菜单类型">
        <template slot-scope="scope">
          <el-tag size="normal" v-if="scope.row.type == '0'">目录</el-tag>
          <el-tag size="normal" type="success" v-if="scope.row.type == '1'"
            >菜单</el-tag
          >
          <el-tag size="normal" type="danger" v-if="scope.row.type == '2'"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="icon" align="center" label="图标">
        <template slot-scope="scope">
          <!-- element自己的图标 -->
          <i
            :class="scope.row.icon"
            v-if="scope.row.icon.includes('el-icon')"
          ></i>
          <!-- 阿里巴巴矢量图标 -->
          <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="路由地址"></el-table-column>
      <el-table-column prop="code" label="权限字段"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editMenu(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteMenu(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增或编辑弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :width="addDialog.width"
      :height="addDialog.height"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addMenuModel"
          ref="addMenuRef"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <!-- el-row
        代表的是把子元素排成一行 一行分为24等分
         -->
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" label="菜单类型">
                <el-radio-group v-model="addMenuModel.type">
                  <el-radio :label="'0'">目录</el-radio>
                  <el-radio :label="'1'">菜单</el-radio>
                  <el-radio :label="'2'">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="parentName" size="small" label="上级菜单">
            <el-input
              @click.native="selectParent"
              v-model="addMenuModel.parentName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="label" size="small" label="菜单名称">
            <el-input v-model="addMenuModel.label"></el-input>
          </el-form-item>
          <el-form-item
            v-if="addMenuModel.type != '2'"
            size="small"
            label="菜单图标"
          >
            <el-input v-model="addMenuModel.icon"></el-input>
          </el-form-item>
          <el-form-item
            prop="name"
            v-if="addMenuModel.type == '1'"
            size="small"
            label="路由名称"
          >
            <el-input v-model="addMenuModel.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="path"
            v-if="addMenuModel.type != '2'"
            size="small"
            label="路由地址"
          >
            <el-input v-model="addMenuModel.path"></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            v-if="addMenuModel.type == '1'"
            size="small"
            label="组件路径"
          >
            <el-input v-model="addMenuModel.url"></el-input>
          </el-form-item>
          <el-form-item prop="code" size="small" label="权限字段">
            <el-input v-model="addMenuModel.code"></el-input>
          </el-form-item>
          <el-form-item size="small" label="菜单序号">
            <el-input v-model="addMenuModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 选择上级菜单弹框 -->
    <sys-dialog
      :title="prentDialog.title"
      :width="prentDialog.width"
      :height="prentDialog.height"
      :visible="prentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentMenuList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!-- 长度为0说明没有下级 -->
            <span v-if="data.children.length == 0">
              <i
                class="el-icon-document"
                style="color: #8c8c8c; font-size: 20px"
              />
            </span>
            <span v-else @click="openBtn(data)">
              <svg-icon
                style="font-size: 25px"
                v-if="data.open"
                icon-class="add-s"
              />
              <svg-icon style="font-size: 20px" v-else icon-class="sub-s" />
            </span>
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import {
  getMenuListApi,
  getParentTreeApi,
  addMenuApi,
  editMenuApi,
  deleteMenuApi,
} from "@/api/menu";
import SysDialog from "@/components/system/SysDialog";
export default {
  //注册组件
  components: {
    SysDialog,
  },
  data() {
    return {
      //树属性定义
      defaultProps: {
        children: "children",
        label: "label",
      },
      //上级菜单弹框属性
      prentDialog: {
        title: "选择上级菜单",
        width: 280,
        height: 400,
        visible: false,
      },
      //新增或编辑表单验证规则
      rules: {
        type: [
          {
            required: true,
            trigger: "change",
            message: "请选择菜单类型",
          },
        ],
        parentName: [
          {
            required: true,
            trigger: "change",
            message: "请选择上级菜单",
          },
        ],
        label: [
          {
            required: true,
            trigger: "change",
            message: "请填写菜单名称",
          },
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由名称",
          },
        ],
        path: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由路径",
          },
        ],
        url: [
          {
            required: true,
            trigger: "change",
            message: "请填写组件路径",
          },
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "请填写权限字段",
          },
        ],
      },
      //新增或编辑表单数据域
      addMenuModel: {
        id: "",
        editType: "", //0 :新增 1：编辑
        type: "",
        parentId: "",
        parentName: "",
        label: "",
        icon: "",
        name: "",
        path: "",
        url: "",
        code: "",
        orderNum: "",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        width: 630,
        height: 260,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //菜单数量列表
      menuList: [],
      parentMenuList: [],
    };
  },
  created() {
    this.getMenuList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 170;
    });
  },
  methods: {
    openBtn(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //上级菜单节点点击事件
    handleNodeClick(data) {
      console.log(data);
      this.addMenuModel.parentId = data.id;
      this.addMenuModel.parentName = data.label;
      console.log(this.addMenuModel);
    },
    onParentConfirm() {
      this.prentDialog.visible = false;
    },
    //选择上级菜单取消事件
    onParentClose() {
      this.prentDialog.visible = false;
    },
    //选择上级菜单
    async selectParent() {
      console.log("选择");
      this.prentDialog.visible = true;
      let res = await getParentTreeApi();
      if (res && res.code == 200) {
        this.parentMenuList = res.data;
      }
      console.log(res);
    },
    //新增或编辑确认
    onConfirm() {
      this.$refs.addMenuRef.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addMenuModel.editType == "0") {
            //新增
            res = await addMenuApi(this.addMenuModel);
          } else {
            //编辑
            res = await editMenuApi(this.addMenuModel);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getMenuList();
            this.addDialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },
    //新增或编辑取消
    onClose() {
      this.addDialog.visible = false;
    },
    //新增按钮
    addMenu() {
      //清空表单
      this.$resetForm("addMenuRef", this.addMenuModel);
      this.addDialog.title = "新增权限";
      this.addDialog.visible = true;
      this.addMenuModel.editType = "0";
    },
    //删除按钮
    async deleteMenu(row) {
      let confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let res = await deleteMenuApi(parm);
        if (res && res.code == 200) {
          //刷新列表
          this.getMenuList();
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editMenu(row) {
      //清空数据
      this.$resetForm("addMenuRef", this.addMenuModel);
      //把当前要编辑的数据复制到数据域，给表单回显
      this.$objCoppy(row, this.addMenuModel);
      //设置编辑的标识
      this.addMenuModel.editType = "1";
      //设置弹框属性
      this.addDialog.title = "编辑权限";
      this.addDialog.visible = true;
    },
    //获取菜单列表
    async getMenuList() {
      let res = await getMenuListApi();
      if (res && res.code == 200) {
        this.menuList = res.data;
        console.log(this.menuList);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>