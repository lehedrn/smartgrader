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
