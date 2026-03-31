package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 作业信息表
 */
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
