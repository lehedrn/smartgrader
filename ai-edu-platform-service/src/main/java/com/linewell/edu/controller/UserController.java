package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbSUser;
import com.linewell.edu.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/system/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(value = "page", defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
        @RequestParam(value = "username", required = false) String username,
        @RequestParam(value = "realName", required = false) String realName,
        @RequestParam(value = "userType", required = false) String userType,
        @RequestParam(value = "status", required = false) String status
    ) {
        Page<TbSUser> p = userService.findPage(pageNum, pageSize, username, realName, userType, status);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/queryById")
    public R<TbSUser> queryById(@RequestParam String id) {
        return R.ok(userService.getById(id));
    }

    @PostMapping("/save")
    public R<Void> save(@RequestBody TbSUser user) {
        userService.saveUser(user);
        return R.ok();
    }

    @PutMapping("/update")
    public R<Void> update(@RequestBody TbSUser user) {
        userService.updateById(user);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        userService.deleteByIds(ids);
        return R.ok();
    }

    @PostMapping("/resetPassword")
    public R<Void> resetPassword(@RequestParam String id) {
        userService.resetPassword(id);
        return R.ok();
    }
}
