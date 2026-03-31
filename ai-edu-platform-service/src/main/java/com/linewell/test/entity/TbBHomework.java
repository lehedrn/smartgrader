package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_B_HOMEWORK")
public class TbBHomework extends BaseEntity {

    private String title;
    private String subject;
    private String type;
    private LocalDate publishDate;
    private LocalDateTime deadline;
    private Integer duration;
    private String description;
    private String status;
    private String teacherId;
    private String teacherName;
}
