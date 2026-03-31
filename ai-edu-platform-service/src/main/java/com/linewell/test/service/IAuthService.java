package com.linewell.test.service;

import com.linewell.test.entity.TbSUser;

public interface IAuthService {

    String login(String username, String password);

    TbSUser getUserInfo(String userId);

    void changePassword(String userId, String oldPassword, String newPassword);
}
