package com.linewell.edu.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbSUser;
import com.linewell.edu.mapper.TbSUserMapper;
import com.linewell.edu.service.IAuthService;
import com.linewell.edu.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final JwtUtil jwtUtil;
    private final TbSUserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String token = authService.login(params.get("username"), params.get("password"));
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        return R.ok(result);
    }

    @GetMapping("/userinfo")
    public R<TbSUser> getUserInfo(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String userId = getCurrentUserId(authorization);
        return R.ok(authService.getUserInfo(userId));
    }

    @PostMapping("/password")
    public R<Void> changePassword(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Map<String, String> params) {
        String userId = getCurrentUserId(authorization);
        authService.changePassword(userId, params.get("oldPassword"), params.get("newPassword"));
        return R.ok();
    }

    @PostMapping("/logout")
    public R<Void> logout() {
        return R.ok();
    }

    /**
     * 临时接口：重置指定用户的密码（仅用于测试）
     * @param username 用户名
     * @param newPassword 新密码
     */
    @PostMapping("/admin/reset-password")
    public R<Void> resetPassword(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String newPassword = params.get("newPassword");

        TbSUser user = userMapper.selectOne(
            new LambdaQueryWrapper<TbSUser>()
                .eq(TbSUser::getUsername, username)
        );
        if (user == null) {
            throw new RuntimeException("用户不存在：" + username);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userMapper.updateById(user);
        return R.ok();
    }

    private String getCurrentUserId(String authorization) {
        if (authorization == null || authorization.isEmpty()) {
            throw new RuntimeException("未提供认证信息");
        }
        if (!authorization.startsWith("Bearer ")) {
            throw new RuntimeException("认证格式错误，应为：Bearer {token}");
        }
        String token = authorization.substring(7);
        return jwtUtil.getUserId(token);
    }
}
