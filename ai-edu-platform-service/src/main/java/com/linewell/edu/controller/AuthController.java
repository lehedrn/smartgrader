package com.linewell.edu.controller;

import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbSUser;
import com.linewell.edu.service.IAuthService;
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

    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String token = authService.login(params.get("username"), params.get("password"));
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        return R.ok(result);
    }

    @GetMapping("/userinfo")
    public R<TbSUser> getUserInfo() {
        String userId = getCurrentUserId();
        return R.ok(authService.getUserInfo(userId));
    }

    @PostMapping("/password")
    public R<Void> changePassword(@RequestBody Map<String, String> params) {
        String userId = getCurrentUserId();
        authService.changePassword(userId, params.get("oldPassword"), params.get("newPassword"));
        return R.ok();
    }

    @PostMapping("/logout")
    public R<Void> logout() {
        return R.ok();
    }

    private String getCurrentUserId() {
        // TODO: 从 JWT token 中解析用户 ID
        return "10000000000000000000000000000001";
    }
}
