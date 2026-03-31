package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbSRole;
import com.linewell.edu.mapper.RoleMapper;
import com.linewell.edu.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 角色服务实现
 */
@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends ServiceImpl<RoleMapper, TbSRole> implements IRoleService {

    @Override
    public Page<TbSRole> findPage(Integer page, Integer pageSize, String roleCode, String roleName) {
        Page<TbSRole> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbSRole> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(roleCode)) {
            wrapper.like(TbSRole::getRoleCode, roleCode);
        }
        if (StringUtils.hasText(roleName)) {
            wrapper.like(TbSRole::getRoleName, roleName);
        }

        wrapper.orderByDesc(TbSRole::getCjsj);
        return this.page(p, wrapper);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }
}
