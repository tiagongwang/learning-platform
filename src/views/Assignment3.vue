<template>
  <div class="learning-platform">
    <header class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <el-icon :size="28" color="#409EFF">
            <School />
          </el-icon>
          <span class="logo-text">智学云课堂</span>
        </div>

        <div class="search-box">
          <el-input
            v-model="keyword"
            size="large"
            clearable
            placeholder="搜索课程、讲师、分类…"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <div class="navbar-right">
        <el-badge :value="6" :max="99" class="badge-item">
          <el-icon :size="22"><Bell /></el-icon>
        </el-badge>

        <el-dropdown trigger="hover" class="avatar-dropdown" @command="handleCommand">
          <el-avatar :size="36" :src="avatarUrl" class="avatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="courses">已购课程</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <section class="banner">
      <el-carousel height="340px" trigger="click" :interval="4000" arrow="hover">
        <el-carousel-item v-for="item in banners" :key="item.title">
          <div class="banner-slide" :style="{ background: item.background }">
            <div class="banner-text">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary" round>立即查看</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <main class="container">
      <section class="block">
        <div class="block-header">
          <h3 class="block-title">精选课程</h3>
          <span class="block-sub">跟随行业一线工程师学习</span>
        </div>

        <el-tabs v-model="activeTab" class="course-tabs">
          <el-tab-pane name="all" label="全部" />
          <el-tab-pane name="frontend" label="前端" />
          <el-tab-pane name="ai" label="AI Coding" />
        </el-tabs>

        <el-row :gutter="20" class="course-grid">
          <el-col v-for="course in filteredCourses" :key="course.title" :xs="24" :sm="12" :md="8">
            <el-card class="course-card" shadow="hover" :body-style="{ padding: '0' }">
              <div class="course-cover" :style="{ background: course.cover }">
                <el-icon :size="40" color="#fff"><Reading /></el-icon>
              </div>
              <div class="course-body">
                <el-tag :type="course.tagType" effect="light" size="small">
                  {{ course.category }}
                </el-tag>
                <h4 class="course-title">{{ course.title }}</h4>
                <p class="course-meta">讲师：{{ course.teacher }} · {{ course.lessons }}课时</p>
                <div class="course-footer">
                  <span class="course-price">¥ {{ course.price }}</span>
                  <el-button type="primary" size="small" round @click="handleStudy(course)">
                    立即学习
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <section class="block">
        <div class="block-header">
          <h3 class="block-title">我的学习记录</h3>
          <span class="block-sub">坚持学习，持续进步</span>
        </div>

        <el-table :data="learningRecords" stripe border>
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="course" label="课程名称" min-width="180" />
          <el-table-column prop="chapter" label="当前章节" min-width="160" />
          <el-table-column label="学习进度" width="220" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="row.progress"
                :color="progressColor"
                :stroke-width="20"
                text-inside
              />
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" effect="plain">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default>
              <el-button type="primary" link>继续学习</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <section class="block">
        <div class="block-header">
          <h3 class="block-title">帮助中心</h3>
          <span class="block-sub">常见问题解答</span>
        </div>

        <el-collapse v-model="activeFaq" accordion class="faq">
          <el-collapse-item
            v-for="(item, index) in faqs"
            :key="item.question"
            :name="String(index)"
            :title="item.question"
          >
            <p class="faq-answer">{{ item.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 智学云课堂 · 仅用于教学示范</span>
        <el-button type="primary" @click="dialogVisible = true">
          <el-icon style="margin-right: 6px"><ChatDotRound /></el-icon>
          意见反馈
        </el-button>
      </div>
    </footer>

    <el-dialog
      v-model="dialogVisible"
      title="意见反馈"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="feedbackFormRef"
        :model="feedbackForm"
        :rules="feedbackRules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="feedbackForm.name" placeholder="请输入您的姓名" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="feedbackForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select v-model="feedbackForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="功能建议" value="feature" />
            <el-option label="Bug 报告" value="bug" />
            <el-option label="内容纠错" value="content" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" prop="content">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="4"
            placeholder="请描述您的建议或遇到的问题…"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const keyword = ref('')
const avatarUrl =
  'https://gips1.baidu.com/it/u=3249564727,2553492563&fm=3074&app=3074&f=PNG?w=2048&h=2048'

const banners = [
  {
    title: '前端进阶训练营 2026',
    description: '从工程化到性能优化，全面实战',
    background: 'linear-gradient(135deg, #409EFF, #67C23A)',
  },
  {
    title: 'AI Coding 实战季',
    description: '掌握 LLM 辅助开发，提升 10 倍效率',
    background: 'linear-gradient(135deg, #9C27B0, #E91E63)',
  },
  {
    title: '全栈进阶计划',
    description: '前端 + Node + 云原生，一站式成长',
    background: 'linear-gradient(135deg, #FF9800, #FF5722)',
  },
]

const activeTab = ref('all')

const courses = [
  {
    title: 'Vue3 组件库设计与实现',
    category: '前端',
    type: 'frontend',
    teacher: '李伟',
    lessons: 24,
    price: 299,
    cover: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    tagType: 'primary',
  },
  {
    title: 'React 18 并发渲染原理',
    category: '前端',
    type: 'frontend',
    teacher: '王芳',
    lessons: 18,
    price: 199,
    cover: 'linear-gradient(135deg, #67C23A, #95d475)',
    tagType: 'success',
  },
  {
    title: 'AI 辅助编程实战营',
    category: 'AI Coding',
    type: 'ai',
    teacher: '张磊',
    lessons: 16,
    price: 399,
    cover: 'linear-gradient(135deg, #9C27B0, #b647c9)',
    tagType: 'warning',
  },
  {
    title: 'TypeScript 类型体操进阶',
    category: '前端',
    type: 'frontend',
    teacher: '陈静',
    lessons: 20,
    price: 249,
    cover: 'linear-gradient(135deg, #E6A23C, #f0c050)',
    tagType: 'primary',
  },
  {
    title: 'Prompt 工程与 LLM 应用开发',
    category: 'AI Coding',
    type: 'ai',
    teacher: '赵强',
    lessons: 14,
    price: 349,
    cover: 'linear-gradient(135deg, #F56C6C, #f89898)',
    tagType: 'danger',
  },
  {
    title: 'Vite 构建工具深度剖析',
    category: '前端',
    type: 'frontend',
    teacher: '刘洋',
    lessons: 12,
    price: 159,
    cover: 'linear-gradient(135deg, #909399, #b1b3b8)',
    tagType: 'info',
  },
]

const filteredCourses = computed(() => {
  if (activeTab.value === 'all') {
    return courses
  }
  return courses.filter((course) => course.type === activeTab.value)
})

function handleStudy(course) {
  ElMessage.success(`已加入学习：${course.title}`)
}

const learningRecords = [
  {
    course: 'Vue3 组件库设计与实现',
    chapter: '第 8 章：表单组件封装',
    progress: 65,
    status: '学习中',
  },
  {
    course: 'React 18 并发渲染原理',
    chapter: '第 5 章：Suspense 与并发模式',
    progress: 42,
    status: '学习中',
  },
  {
    course: 'AI 辅助编程实战营',
    chapter: '第 11 章：AI 代码评审',
    progress: 100,
    status: '已完成',
  },
  {
    course: 'TypeScript 类型体操进阶',
    chapter: '第 2 章：条件类型',
    progress: 18,
    status: '学习中',
  },
]

function progressColor(percentage) {
  if (percentage === 100) {
    return '#67C23A'
  }
  if (percentage >= 50) {
    return '#409EFF'
  }
  return '#E6A23C'
}

const activeFaq = ref('0')

const faqs = [
  {
    question: '如何申请课程退款？',
    answer:
      '购买课程 7 天内且学习进度不超过 30%，可在「我的订单」页面申请全额退款，款项将在 3 个工作日内原路退回。',
  },
  {
    question: '课程证书如何获取？',
    answer:
      '完成课程全部章节学习并通过期末测验（≥60 分），系统将自动生成电子证书，可在「个人中心-我的证书」下载。',
  },
  {
    question: '课程有效期是多久？',
    answer: '购买后永久有效，可随时回看复习。配套的直播答疑服务自购买之日起 12 个月内有效。',
  },
]

const dialogVisible = ref(false)
const feedbackFormRef = ref()
const feedbackForm = reactive({
  name: '',
  email: '',
  type: '',
  content: '',
})

const feedbackRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  content: [{ required: true, message: '请填写详细描述', trigger: 'blur' }],
}

function submitFeedback() {
  feedbackFormRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    ElMessage.success('反馈已提交，感谢您的建议！')
    dialogVisible.value = false
    feedbackFormRef.value.resetFields()
  })
}

function handleSearch() {
  const value = keyword.value.trim()
  if (!value) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  ElMessage.success(`正在搜索：${value}`)
}

function handleCommand(command) {
  if (command === 'profile') {
    ElMessage.info('个人信息')
  } else if (command === 'courses') {
    ElMessage.info('已购课程')
  } else if (command === 'logout') {
    ElMessage.info('已退出登录')
  }
}
</script>

<style scoped>
.learning-platform {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  height: 64px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
}

.navbar-left {
  max-width: 1200px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.search-box {
  flex: 1;
  max-width: 480px;
  flex-basis: 400px;
  width: 480px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  flex-shrink: 0;
}

.badge-item {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar {
  cursor: pointer;
  border: 2px solid #f0f2f5;
}

.avatar-dropdown {
  display: flex;
  align-items: center;
}

.banner {
  max-width: 1200px;
  margin: 16px auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.banner-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.banner-text {
  text-align: center;
  color: #fff;
}

.banner-text h2 {
  font-size: 30px;
  margin: 0 0 10px;
}

.banner-text p {
  font-size: 16px;
  margin: 0 0 18px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 40px;
  box-sizing: border-box;
  flex: 1;
}

.block {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.block-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.block-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.block-sub {
  font-size: 13px;
  color: #909399;
}

.course-tabs {
  margin-bottom: 20px;
}

.course-grid {
  margin-top: 8px;
}

.course-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-body {
  padding: 16px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0 4px;
  color: #303133;
}

.course-meta {
  font-size: 13px;
  color: #909399;
  margin: 0 0 12px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price {
  font-size: 18px;
  font-weight: 700;
  color: #f56c6c;
}

.faq-answer {
  color: #606266;
  line-height: 1.8;
  margin: 0;
  padding: 4px 0 8px;
}

.footer {
  background: #303133;
  color: #c0c4cc;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
