package com.linewell.test.controller;

import com.linewell.core.domain.R;
import com.linewell.test.entity.TbSUser;
import com.linewell.test.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
        // 从 SecurityContext 获取当前用户 ID
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
