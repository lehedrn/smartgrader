package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 作业批阅表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_GRADE")
public class TbBHomeworkGrade extends BaseEntity {

    private String submitId;
    private String homeworkId;
    private String studentId;
    private BigDecimal score;
    private String comment;
    private String gradeTeacherId;
    private String gradeTeacherName;
    private LocalDateTime gradeTime;
}
