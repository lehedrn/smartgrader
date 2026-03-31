package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbSUser;
import com.linewell.edu.mapper.UserMapper;
import com.linewell.edu.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, TbSUser> implements IUserService {

    private static final String DEFAULT_PASSWORD = "123456";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Page<TbSUser> findPage(Integer page, Integer pageSize, String username, String realName, String userType, String status) {
        Page<TbSUser> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbSUser> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(username)) {
            wrapper.like(TbSUser::getUsername, username);
        }
        if (StringUtils.hasText(realName)) {
            wrapper.like(TbSUser::getRealName, realName);
        }
        if (StringUtils.hasText(userType)) {
            wrapper.eq(TbSUser::getUserType, userType);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(TbSUser::getStatus, status);
        }

        wrapper.orderByDesc(TbSUser::getCjsj);
        return this.page(p, wrapper);
    }

    @Override
    public void saveUser(TbSUser user) {
        if (StringUtils.hasText(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        }
        this.save(user);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }

    @Override
    public void resetPassword(String id) {
        TbSUser user = this.getById(id);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
            this.updateById(user);
        }
    }
}
