package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbBMistake;
import com.linewell.edu.service.IMistakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 错题控制器
 */
@RestController
@RequestMapping("/mistake")
@RequiredArgsConstructor
public class MistakeController {

    private final IMistakeService mistakeService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String studentId,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) Integer mastered
    ) {
        Page<TbBMistake> p = mistakeService.findPage(page, pageSize, studentId, subject, mastered);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/queryById")
    public R<TbBMistake> queryById(@RequestParam String id) {
        return R.ok(mistakeService.getById(id));
    }

    @PostMapping("/save")
    public R<Void> save(@RequestBody TbBMistake mistake) {
        mistakeService.save(mistake);
        return R.ok();
    }

    @PutMapping("/update")
    public R<Void> update(@RequestBody TbBMistake mistake) {
        mistakeService.updateById(mistake);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        mistakeService.deleteByIds(ids);
        return R.ok();
    }

    @PutMapping("/markMastered")
    public R<Void> markMastered(@RequestParam String ids) {
        mistakeService.markMastered(ids);
        return R.ok();
    }
}
