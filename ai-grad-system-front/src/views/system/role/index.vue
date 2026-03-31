<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate"><el-icon><Plus /></el-icon>新增角色</el-button>
    </div>

    <el-card>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色标识" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="userCount" label="用户数" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">{{ row.status === 'normal' ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handlePermission(row)">权限</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色标识（如：admin）" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="normal">启用</el-radio>
            <el-radio label="disabled">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置弹窗 -->
    <el-dialog v-model="permissionVisible" title="配置权限" width="600px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <span>{{ currentRole.name }}</span>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            :props="{ children: 'children', label: 'label' }"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedPermissions"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const permissionVisible = ref(false)
const currentRole = ref({})
const checkedPermissions = ref([])
const treeRef = ref(null)

const form = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 'normal',
})

const rules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '角色标识只能包含小写字母和下划线', trigger: 'blur' }
  ],
})

const permissionTree = [
  {
    id: '1',
    label: '系统管理',
    children: [
      { id: '1-1', label: '用户管理' },
      { id: '1-2', label: '角色管理' },
      { id: '1-3', label: '消息中心' },
    ],
  },
  {
    id: '2',
    label: '作业管理',
    children: [
      { id: '2-1', label: '作业发布' },
      { id: '2-2', label: '作业提交' },
      { id: '2-3', label: '作业批阅' },
      { id: '2-4', label: '作业列表' },
    ],
  },
  {
    id: '3',
    label: '资源管理',
    children: [
      { id: '3-1', label: '题库管理' },
      { id: '3-2', label: '试卷管理' },
      { id: '3-3', label: '知识点管理' },
    ],
  },
  {
    id: '4',
    label: '作业报告',
    children: [
      { id: '4-1', label: '班级报告' },
      { id: '4-2', label: '个人报告' },
      { id: '4-3', label: '数据驾驶舱' },
    ],
  },
]

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: '1', name: '超级管理员', code: 'admin', description: '系统超级管理员，拥有所有权限', userCount: 3, status: 'normal', createTime: '2026-01-01 00:00:00' },
      { id: '2', name: '教师', code: 'teacher', description: '普通教师用户', userCount: 86, status: 'normal', createTime: '2026-01-01 00:00:00' },
      { id: '3', name: '学生', code: 'student', description: '学生用户', userCount: 1258, status: 'normal', createTime: '2026-01-01 00:00:00' },
      { id: '4', name: '家长', code: 'parent', description: '家长用户', userCount: 800, status: 'normal', createTime: '2026-01-01 00:00:00' },
    ]
    loading.value = false
  }, 300)
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.code = ''
  form.description = ''
  form.status = 'normal'
}

const handleCreate = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.description = row.description
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

const handlePermission = (row) => {
  currentRole.value = row
  // 模拟已选权限
  checkedPermissions.value = row.code === 'admin' ? ['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '4-1', '4-2', '4-3'] : []
  permissionVisible.value = true
}

const savePermission = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys()
  console.log('保存的权限:', checkedKeys)
  permissionVisible.value = false
  ElMessage.success('权限配置成功')
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除角色"${row.name}"吗？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {}
}

onMounted(() => loadData())
</script>
