package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 作业班级关联表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_CLASS")
public class TbBHomeworkClass extends BaseEntity {

    private String homeworkId;
    private String classId;
}
