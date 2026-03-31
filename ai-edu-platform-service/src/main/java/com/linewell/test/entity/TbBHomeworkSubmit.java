package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_SUBMIT")
public class TbBHomeworkSubmit extends BaseEntity {

    private String homeworkId;
    private String studentId;
    private String studentName;
    private String classId;
    private String answerContent;
    private String fileUrl;
    private String description;
    private LocalDateTime submitTime;
    private String aiStatus;
    private BigDecimal aiScore;
    private String status;
}
