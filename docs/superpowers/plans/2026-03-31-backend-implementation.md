# 智能作业批阅平台后端实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于前端已有的 API 契约，实现完整的 Spring Boot 3 后端服务，包括认证、作业管理、资源管理、报告统计等核心功能

**Architecture:** 标准三层架构 (Controller → Service → Mapper)，使用 MyBatis-Plus 作为 ORM 框架，JWT 进行身份认证

**Tech Stack:** Spring Boot 3.2.0, MyBatis-Plus 3.5.7, MySQL 8.0, JWT, Lombok

---

## 第一阶段：前端接口审计与契约分析

### 接口清单总览

#### 1. 认证模块 (auth.js)

| API 路由 | HTTP 方法 | 请求参数 | 响应结构 | 前端文件 |
|---------|----------|---------|---------|---------|
| `/auth/login` | POST | `{username, password, code?}` | `{token}` | `src/api/auth.js`, `src/views/login/index.vue` |
| `/auth/userinfo` | GET | 无 | `{id, username, realName, avatar, organization, roles}` | `src/api/auth.js`, `src/store/modules/user.js` |
| `/auth/logout` | POST | 无 | 无 | `src/api/auth.js` |
| `/auth/password` | POST | `{oldPassword, newPassword}` | 无 | `src/api/auth.js` |

#### 2. 作业模块 (homework.js)

| API 路由 | HTTP 方法 | 请求参数 | 响应结构 | 前端文件 |
|---------|----------|---------|---------|---------|
| `/homework/list` | GET | `{page, pageSize, subject?, type?, className?, status?}` | `{list: [], total: 0}` | `src/api/homework.js`, `src/views/homework/publish/index.vue` |
| `/homework/detail/{id}` | GET | 路径参数：id | `{id, title, subject, type, classes: [], publishDate, deadline, duration, description, questions: [], status, submittedCount, studentCount}` | `src/api/homework.js`, `src/views/homework/publish/create.vue` |
| `/homework/create` | POST | `{title, subject, type, classes: [], publishDate, deadline, duration, description, questions: [{id, title, score}]}` | 无 | `src/api/homework.js` |
| `/homework/update/{id}` | PUT | 路径参数：id + 作业数据 | 无 | `src/api/homework.js` |
| `/homework/delete` | DELETE | 查询参数：`ids` (逗号分隔) | 无 | `src/api/homework.js` |
| `/homework/submit` | POST | `{homeworkId, description, file}` | 无 | `src/api/homework.js`, `src/views/homework/submit/index.vue` |
| `/homework/grade` | POST | `{homeworkId, studentId, score, comment}` | 无 | `src/api/homework.js` |

---

## 第二阶段：数据库建模

### 表结构设计

#### 1. 用户表 (TB_S_USER)

```sql
CREATE TABLE TB_S_USER (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '用户 ID',
    USERNAME VARCHAR(50) NOT NULL COMMENT '用户名',
    PASSWORD VARCHAR(255) NOT NULL COMMENT '密码 (BCrypt 加密)',
    REAL_NAME VARCHAR(100) COMMENT '真实姓名',
    AVATAR VARCHAR(500) COMMENT '头像 URL',
    ORGANIZATION VARCHAR(200) COMMENT '所属学校/机构',
    PHONE VARCHAR(20) COMMENT '手机号',
    EMAIL VARCHAR(100) COMMENT '邮箱',
    USER_TYPE VARCHAR(10) DEFAULT 'TEACHER' COMMENT '用户类型：TEACHER/STUDENT',
    STATUS VARCHAR(10) DEFAULT 'NORMAL' COMMENT '状态：NORMAL/LOCKED',
    CJR VARCHAR(32) COMMENT '创建人',
    CJSJ DATETIME COMMENT '创建时间',
    GXR VARCHAR(32) COMMENT '更新人',
    GXSJ DATETIME COMMENT '更新时间',
    LJSC INT DEFAULT 0 COMMENT '逻辑删除（0：显示，1：隐藏)'
) COMMENT '系统用户表';
```

#### 2. 角色表 (TB_S_ROLE)

```sql
CREATE TABLE TB_S_ROLE (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '角色 ID',
    ROLE_CODE VARCHAR(50) NOT NULL COMMENT '角色编码',
    ROLE_NAME VARCHAR(100) NOT NULL COMMENT '角色名称',
    REMARK VARCHAR(255) COMMENT '备注',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME,
    LJSC INT DEFAULT 0
) COMMENT '系统角色表';
```

#### 3. 用户角色关联表 (TB_S_USER_ROLE)

```sql
CREATE TABLE TB_S_USER_ROLE (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '主键',
    USER_ID VARCHAR(32) NOT NULL COMMENT '用户 ID',
    ROLE_ID VARCHAR(32) NOT NULL COMMENT '角色 ID',
    CJR VARCHAR(32),
    CJSJ DATETIME
) COMMENT '用户角色关联表';
```

#### 4. 班级表 (TB_B_BASE_CLASS)

```sql
CREATE TABLE TB_B_BASE_CLASS (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '班级 ID',
    CLASS_NAME VARCHAR(100) NOT NULL COMMENT '班级名称',
    SCHOOL_ID VARCHAR(32) COMMENT '学校 ID',
    GRADE VARCHAR(10) COMMENT '年级',
    TEACHER_ID VARCHAR(32) COMMENT '班主任 ID',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME,
    LJSC INT DEFAULT 0
) COMMENT '班级信息表';
```

#### 5. 作业主表 (TB_B_HOMEWORK)

```sql
CREATE TABLE TB_B_HOMEWORK (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '作业 ID',
    TITLE VARCHAR(200) NOT NULL COMMENT '作业标题',
    SUBJECT VARCHAR(50) NOT NULL COMMENT '学科',
    TYPE VARCHAR(50) NOT NULL COMMENT '作业类型',
    PUBLISH_DATE DATE COMMENT '布置日期',
    DEADLINE DATETIME COMMENT '截止时间',
    DURATION INT COMMENT '预计时长 (分钟)',
    DESCRIPTION VARCHAR(1000) COMMENT '作业描述',
    STATUS VARCHAR(10) DEFAULT 'WKS' COMMENT '状态：WKS 未开始/JXZ 进行中/YJZ 已截止/YWC 已完成',
    TEACHER_ID VARCHAR(32) NOT NULL COMMENT '发布教师 ID',
    TEACHER_NAME VARCHAR(100) COMMENT '发布教师姓名',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME,
    LJSC INT DEFAULT 0
) COMMENT '作业信息表';
```

#### 6. 作业班级关联表 (TB_B_HOMEWORK_CLASS)

```sql
CREATE TABLE TB_B_HOMEWORK_CLASS (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '主键',
    HOMEWORK_ID VARCHAR(32) NOT NULL COMMENT '作业 ID',
    CLASS_ID VARCHAR(32) NOT NULL COMMENT '班级 ID',
    CJR VARCHAR(32),
    CJSJ DATETIME
) COMMENT '作业班级关联表';
```

#### 7. 题库表 (TB_B_QUESTION)

```sql
CREATE TABLE TB_B_QUESTION (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '题目 ID',
    TITLE VARCHAR(1000) NOT NULL COMMENT '题目标题',
    SUBJECT VARCHAR(50) COMMENT '学科',
    TYPE VARCHAR(50) COMMENT '题型',
    DIFFICULTY VARCHAR(20) COMMENT '难度',
    KNOWLEDGE VARCHAR(200) COMMENT '知识点',
    CONTENT TEXT COMMENT '题目内容',
    ANSWER TEXT COMMENT '参考答案',
    SCORE DECIMAL(5,2) DEFAULT 5.00 COMMENT '默认分值',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME,
    LJSC INT DEFAULT 0
) COMMENT '题库信息表';
```

#### 8. 作业题目关联表 (TB_B_HOMEWORK_QUESTION)

```sql
CREATE TABLE TB_B_HOMEWORK_QUESTION (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '主键',
    HOMEWORK_ID VARCHAR(32) NOT NULL COMMENT '作业 ID',
    QUESTION_ID VARCHAR(32) NOT NULL COMMENT '题目 ID',
    SCORE DECIMAL(5,2) COMMENT '本题分值',
    PX INT DEFAULT 0 COMMENT '排序',
    CJR VARCHAR(32),
    CJSJ DATETIME
) COMMENT '作业题目关联表';
```

#### 9. 作业提交表 (TB_B_HOMEWORK_SUBMIT)

```sql
CREATE TABLE TB_B_HOMEWORK_SUBMIT (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '提交 ID',
    HOMEWORK_ID VARCHAR(32) NOT NULL COMMENT '作业 ID',
    STUDENT_ID VARCHAR(32) NOT NULL COMMENT '学生 ID',
    STUDENT_NAME VARCHAR(100) COMMENT '学生姓名',
    CLASS_ID VARCHAR(32) COMMENT '班级 ID',
    ANSWER_CONTENT TEXT COMMENT '答案内容',
    FILE_URL VARCHAR(500) COMMENT '上传文件 URL',
    DESCRIPTION VARCHAR(500) COMMENT '备注说明',
    SUBMIT_TIME DATETIME COMMENT '提交时间',
    AI_STATUS VARCHAR(20) DEFAULT 'WAITING' COMMENT 'AI 判分状态',
    AI_SCORE DECIMAL(5,2) COMMENT 'AI 判分',
    STATUS VARCHAR(10) DEFAULT 'YTI' COMMENT '状态：WTJ 未提交/YTI 已提交/YPY 待批阅/YQR 已确认',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME
) COMMENT '作业提交表';
```

#### 10. 作业批阅表 (TB_B_HOMEWORK_GRADE)

```sql
CREATE TABLE TB_B_HOMEWORK_GRADE (
    ID VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '批阅 ID',
    SUBMIT_ID VARCHAR(32) NOT NULL COMMENT '提交 ID',
    HOMEWORK_ID VARCHAR(32) NOT NULL COMMENT '作业 ID',
    STUDENT_ID VARCHAR(32) NOT NULL COMMENT '学生 ID',
    SCORE DECIMAL(5,2) COMMENT '得分',
    COMMENT TEXT COMMENT '教师评语',
    GRADE_TEACHER_ID VARCHAR(32) COMMENT '批阅教师 ID',
    GRADE_TEACHER_NAME VARCHAR(100) COMMENT '批阅教师姓名',
    GRADE_TIME DATETIME COMMENT '批阅时间',
    CJR VARCHAR(32),
    CJSJ DATETIME,
    GXR VARCHAR(32),
    GXSJ DATETIME
) COMMENT '作业批阅表';
```

### 初始化数据脚本

```sql
-- 默认管理员账号 (密码：admin123)
INSERT INTO TB_S_USER (ID, USERNAME, PASSWORD, REAL_NAME, USER_TYPE, STATUS, CJSJ) 
VALUES ('10000000000000000000000000000001', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 'TEACHER', 'NORMAL', NOW());

INSERT INTO TB_S_ROLE (ID, ROLE_CODE, ROLE_NAME, CJSJ) 
VALUES ('20000000000000000000000000000001', 'ADMIN', '超级管理员', NOW()),
       ('20000000000000000000000000000002', 'TEACHER', '教师', NOW()),
       ('20000000000000000000000000000003', 'STUDENT', '学生', NOW());

-- 管理员关联角色
INSERT INTO TB_S_USER_ROLE (ID, USER_ID, ROLE_ID, CJSJ) 
VALUES ('30000000000000000000000000000001', '10000000000000000000000000000001', '20000000000000000000000000000001', NOW());
```

---

## 第三阶段：后端工程实现

### 任务分解

### Task 1: 项目初始化与基础配置

**Files:**
- Create: `jp-console/jeeplus-modules/jeeplus-test/pom.xml`
- Create: `src/main/resources/application.yml`
- Create: `src/main/java/com/linewell/test/TestApplication.java`

- [ ] **Step 1: 创建 pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.linewell</groupId>
        <artifactId>jeeplus-modules</artifactId>
        <version>5.0</version>
    </parent>

    <artifactId>jeeplus-test</artifactId>
    <name>jeeplus-test</name>
    <description>智能作业批阅平台后端服务</description>

    <dependencies>
        <dependency>
            <groupId>com.linewell</groupId>
            <artifactId>jeeplus-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.2.0</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>3.5.7</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.32</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
        </dependency>
    </dependencies>
</project>
```

- [ ] **Step 2: 创建 application.yml**

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/gradesystem5?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: 123456
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai

mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  type-aliases-package: com.linewell.test.entity
  global-config:
    db-config:
      id-type: ASSIGN_ID
      logic-delete-field: ljsc
      logic-delete-value: 1
      logic-not-delete-value: 0

jwt:
  secret: your-secret-key-here-minimum-32-characters
  expiration: 86400000
```

- [ ] **Step 3: 创建启动类**

```java
package com.linewell.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
}
```

- [ ] **Step 4: 验证编译**

```bash
cd jp-console/jeeplus-modules/jeeplus-test
mvn clean compile
```

### Task 2: 实体类实现

**Files:**
- Create: `src/main/java/com/linewell/test/entity/TbBHomework.java`
- Create: `src/main/java/com/linewell/test/entity/TbBHomeworkClass.java`
- Create: `src/main/java/com/linewell/test/entity/TbBHomeworkQuestion.java`
- Create: `src/main/java/com/linewell/test/entity/TbBHomeworkSubmit.java`
- Create: `src/main/java/com/linewell/test/entity/TbBHomeworkGrade.java`
- Create: `src/main/java/com/linewell/test/entity/TbBQuestion.java`
- Create: `src/main/java/com/linewell/test/entity/TbSUser.java`
- Create: `src/main/java/com/linewell/test/entity/TbSRole.java`

- [ ] **Step 1: 创建 TbBHomework 实体**

```java
package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK")
public class TbBHomework extends BaseEntity {
    
    private String title;
    private String subject;
    private String type;
    private LocalDate publishDate;
    private LocalDateTime deadline;
    private Integer duration;
    private String description;
    private String status;
    private String teacherId;
    private String teacherName;
}
```

- [ ] **Step 2: 创建 TbBQuestion 实体**

```java
package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_QUESTION")
public class TbBQuestion extends BaseEntity {
    
    private String title;
    private String subject;
    private String type;
    private String difficulty;
    private String knowledge;
    private String content;
    private String answer;
    private BigDecimal score;
}
```

- [ ] **Step 3: 创建其他实体类（TbBHomeworkClass、TbBHomeworkQuestion、TbBHomeworkSubmit、TbBHomeworkGrade、TbSUser、TbSRole）**

（类似上面的结构，按照数据库表设计创建）

### Task 3: Mapper 层实现

**Files:**
- Create: `src/main/java/com/linewell/test/mapper/TbBHomeworkMapper.java`
- Create: `src/main/java/com/linewell/test/mapper/TbBQuestionMapper.java`
- Create: `src/main/java/com/linewell/test/mapper/TbSUserMapper.java`
- Create: `src/main/resources/mapper/test/TbBHomeworkMapper.xml`
- Create: `src/main/resources/mapper/test/TbBQuestionMapper.xml`
- Create: `src/main/resources/mapper/test/TbSUserMapper.xml`

- [ ] **Step 1: 创建 TbBHomeworkMapper 接口**

```java
package com.linewell.test.mapper;

import com.linewell.test.entity.TbBHomework;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TbBHomeworkMapper extends BaseMapper<TbBHomework> {
    
}
```

- [ ] **Step 2: 创建 TbSUserMapper 接口**

```java
package com.linewell.test.mapper;

import com.linewell.test.entity.TbSUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TbSUserMapper extends BaseMapper<TbSUser> {
    
}
```

### Task 4: Service 层实现

**Files:**
- Create: `src/main/java/com/linewell/test/service/IAuthService.java`
- Create: `src/main/java/com/linewell/test/service/impl/AuthServiceImpl.java`
- Create: `src/main/java/com/linewell/test/service/IHomeworkService.java`
- Create: `src/main/java/com/linewell/test/service/impl/HomeworkServiceImpl.java`

- [ ] **Step 1: 创建 IAuthService 接口**

```java
package com.linewell.test.service;

import com.linewell.test.entity.TbSUser;

public interface IAuthService {
    
    String login(String username, String password);
    
    TbSUser getUserInfo(String userId);
    
    void changePassword(String userId, String oldPassword, String newPassword);
}
```

- [ ] **Step 2: 创建 AuthServiceImpl 实现**

```java
package com.linewell.test.service.impl;

import com.linewell.test.entity.TbSUser;
import com.linewell.test.mapper.TbSUserMapper;
import com.linewell.test.service.IAuthService;
import com.linewell.test.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    
    private final TbSUserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public String login(String username, String password) {
        TbSUser user = userMapper.selectOne(
            new LambdaQueryWrapper<TbSUser>()
                .eq(TbSUser::getUsername, username)
        );
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        return jwtUtil.generateToken(user.getId(), user.getUsername());
    }
    
    @Override
    public TbSUser getUserInfo(String userId) {
        return userMapper.selectById(userId);
    }
    
    @Override
    public void changePassword(String userId, String oldPassword, String newPassword) {
        TbSUser user = userMapper.selectById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userMapper.updateById(user);
    }
}
```

### Task 5: Controller 层实现

**Files:**
- Create: `src/main/java/com/linewell/test/controller/AuthController.java`
- Create: `src/main/java/com/linewell/test/controller/HomeworkController.java`

- [ ] **Step 1: 创建 AuthController**

```java
package com.linewell.test.controller;

import com.linewell.core.domain.R;
import com.linewell.test.entity.TbSUser;
import com.linewell.test.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final IAuthService authService;
    
    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String token = authService.login(params.get("username"), params.get("password"));
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        return R.ok(result);
    }
    
    @GetMapping("/userinfo")
    public R<TbSUser> getUserInfo() {
        // 从 SecurityContext 获取当前用户 ID
        String userId = getCurrentUserId();
        return R.ok(authService.getUserInfo(userId));
    }
    
    @PostMapping("/password")
    public R<Void> changePassword(@RequestBody Map<String, String> params) {
        String userId = getCurrentUserId();
        authService.changePassword(userId, params.get("oldPassword"), params.get("newPassword"));
        return R.ok();
    }
    
    @PostMapping("/logout")
    public R<Void> logout() {
        return R.ok();
    }
    
    private String getCurrentUserId() {
        // TODO: 从 JWT token 中解析用户 ID
        return "10000000000000000000000000000001";
    }
}
```

- [ ] **Step 2: 创建 HomeworkController**

```java
package com.linewell.test.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.core.domain.R;
import com.linewell.test.entity.TbBHomework;
import com.linewell.test.service.IHomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/homework")
@RequiredArgsConstructor
public class HomeworkController {
    
    private final IHomeworkService homeworkService;
    
    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String className
    ) {
        Page<TbBHomework> p = homeworkService.findPage(page, pageSize, subject, type, className);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }
    
    @GetMapping("/detail/{id}")
    public R<TbBHomework> getDetail(@PathVariable String id) {
        return R.ok(homeworkService.getDetail(id));
    }
    
    @PostMapping("/create")
    public R<Void> create(@RequestBody TbBHomework homework) {
        homeworkService.create(homework);
        return R.ok();
    }
    
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable String id, @RequestBody TbBHomework homework) {
        homework.setId(id);
        homeworkService.update(homework);
        return R.ok();
    }
    
    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        homeworkService.deleteByIds(ids);
        return R.ok();
    }
}
```

### Task 6: JWT 工具类实现

**Files:**
- Create: `src/main/java/com/linewell/test/util/JwtUtil.java`

- [ ] **Step 1: 创建 JwtUtil 工具类**

```java
package com.linewell.test.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:default-secret-key-minimum-32-characters-long}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateToken(String userId, String username) {
        return Jwts.builder()
            .subject(userId)
            .claim("username", username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }
    
    public Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
    
    public String getUserId(String token) {
        return parseClaims(token).getSubject();
    }
}
```

---

## 测试计划

- [ ] **认证模块测试**: 登录、获取用户信息、修改密码
- [ ] **作业模块测试**: CRUD 操作、列表查询、状态流转
- [ ] **集成测试**: 完整的作业发布 - 提交 - 批阅流程

---

## 提交计划

每个 Task 完成后提交一次：

```bash
git add .
git commit -m "feat: 完成 [模块名] 功能实现"
```
