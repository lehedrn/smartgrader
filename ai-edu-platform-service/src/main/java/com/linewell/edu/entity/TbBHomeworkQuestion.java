package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 作业题目关联表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_QUESTION")
public class TbBHomeworkQuestion extends BaseEntity {

    private String homeworkId;
    private String questionId;
    private BigDecimal score;
    private Integer px;
}
