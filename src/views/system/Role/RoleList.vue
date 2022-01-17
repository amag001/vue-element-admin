<template>
  <el-main>
    <el-form
      :model="parms"
      ref="seachform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="角色名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchList" icon="el-icon-search">查询</el-button>
        <el-button
          @click="cacelList"
          style="color: #ff7670"
          icon="el-icon-delete"
          >取消</el-button
        >
        <el-button @click="addRole" type="primary" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :height="tableHeight" :data="roleList" border stripe>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editRole(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-setting"
            type="primary"
            size="small"
            @click="assignRole(scope.row)"
            >分配权限</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteRole(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="parms.currentPage"
      :page-sizes="[3, 10, 20, 40, 80, 100]"
      :page-size="parms.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parms.total"
      background
    >
    </el-pagination>
    <!-- 新增或编辑弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addRoleModule"
          ref="addRoleForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="addRoleModule.name"></el-input>
          </el-form-item>
          <el-form-item label="角色备注">
            <el-input v-model="addRoleModule.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 分配权限弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :height="assignDialog.height"
      :width="assignDialog.width"
      :visible="assignDialog.visible"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无事数据"
          :show-checkbox="true"
          :highlight-current="true"
          default-expand-all
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from "@/components/system/SysDialog";
import leafUtils from "@/utils/leafUtils";
import {
  getRoleListApi,
  addRoleApi,
  editRoleApi,
  deleteRoleApi,
  getAssignTreeApi,
  assignSaveApi,
} from "@/api/role";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      //树属性配置
      defaultProps: {
        children: "children",
        label: "label",
      },
      //分配权限树数据域
      assignTreeData: [],
      //角色id
      roleId: "",
      //分配权限弹框属性
      assignDialog: {
        title: "",
        height: 450,
        width: 300,
        visible: false,
      },
      //表单验证
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写角色名称",
          },
        ],
      },
      //新增或编辑表单数据域
      addRoleModule: {
        id: "", //编辑时候使用
        editType: "", //标识新增或编辑  0：新增 1：编辑
        name: "",
        remark: "",
        createUser: this.$store.getters.userId,
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //角色列表数据
      roleList: [],
      //查询参数
      parms: {
        currentPage: 1, //当前是第几页
        pageSize: 3, //每页查询条数
        userId: this.$store.getters.userId,
        total: 0,
        name: "",
      },
    };
  },
  created() {
    this.getRoleList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 210;
    });
  },
  methods: {
    //树的节点点击事件
    handleNodeClick(data) {
      console.log(data);
    },
    //分配权限确认事件
    async onAssignConfirm() {
      // let ids = this.$refs.assignTree.getCheckedKeys();
      // console.log(ids)
      // let idsss = this.$refs.assignTree.getHalfCheckedKeys();
      // console.log(idsss)
      let listId = this.$refs.assignTree
        .getCheckedKeys()
        .concat(this.$refs.assignTree.getHalfCheckedKeys());
      console.log(listId);
      let parm = {
        roleId: this.roleId,
        list: listId,
      };
      let res = await assignSaveApi(parm);
      if (res && res.code == 200) {
        this.assignDialog.visible = false;
        this.$message.success(res.msg);
      }
    },
    //分配权限取消事件
    onAssignClose() {
      this.assignDialog.visible = false;
    },
    //分配权限按钮
    async assignRole(row) {
      let that = this;
      //
      this.roleId = row.id;
      let parm = {
        roleId: row.id,
        userId: this.$store.getters.userId,
      };
      let res = await getAssignTreeApi(parm);
      if (res && res.code == 200) {
        //当前登录用户所拥有的所有权限
        let menuList = res.data.listmenu;
        //当前被分配的角色所拥有的权限
        let selectIds = res.data.checkList;
        //判断是否是末级
        let { setLeaf } = leafUtils();
        let newMenuList = setLeaf(menuList);
        this.assignTreeData = newMenuList;
        console.log(newMenuList);
        this.$nextTick(() => {
          let nodes = that.$refs.assignTree.children;
          that.setChild(nodes, selectIds, that);
          console.log(nodes);
        });
      }
      console.log(res);
      this.assignDialog.visible = true;
      this.assignDialog.title = "为【" + row.name + "】分配权限";
    },
    setChild(childNodes, selectIds, that) {
      if (childNodes && childNodes.length > 0) {
        {
          for (let j = 0; j < childNodes.length; j++) {
            var node = that.$refs.assignTree.getNode(childNodes[j]);
            if (selectIds && selectIds.length > 0) {
              for (let h = 0; h < selectIds.length; h++) {
                if (selectIds[h] == childNodes[j].id) {
                  if (childNodes[j].open) {
                    that.$refs.assignTree.setChecked(node, true);
                    break;
                  }
                }
              }
            }
            if (childNodes[j].children) {
              that.setChild(childNodes[j].children, selectIds, that);
            }
          }
        }
      }
    },
    //新增或编辑关闭事件
    onClose() {
      this.addDialog.visible = false;
    },
    //新增或编辑确认事件
    onConfirm() {
      this.$refs.addRoleForm.validate(async (valid) => {
        if (valid) {
          this.addRoleModule.createUser = this.$store.getters.userId;
          let res = null;
          if (this.addRoleModule.editType == "0") {
            //新增
            res = await addRoleApi(this.addRoleModule);
          } else {
            res = await editRoleApi(this.addRoleModule);
          }
          if (res && res.code == 200) {
            //刷新列表
            this.getRoleList(this.parms);
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增按钮
    addRole() {
      //清空表单数据
      this.$resetForm("addRoleForm", this.addRoleModule);
      this.addRoleModule.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增角色";
      this.addDialog.visible = true;
    },
    //取消按钮
    cacelList() {
      this.parms.currentPage = 1;
      this.parms.name = "";
      this.getRoleList(this.parms);
    },
    //查询按钮
    searchList() {
      this.parms.currentPage = 1;
      this.getRoleList(this.parms);
    },
    currentChange(val) {
      this.parms.currentPage = val;
      this.getRoleList(this.parms);
      console.log("当前页");
      console.log(val);
    },
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getRoleList(this.parms);
    },
    //删除按钮
    async deleteRole(row) {
      console.log(row);
      let confrim = await this.$myconfirm("确定删除该数据吗？");
      if (confrim) {
        let parm = {
          id: row.id,
        };
        let res = await deleteRoleApi(parm);
        if (res && res.code == 200) {
          //刷新列表
          this.getRoleList(this.parms);
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editRole(row) {
      //清空表单
      this.$resetForm("addRoleForm", this.addRoleModule);
      //设置弹框属性
      this.addDialog.title = "编辑角色";
      this.addDialog.visible = true;
      //标识 编辑
      this.addRoleModule.editType = "1";
      //把当前点击的行数据复制到表单数据域
      this.$objCoppy(row, this.addRoleModule);
      console.log(row);
    },
    //获取角色列表
    async getRoleList() {
      let res = await getRoleListApi(this.parms);
      if (res && res.code == 200) {
        this.roleList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>