package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * 学生错题表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_MISTAKE")
public class TbBMistake extends BaseEntity {

    private String studentId;
    private String questionId;
    private String homeworkId;
    private String wrongAnswer;
    private String correctAnswer;
    private Integer errorCount;
    private LocalDateTime lastErrorTime;
    private Integer mastered;
}
