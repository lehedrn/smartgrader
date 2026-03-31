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
        @RequestParam(value = "page", defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
        @RequestParam(value = "studentId", required = false) String studentId,
        @RequestParam(value = "subject", required = false) String subject,
        @RequestParam(value = "mastered", required = false) Integer mastered
    ) {
        Page<TbBMistake> p = mistakeService.findPage(pageNum, pageSize, studentId, subject, mastered);
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
