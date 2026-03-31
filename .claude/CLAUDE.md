# CLAUDE.md

## 语言设置
**必须使用中文**与用户对话。


## Skills 强制评估（必须遵守）

> **每次用户提问时，UserPromptSubmit Hook 会注入技能评估提示。必须严格遵循！**

**流程**：
1. **评估**：根据注入的技能列表，列出匹配的技能及理由
2. **激活**：对每个匹配的技能调用 `skill(技能名)`
3. **实现**：激活完成后开始实现

**Skills 位置**：`.claude/skills/[skill-name]/SKILL.md`

---


## 系统架构说明

| 端 | 技术栈 | 说明 |
|---|--------|------|
| PC 前端 | Vue 3 + Element Plus（Options API） | 前端功能 |
| 移动端 | UniApp + uView UI 2.x | 移动端功能 |
| 后端 | Spring Boot 3 + MyBatis-Plus | 统一 API 服务 |
| 数据库 | mysql 8 | 业务数据存储 |

## 核心架构（必须牢记）

| 项目 | 规范                                                          |
|------|-------------------------------------------------------------|
| **包名** | `com.linewell.*`                                            |
| **三层架构** | Controller → Service → Mapper                               |
| **Entity基类** | `TbBaseEntity`（普通表）或 `TbTreeEntity`（树形表）           |
| **主键策略** | 雪花ID（不用 AUTO_INCREMENT）                                  |

### 模块与表前缀对应

| 类型   | 表前缀     | 包路径                      | 示例                  |
|------|---------|--------------------------|-----------------------------|
| base | `TB_B_` | `com.linewell.base.xxxx` | `TB_B_XXXX_XXX`, `TB_B_XTGL_YH` |
| sys  | `TB_S_` | `com.linewell.sys.xxxx`  | `TB_S_USER`                 |
| 自定义 | 自定义 | `com.linewell.xxx`       | 按业务定义                    |

---

## 绝对禁止的写法

### 后端禁止项

```java
// ❌ 禁止1: 错误包名
package com.ruoyi.xxx;    // 必须是 com.linewell.xxx

// ❌ 禁止2: 使用完整类型引用
public org.dromara.common.core.domain.R<XxxVo> getXxx()  // ❌ 禁止！
// ✅ 正确：先 import，再使用短类名
import org.dromara.common.core.domain.R;
public R<XxxVo> getXxx()

// ❌ 禁止3: 数据库使用自增ID
id BIGINT(20) AUTO_INCREMENT  // 禁止！本项目用雪花ID
```


## API 路径规范

| 操作 | HTTP方法 | 路径格式 | 示例 |
|------|---------|---------|------|
| 分页查询 | GET | `/list` | `@GetMapping("list")` |
| 获取详情 | GET | `/queryById?id=` | `@GetMapping("queryById")` |
| 保存 | POST | `/save` | `@PostMapping("save")` |
| 删除 | DELETE | `/delete?ids=` | `@DeleteMapping("delete")` |
| 导出 | GET | `/export` | `@GetMapping("export")` |
| 导入 | POST | `/import` | `@PostMapping("import")` |

---

## 后端代码结构

### 三层架构

```
Controller → Service → Mapper
     ↓           ↓         ↓
  接收请求    业务逻辑    数据访问
  参数校验    查询构建    MyBatis
```

### 标准模块结构

```
jp-console/jeeplus-modules/jeeplus-test/src/main/java/com/jeeplus/test/xxx/
├── controller/
│   └── TbBXxxController.java          # 控制器
├── entity/
│   └── TbBXxx.java                    # 实体类
├── mapper/
│   ├── xml                           
│   │   └── TbBXxxMapper.xml           # Mapper XML文件
│   └── TbBXxxMapper.java              # Mapper 接口
└── service/
    └── TbBXxxService.java             # 服务类
```

---

## 数据库设计规范

### 普通表模板

```sql
CREATE TABLE TB_B_XXX_XXX (
    ID VARCHAR(32) NOT NULL PRIMARY KEY,   -- 主键
    XM VARCHAR(200),                       -- 姓名
    QHID VARCHAR(10),                      -- 所属区划ID
    ZT VARCHAR(10),                        -- 状态
    CJR VARCHAR(32),                       -- 创建人
    CJSJ DATETIME,                        -- 创建时间
    GXR VARCHAR(32),                       -- 更新人
    GXSJ DATETIME,                        -- 更新时间
    LJSC INT                               -- 逻辑删除标记
);

COMMENT ON TABLE TB_B_XXX_XXX IS 'XXX业务表';
COMMENT ON COLUMN TB_B_XXX_XXX.ID IS '主键';
COMMENT ON COLUMN TB_B_XXX_XXX.XM IS '姓名';
COMMENT ON COLUMN TB_B_XXX_XXX.QHID IS '所属区划ID';
COMMENT ON COLUMN TB_B_XXX_XXX.ZT IS '状态';
COMMENT ON COLUMN TB_B_XXX_XXX.CJR IS '创建人';
COMMENT ON COLUMN TB_B_XXX_XXX.CJSJ IS '创建时间';
COMMENT ON COLUMN TB_B_XXX_XXX.GXR IS '更新人';
COMMENT ON COLUMN TB_B_XXX_XXX.GXSJ IS '更新时间';
COMMENT ON COLUMN TB_B_XXX_XXX.LJSC IS '逻辑删除（0：显示，1：隐藏)';
```

### 树形表模板

```sql
CREATE TABLE TB_B_XXX_TREE (
    ID VARCHAR(32) NOT NULL PRIMARY KEY,  -- 主键
    PID VARCHAR(32),                      -- 父级ID
    PIDS VARCHAR(2000),                   -- 所有父级ID
    MC VARCHAR(200),                      -- 名称
    PX DECIMAL,                           -- 排序
    BZ VARCHAR(255),                      -- 备注
    CJR VARCHAR(32),                      -- 创建人
    CJSJ DATETIME,                       -- 创建时间
    GXR VARCHAR(32),                      -- 更新人
    GXSJ DATETIME,                       -- 更新时间
    LJSC INT                              -- 逻辑删除标记
);
COMMENT ON TABLE TB_B_XXX_TREE IS '基本信息_树表';
COMMENT ON COLUMN TB_B_XXX_TREE.ID IS 'ID';
COMMENT ON COLUMN TB_B_XXX_TREE.PID IS '父ID';
COMMENT ON COLUMN TB_B_XXX_TREE.PIDS IS '父IDS';
COMMENT ON COLUMN TB_B_XXX_TREE.MC IS '姓名';
COMMENT ON COLUMN TB_B_XXX_TREE.PX IS '排序';
COMMENT ON COLUMN TB_B_XXX_TREE.BZ IS '备注信息';
COMMENT ON COLUMN TB_B_XXX_TREE.CJR IS '创建人';
COMMENT ON COLUMN TB_B_XXX_TREE.CJSJ IS '创建时间';
COMMENT ON COLUMN TB_B_XXX_TREE.GXR IS '更新人';
COMMENT ON COLUMN TB_B_XXX_TREE.GXSJ IS '更新时间';
COMMENT ON COLUMN TB_B_XXX_TREE.LJSC IS '逻辑删除（0：显示，1：隐藏)';
```

