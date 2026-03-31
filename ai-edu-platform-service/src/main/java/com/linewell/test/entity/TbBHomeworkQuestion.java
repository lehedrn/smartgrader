package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_QUESTION")
public class TbBHomeworkQuestion extends BaseEntity {

    private String homeworkId;
    private String questionId;
    private BigDecimal score;
    private Integer px;
}
