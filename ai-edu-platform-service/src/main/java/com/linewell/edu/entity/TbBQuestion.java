package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 题库信息表
 */
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
