package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.linewell.edu.entity.TbSUser;

/**
 * 用户服务接口
 */
public interface IUserService extends IService<TbSUser> {

    /**
     * 分页查询用户
     */
    Page<TbSUser> findPage(Integer page, Integer pageSize, String username, String realName, String userType, String status);

    /**
     * 保存用户（加密密码）
     */
    void saveUser(TbSUser user);

    /**
     * 批量删除用户
     */
    void deleteByIds(String ids);

    /**
     * 重置密码
     */
    void resetPassword(String id);
}
