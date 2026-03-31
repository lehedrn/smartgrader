package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 知识点信息表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_KNOWLEDGE")
public class TbBKnowledge extends BaseEntity {

    private String knowledgeName;
    private String subject;
    private String grade;
    private String parentId;
    private String path;
}
