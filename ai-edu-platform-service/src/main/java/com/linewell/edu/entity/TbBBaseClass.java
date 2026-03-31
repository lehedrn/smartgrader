package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 班级信息表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_BASE_CLASS")
public class TbBBaseClass extends BaseEntity {

    private String className;
    private String schoolId;
    private String grade;
    private String teacherId;
}
