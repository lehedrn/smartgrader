package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.linewell.edu.entity.TbSRole;

/**
 * 角色服务接口
 */
public interface IRoleService extends IService<TbSRole> {

    /**
     * 分页查询角色
     */
    Page<TbSRole> findPage(Integer page, Integer pageSize, String roleCode, String roleName);

    /**
     * 批量删除角色
     */
    void deleteByIds(String ids);
}
