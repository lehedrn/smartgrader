package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbSRole;
import com.linewell.edu.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 角色控制器
 */
@RestController
@RequestMapping("/system/role")
@RequiredArgsConstructor
public class RoleController {

    private final IRoleService roleService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(value = "page", defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
        @RequestParam(value = "roleCode", required = false) String roleCode,
        @RequestParam(value = "roleName", required = false) String roleName
    ) {
        Page<TbSRole> p = roleService.findPage(pageNum, pageSize, roleCode, roleName);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/queryById")
    public R<TbSRole> queryById(@RequestParam String id) {
        return R.ok(roleService.getById(id));
    }

    @GetMapping("/listAll")
    public R<List<TbSRole>> listAll() {
        return R.ok(roleService.list());
    }

    @PostMapping("/save")
    public R<Void> save(@RequestBody TbSRole role) {
        roleService.save(role);
        return R.ok();
    }

    @PutMapping("/update")
    public R<Void> update(@RequestBody TbSRole role) {
        roleService.updateById(role);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        roleService.deleteByIds(ids);
        return R.ok();
    }
}
