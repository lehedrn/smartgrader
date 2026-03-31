package com.linewell.edu.service;

import com.linewell.edu.entity.TbSUser;

/**
 * 认证服务接口
 */
public interface IAuthService {

    String login(String username, String password);

    TbSUser getUserInfo(String userId);

    void changePassword(String userId, String oldPassword, String newPassword);
}
