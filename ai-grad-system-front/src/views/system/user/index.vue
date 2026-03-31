<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate"><el-icon><Plus /></el-icon>新增用户</el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0"><el-icon><Delete /></el-icon>批量删除</el-button>
    </div>

    <el-card>
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择" clearable style="width: 120px">
            <el-option label="超级管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="家长" value="parent" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="100" />
        <el-table-column prop="organization" label="所属单位" min-width="150" />
        <el-table-column prop="roles" label="角色" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.roles }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">{{ row.status === 'normal' ? '正常' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleResetPwd(row)">重置密码</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="550px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="所属单位" prop="organization">
          <el-select v-model="form.organization" placeholder="请选择所属单位" style="width: 100%">
            <el-option label="泉州市教育局" value="泉州市教育局" />
            <el-option label="泉州市实验小学" value="泉州市实验小学" />
            <el-option label="泉州市第二小学" value="泉州市第二小学" />
            <el-option label="泉州市第三小学" value="泉州市第三小学" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="超级管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="家长" value="parent" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="disabled">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="初始密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入初始密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="resetPwdVisible" title="重置密码" width="400px" :close-on-click-modal="false">
      <el-form :model="resetPwdForm" label-width="80px">
        <el-form-item label="用户名">
          <span>{{ resetPwdForm.username }}</span>
        </el-form-item>
        <el-form-item label="新密码" label-width="80px">
          <el-input v-model="resetPwdForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px">
          <el-input v-model="resetPwdForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPwdVisible = false">取消</el-button>
        <el-button type="primary" @click="submitResetPwd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const resetPwdVisible = ref(false)
const selectedIds = ref([])

const searchForm = reactive({
  username: '',
  realName: '',
  role: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const form = reactive({
  id: '',
  username: '',
  realName: '',
  organization: '',
  role: '',
  phone: '',
  email: '',
  status: 'normal',
  password: '',
})

const resetPwdForm = reactive({
  id: '',
  username: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符', trigger: 'blur' }
  ],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  organization: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
})

const dialogTitle = computed(() => isEdit.value ? '编辑用户' : '新增用户')

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: '1', username: 'admin', realName: '管理员', organization: '泉州市教育局', roles: '超级管理员', phone: '13800138000', email: 'admin@example.com', status: 'normal', createTime: '2026-01-01 00:00:00' },
      { id: '2', username: 'teacher01', realName: '王老师', organization: '泉州市实验小学', roles: '教师', phone: '13800138001', email: 'wang@example.com', status: 'normal', createTime: '2026-02-15 10:30:00' },
      { id: '3', username: 'teacher02', realName: '李老师', organization: '泉州市第二小学', roles: '教师', phone: '13800138002', email: 'li@example.com', status: 'normal', createTime: '2026-02-16 11:30:00' },
      { id: '4', username: 'student01', realName: '张明', organization: '泉州市实验小学', roles: '学生', phone: '13800138003', email: 'zhang@example.com', status: 'normal', createTime: '2026-03-01 08:00:00' },
      { id: '5', username: 'parent01', realName: '张父', organization: '泉州市实验小学', roles: '家长', phone: '13800138004', email: 'zhangfu@example.com', status: 'normal', createTime: '2026-03-01 08:30:00' },
    ]
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

const resetForm = () => {
  form.id = ''
  form.username = ''
  form.realName = ''
  form.organization = ''
  form.role = ''
  form.phone = ''
  form.email = ''
  form.status = 'normal'
  form.password = ''
}

const handleCreate = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.id = row.id
  form.username = row.username
  form.realName = row.realName
  form.organization = row.organization
  form.role = row.roles === '超级管理员' ? 'admin' : row.roles === '教师' ? 'teacher' : row.roles === '学生' ? 'student' : 'parent'
  form.phone = row.phone
  form.email = row.email
  form.status = row.status
  isEdit.value = true
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        dialogVisible.value = false
        ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
        loadData()
      }, 500)
    }
  })
}

const handleResetPwd = (row) => {
  resetPwdForm.id = row.id
  resetPwdForm.username = row.username
  resetPwdForm.newPassword = ''
  resetPwdForm.confirmPassword = ''
  resetPwdVisible.value = true
}

const submitResetPwd = () => {
  if (!resetPwdForm.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (resetPwdForm.newPassword !== resetPwdForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (resetPwdForm.newPassword.length < 6) {
    ElMessage.warning('密码长度不能少于 6 位')
    return
  }
  resetPwdVisible.value = false
  ElMessage.success('密码重置成功')
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除用户"${row.username}"吗？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {}
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个用户吗？`, '提示', { type: 'warning' })
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadData()
  } catch (e) {}
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.realName = ''
  searchForm.role = ''
  handleSearch()
}

const handleSizeChange = loadData
const handlePageChange = loadData

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.search-form {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
