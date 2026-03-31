package com.linewell.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.linewell.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_S_ROLE")
public class TbSRole extends BaseEntity {

    private String roleCode;
    private String roleName;
    private String remark;
}
