package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK_CLASS")
public class TbBHomeworkClass extends BaseEntity {

    private String homeworkId;
    private String classId;
}
