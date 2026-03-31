package com.linewell.edu.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统用户表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("TB_S_USER")
public class TbSUser extends BaseEntity {

    private String username;
    private String password;
    private String realName;
    private String avatar;
    private String organization;
    private String phone;
    private String email;
    private String userType;
    private String status;
}
