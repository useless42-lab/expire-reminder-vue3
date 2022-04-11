<template>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
    <div>我的空间</div>
    <span class="mdi mdi-plus" style="padding:3px;font-size:1.3em;" @click="addTeam()"></span>
  </div>
  <div>
    <div class="team-item" v-for="item,index in list" :key="index">
      <div style="border-bottom: 1px solid #999;padding-bottom: 10px;">
        <div>{{item.name}}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <el-button type="text" @click="addGroup(item.id)">
            分组
          </el-button>
          <el-button type="text" @click="getMemberListDialog(item.id)">人员</el-button>
          <el-button type="text" @click="updateTeamDialog(item.id,item.name)">编辑</el-button>
          <el-popconfirm title="确认删除团队？" @confirm="confirmDeleteTeam(item.id)" v-if="item.role==2" confirmButtonText="是" cancelButtonText="否">
            <template #reference>
              <el-button type="text" style="color:red;">删除</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确认退出团队？" @confirm="confirmLeaveTeam(item.id)" v-if="item.role==1" confirmButtonText="是" cancelButtonText="否">
            <template #reference>
              <el-button type="text" style="color:orange;">退出</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div style="margin-top:10px">
        <div class="group-item" style="" v-for="item1,index1 in item.group_list" :key="index1">
          <div>{{item1.name}}</div>
          <div>

            <el-button type="text" @click="openTagDialog(item.id,item1.id)">标签</el-button>
            <el-button type="text" @click="updateGroupDialog(item1.id,item1.name)">编辑</el-button>

            <el-popconfirm title="确认删除分组？" @confirm="confirmDeleteGroup(item.id,item1.id)" confirmButtonText="是" cancelButtonText="否">
              <template #reference>
                <el-button type="text" style="color:red;">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="teamDialogVisible" title="空间" width="300px" :before-close="handleClose" fullscreen>
    <el-form :model="form">
      <el-form-item label="空间名" :label-width="formLabelWidth">
        <el-input v-model="form.teamName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="teamDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddTeam">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="groupDialogVisible" title="分组" width="300px" :before-close="handleClose" fullscreen>
    <el-form :model="form">
      <el-form-item label="分组名" :label-width="formLabelWidth">
        <el-input v-model="form.groupName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddGroup">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="memberListDialog" title="人员列表" width="300px" :before-close="handleClose" fullscreen>
    <div v-for="item,index in memberList" :key="index"
      style="display:flex;align-items:center;justify-content:space-between;">
      <div>{{item.username}}</div>
      <el-popconfirm title="确认踢出分组？" @confirm="confirmKickGroup(item.id)" v-if="item.role==1" confirmButtonText="是" cancelButtonText="否">
        <template #reference>
          <el-button type="text">踢出</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div style="margin-top:30px;" v-if="inviteLink">
      <div>
        邀请链接：{{inviteLink}}
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="generateMemberLink()">邀请</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="tagDialogVisible" title="标签列表" width="300px" :before-close="handleClose" fullscreen>
    <div v-for="item,index in tagList" :key="index"
      style="display:flex;align-items:center;justify-content:space-between;">
      <div>{{item.name}}</div>
    </div>
  </el-dialog>
</template>


<script>
  import {
    ElMessage
  } from 'element-plus';
  import teamApi from '@/service/team';
  import groupApi from '@/service/group';
  import tagApi from '@/service/tag';
  export default {
    computed: {
      filterRole() {
        return function (v) {
          return v == 2 ? "创建者" : "成员";
        }
      }
    },
    data() {
      return {
        tagList:[],
        tagDialogVisible:false,
        teamDialogVisible: false,
        groupDialogVisible: false,
        memberListDialog: false,
        list: [],
        targetTeamId: 0,
        targetGroupId: 0,
        form: {
          teamName: "",
          groupName: "",
        },
        memberList: [],
        inviteLink: "",
      }
    },
    methods: {
      openTagDialog(teamId,groupId){
        this.tagDialogVisible=true;
        tagApi.getListService(teamId,groupId)
        .then(res=>{
          this.tagList=res['data'];
        })
      },
      confirmKickGroup(targetUserId) {
        const formData = new FormData();
        formData.append("team_id", this.targetTeamId);
        formData.append("target_user_id", targetUserId);
        teamApi.kickMemberService(formData)
          .then(res => {
            ElMessage.success(res['data']);
            this.memberListDialog = false;
          })
      },
      generateMemberLink() {
        const formData = new FormData();
        formData.append("team_id", this.targetTeamId);
        formData.append("role", 1)
        teamApi.getInviteLinkService(formData)
          .then(res => {
            this.inviteLink = process.env.VUE_APP_WEB_URL + "team/invite/" + res['data'];
            console.log(res)
          })
      },
      getMemberListDialog(teamId) {
        this.targetTeamId = teamId;
        teamApi.getMemberListService(teamId, 1, 9999)
          .then(res => {
            this.memberListDialog = true;
            this.memberList = res['data'];
          })
      },
      updateTeamDialog(teamId, name) {
        this.targetTeamId = teamId;
        this.form.teamName = name;
        this.teamDialogVisible = true;
      },
      updateGroupDialog(groupId, name) {
        this.targetGroupId = groupId;
        this.form.groupName = name;
        this.groupDialogVisible = true;
      },
      confirmDeleteTeam(teamId) {
        teamApi.deleteService(teamId)
          .then(res => {
            if (res['code'] == 200) {
              ElMessage.success("成功");
            } else {
              ElMessage.error(res['error']);
            }
            this.getList();
          })
      },
      confirmDeleteGroup(teamId, groupId) {
        const formData = new FormData()
        formData.append("group_id", groupId)
        formData.append("team_id", teamId)
        groupApi.deleteService(formData)
          .then(res => {
            if (res['code'] == 200) {
              ElMessage.success("成功");
            } else {
              ElMessage.error(res['error']);
            }
            this.addDialogVisible = false;
            this.getList();
          })
      },
      confirmLeaveTeam(teamId) {
        const formData = new FormData()
        formData.append("team_id", teamId)
        teamApi.ExitTeamService(formData)
          .then(res => {
            if (res['code'] == 200) {
              ElMessage.success("成功");
            } else {
              ElMessage.error(res['error']);
            }
            this.addDialogVisible = false;
            this.getList();
          })
      },
      getList() {
        teamApi.getListService()
          .then(res => {
            this.list = res['data'];
            console.log(res);
          })
      },
      addTeam() {
        this.teamDialogVisible = true;
      },
      onAddTeam() {
        if (this.targetTeamId == 0) {
          const formData = new FormData();
          formData.append("name", this.form.teamName);
          teamApi.createService(formData)
            .then(res => {
              if (res['code'] == 200) {
                ElMessage.success("添加成功");
              } else {
                ElMessage.error(res['error']);
              }
              this.getList();
              this.teamDialogVisible = false;
            })
        } else {
          const formData = new FormData();
          formData.append("name", this.form.teamName);
          formData.append("team_id", this.targetTeamId);
          teamApi.updateService(formData)
            .then(res => {
              if (res['code'] == 200) {
                ElMessage.success("更新成功");
              } else {
                ElMessage.error(res['error']);
              }
              this.getList();
              this.teamDialogVisible = false;
            })
        }
      },
      addGroup(id) {
        this.groupDialogVisible = true;
        this.targetTeamId = id;
      },
      onAddGroup() {
        if (this.targetGroupId == 0) {
          const formData = new FormData();
          formData.append("name", this.form.groupName);
          formData.append("team_id", this.targetTeamId);
          groupApi.addService(formData)
            .then(res => {
              if (res['code'] == 200) {
                ElMessage.success("添加成功");
              } else {
                ElMessage.error(res['error']);
              }
              this.getList();
              this.groupDialogVisible = false;
            })
        } else {
          const formData = new FormData();
          formData.append("name", this.form.groupName);
          formData.append("group_id", this.targetGroupId);
          groupApi.updateService(formData)
            .then(res => {
              if (res['code'] == 200) {
                ElMessage.success("更新成功");
              } else {
                ElMessage.error(res['error']);
              }
              this.getList();
              this.groupDialogVisible = false;
            })
        }
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>

<style scoped>
  .group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0px;
  }

  .group-item:last-child {
    border-bottom: none;
  }

  .team-item {
    margin-bottom: 10px;
    padding: 20px;
    border: solid 1px #ccc;
    border-radius: 8px;
  }
</style>