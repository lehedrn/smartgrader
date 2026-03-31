package com.linewell.edu.controller;

import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbSUser;
import com.linewell.edu.service.IAuthService;
import com.linewell.edu.util.JwtUtil;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String token = authService.login(params.get("username"), params.get("password"));
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        return R.ok(result);
    }

    @GetMapping("/userinfo")
    public R<TbSUser> getUserInfo(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String userId = null;

        // 尝试从 Authorization header 获取 token
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            userId = jwtUtil.getUserId(token);
        }

        // 如果没有 token，使用 admin 用户 ID（临时方案）
        if (userId == null || userId.isEmpty()) {
            userId = "10000000000000000000000000000001";
        }

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
