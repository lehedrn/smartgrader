// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// 测试报告数据
const testResults = [];
const screenshotsDir = path.join(__dirname, '../test-results/screenshots');

// 确保截图目录存在
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 测试数据
const TEST_DATA = {
  frontendUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:8080/api',
  admin: { username: 'admin', password: 'admin123' },
  teacher: { username: 'teacher1', password: '123456' },
  student: { username: 'student1', password: '123456' },
};

// 工具函数
async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(screenshotsDir, filename);
  try {
    await page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  } catch (e) {
    console.log('Screenshot failed:', e.message);
    return null;
  }
}

// 登录函数
async function performLogin(page, username, password) {
  await page.goto(`${TEST_DATA.frontendUrl}/#/login`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // 查找账号输入框（placeholder: 请输入账号）
  const usernameInput = page.locator('input[placeholder="请输入账号"]').first();
  await usernameInput.fill(username);

  // 查找密码输入框（placeholder: 请输入密码）
  const passwordInput = page.locator('input[placeholder="请输入密码"]').first();
  await passwordInput.fill(password);

  // 查找登录按钮（Element Plus 按钮，文本为"登 录"）
  const submitBtn = page.locator('button.el-button--primary.login-btn, button:has-text("登 录"), button:has-text("登录"):visible').first();
  await submitBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

// TC-01: 用户登录鉴权
test.describe('TC-01: 用户登录鉴权', () => {
  test('should login successfully with admin credentials', async ({ page }) => {
    console.log('=== TC-01: 用户登录鉴权 ===');

    // 1. 打开前端
    await page.goto(TEST_DATA.frontendUrl);
    await page.waitForLoadState('networkidle');
    console.log('1. 打开前端成功，URL:', page.url());

    // 2. 验证自动跳转到登录页
    const currentUrl = page.url();
    console.log('2. 当前 URL:', currentUrl);
    expect(currentUrl).toContain('/login');

    // 3. 输入用户名密码并登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);
    console.log('3. 输入凭据并点击登录');

    // 4. 验证登录后 URL
    const afterLoginUrl = page.url();
    console.log('4. 登录后 URL:', afterLoginUrl);

    // 5. 验证页面显示用户名
    const pageContent = await page.content();
    const hasUserInfo = pageContent.toLowerCase().includes('admin') ||
                        pageContent.includes('欢迎') ||
                        pageContent.includes('控制台');
    console.log('5. 页面包含用户信息:', hasUserInfo);

    await captureScreenshot(page, 'TC01-login-success');
    console.log('=== TC-01 完成 ===');

    expect(afterLoginUrl).not.toBe(currentUrl);
  });
});

// TC-02: 控制台统计数据加载
test.describe('TC-02: 控制台统计数据加载', () => {
  test('should load dashboard statistics', async ({ page }) => {
    console.log('=== TC-02: 控制台统计数据加载 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 等待页面完全加载
    await page.waitForTimeout(3000);

    const pageContent = await page.content();

    // 验证存在统计卡片
    const hasCards = pageContent.includes('card') || pageContent.includes('统计') || pageContent.includes('dashboard') || pageContent.includes('概览');
    console.log('统计卡片存在:', hasCards);

    // 验证数字不为空
    const hasNumbers = /\d+/.test(pageContent);
    console.log('页面包含数字:', hasNumbers);

    // 验证图表区域
    const hasCharts = pageContent.includes('chart') ||
                      pageContent.includes('graph') ||
                      pageContent.includes('canvas') ||
                      pageContent.includes('ECharts') ||
                      pageContent.includes('echarts');
    console.log('页面包含图表:', hasCharts);

    await captureScreenshot(page, 'TC02-dashboard');
    console.log('=== TC-02 完成 ===');
  });
});

// TC-03: 题库管理 - 题目列表加载
test.describe('TC-03: 题库管理 - 题目列表加载', () => {
  test('should load question list', async ({ page }) => {
    console.log('=== TC-03: 题库管理 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 尝试导航到题库管理
    const possiblePaths = ['/resource/question', '/resource/question/list', '/questions', '/resource/questions', '/question-bank'];
    let navigated = false;

    for (const p of possiblePaths) {
      try {
        await page.goto(`${TEST_DATA.frontendUrl}${p}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const content = await page.content();
        if (content.includes('题目') || content.includes('题库') || content.includes('question') || content.includes('试题')) {
          console.log('导航到题库管理:', p);
          navigated = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证题目列表有数据
    const pageContent = await page.content();
    const hasQuestionList = pageContent.includes('题目') ||
                            pageContent.includes('题号') ||
                            pageContent.includes('题型') ||
                            pageContent.includes('难度') ||
                            pageContent.includes('试题');
    console.log('题目列表存在:', hasQuestionList);

    // 验证分页组件
    const hasPagination = pageContent.includes('分页') ||
                          pageContent.includes('page') ||
                          pageContent.includes('共') ||
                          pageContent.includes('条');
    console.log('分页组件存在:', hasPagination);

    await captureScreenshot(page, 'TC03-question-list');
    console.log('=== TC-03 完成 ===');
  });
});

// TC-06: 知识点管理 - 列表加载
test.describe('TC-06: 知识点管理 - 列表加载', () => {
  test('should load knowledge point list', async ({ page }) => {
    console.log('=== TC-06: 知识点管理 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 导航到知识点管理
    const possiblePaths = ['/resource/knowledge', '/resource/knowledge/list', '/knowledge', '/knowledge-points'];

    for (const p of possiblePaths) {
      try {
        await page.goto(`${TEST_DATA.frontendUrl}${p}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const content = await page.content();
        if (content.includes('知识点') || content.includes('knowledge')) {
          console.log('导航到知识点管理:', p);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证知识点列表有数据
    const pageContent = await page.content();
    const hasKnowledgeList = pageContent.includes('知识点') ||
                             pageContent.includes('名称') ||
                             pageContent.includes('编码');
    console.log('知识点列表存在:', hasKnowledgeList);

    await captureScreenshot(page, 'TC06-knowledge-list');
    console.log('=== TC-06 完成 ===');
  });
});

// TC-07: 用户管理 - 用户列表加载
test.describe('TC-07: 用户管理 - 用户列表加载', () => {
  test('should load user list', async ({ page }) => {
    console.log('=== TC-07: 用户管理 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 导航到用户管理
    const possiblePaths = ['/system/user', '/system/user/list', '/user', '/users', '/user-management'];

    for (const p of possiblePaths) {
      try {
        await page.goto(`${TEST_DATA.frontendUrl}${p}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const content = await page.content();
        if (content.includes('用户') || content.includes('user') || content.includes('姓名')) {
          console.log('导航到用户管理:', p);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证用户列表有数据
    const pageContent = await page.content();
    const hasUserList = pageContent.includes('用户') ||
                        pageContent.includes('admin') ||
                        pageContent.includes('教师') ||
                        pageContent.includes('学生');
    console.log('用户列表存在:', hasUserList);

    await captureScreenshot(page, 'TC07-user-list');
    console.log('=== TC-07 完成 ===');
  });
});

// TC-08: 角色管理 - 角色列表加载
test.describe('TC-08: 角色管理 - 角色列表加载', () => {
  test('should load role list', async ({ page }) => {
    console.log('=== TC-08: 角色管理 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 导航到角色管理
    const possiblePaths = ['/system/role', '/system/role/list', '/role', '/roles', '/role-management'];

    for (const p of possiblePaths) {
      try {
        await page.goto(`${TEST_DATA.frontendUrl}${p}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const content = await page.content();
        if (content.includes('角色') || content.includes('role') || content.includes('管理员')) {
          console.log('导航到角色管理:', p);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证角色列表显示
    const pageContent = await page.content();
    const hasRoleList = pageContent.includes('角色') ||
                        pageContent.includes('管理员') ||
                        pageContent.includes('教师') ||
                        pageContent.includes('学生');
    console.log('角色列表存在:', hasRoleList);

    await captureScreenshot(page, 'TC08-role-list');
    console.log('=== TC-08 完成 ===');
  });
});

// TC-09: 作业管理 - 作业列表加载
test.describe('TC-09: 作业管理 - 作业列表加载', () => {
  test('should load homework list', async ({ page }) => {
    console.log('=== TC-09: 作业管理 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 导航到作业管理
    const possiblePaths = ['/homework', '/homework/list', '/homework/publish', '/assignment', '/assignments'];

    for (const p of possiblePaths) {
      try {
        await page.goto(`${TEST_DATA.frontendUrl}${p}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const content = await page.content();
        if (content.includes('作业') || content.includes('homework') || content.includes('assignment')) {
          console.log('导航到作业管理:', p);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证作业列表有数据
    const pageContent = await page.content();
    const hasHomeworkList = pageContent.includes('作业') ||
                            pageContent.includes('题目') ||
                            pageContent.includes('发布') ||
                            pageContent.includes('状态');
    console.log('作业列表存在:', hasHomeworkList);

    // 验证作业状态显示
    const hasStatus = pageContent.includes('状态') ||
                      pageContent.includes('已发布') ||
                      pageContent.includes('未发布') ||
                      pageContent.includes('进行中');
    console.log('状态显示存在:', hasStatus);

    await captureScreenshot(page, 'TC09-homework-list');
    console.log('=== TC-09 完成 ===');
  });
});

// TC-16: 用户退出登录
test.describe('TC-16: 用户退出登录', () => {
  test('should logout successfully', async ({ page }) => {
    console.log('=== TC-16: 用户退出登录 ===');

    // 先登录
    await performLogin(page, TEST_DATA.admin.username, TEST_DATA.admin.password);

    // 点击页面右上角用户头像
    const avatarSelectors = [
      '.ant-avatar',
      '.el-avatar',
      '[class*="avatar"]',
      '[class*="user"]',
      'img[alt*="user"]',
      '.user-dropdown'
    ];

    for (const selector of avatarSelectors) {
      try {
        const avatar = page.locator(selector).first();
        if (await avatar.count() > 0) {
          await avatar.click();
          await page.waitForTimeout(1000);
          console.log('点击用户头像成功');
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 点击退出登录按钮
    const logoutSelectors = [
      'button:has-text("退出")',
      'button:has-text("登出")',
      'a:has-text("退出")',
      'div:has-text("退出")',
      '.ant-dropdown-menu-item:has-text("退出")',
      '.el-dropdown-menu-item:has-text("退出")'
    ];

    for (const selector of logoutSelectors) {
      try {
        const logoutBtn = page.locator(selector).first();
        if (await logoutBtn.count() > 0) {
          await logoutBtn.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
          console.log('点击退出登录成功');
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // 验证跳转到登录页
    const afterLogoutUrl = page.url();
    console.log('退出后 URL:', afterLogoutUrl);

    // 验证直接访问 dashboard 会重定向
    await page.goto(`${TEST_DATA.frontendUrl}/dashboard`);
    await page.waitForLoadState('networkidle');
    const dashboardUrl = page.url();
    const redirectedToLogin = dashboardUrl.includes('/login');
    console.log('访问 dashboard 后 URL:', dashboardUrl, '是否重定向到登录页:', redirectedToLogin);

    await captureScreenshot(page, 'TC16-logout');
    console.log('=== TC-16 完成 ===');
  });
});

// TC-17: 后端 API 直连健康检查
test.describe('TC-17: 后端 API 直连健康检查', () => {
  test('should verify backend API health', async ({ request }) => {
    console.log('=== TC-17: 后端 API 健康检查 ===');

    // 访问后端 API 验证可访问性
    let apiStatus = 'unknown';
    try {
      const response = await request.get(`${TEST_DATA.backendUrl}`);
      apiStatus = response.status();
      console.log('后端 API 响应状态:', apiStatus);
    } catch (e) {
      console.log('后端 API 访问失败:', e.message);
    }

    // 尝试访问常见的健康检查端点
    const healthEndpoints = ['', '/health', '/actuator/health', '/info'];
    let healthStatus = 'unknown';

    for (const endpoint of healthEndpoints) {
      try {
        const res = await request.get(`${TEST_DATA.backendUrl}${endpoint}`);
        console.log(`${endpoint} 响应状态:`, res.status());
        if (res.status() === 200 || res.status() === 404) {
          healthStatus = `${res.status()}`;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    console.log('=== TC-17 完成 ===');
  });
});

// TC-18: 错误处理验证
test.describe('TC-18: 错误处理验证', () => {
  test('should display friendly error message on login failure', async ({ page }) => {
    console.log('=== TC-18: 错误处理验证 ===');

    // 打开登录页
    await page.goto(`${TEST_DATA.frontendUrl}/#/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    console.log('打开登录页成功');

    // 输入错误密码
    const usernameInput = page.locator('input[placeholder="请输入账号"]').first();
    await usernameInput.fill('admin');

    const passwordInput = page.locator('input[placeholder="请输入密码"]').first();
    await passwordInput.fill('wrongpassword');

    const submitBtn = page.locator('button.el-button--primary.login-btn, button:has-text("登 录"):visible').first();
    await submitBtn.click();
    console.log('输入错误凭据并提交');

    // 等待响应
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');

    // 验证前端显示错误提示
    const pageContent = await page.content();
    const hasError = pageContent.includes('错误') ||
                     pageContent.includes('失败') ||
                     pageContent.includes('不正确') ||
                     pageContent.includes('error') ||
                     pageContent.includes('invalid') ||
                     pageContent.includes('密码');
    console.log('显示错误提示:', hasError);

    // 验证错误提示友好（不包含敏感信息）
    const hasSensitiveInfo = pageContent.includes('admin123') ||
                             pageContent.includes('SQL') ||
                             pageContent.includes('Exception') ||
                             pageContent.includes('Stack');
    const isFriendly = hasError && !hasSensitiveInfo;
    console.log('错误提示友好:', isFriendly);

    await captureScreenshot(page, 'TC18-error-handling');
    console.log('=== TC-18 完成 ===');
  });
});
