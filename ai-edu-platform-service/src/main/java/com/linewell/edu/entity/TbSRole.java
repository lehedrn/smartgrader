package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统角色表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_S_ROLE")
public class TbSRole extends BaseEntity {

    private String roleCode;
    private String roleName;
    private String remark;
}
