package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbBHomework;
import com.linewell.edu.service.IHomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 作业控制器
 */
@RestController
@RequestMapping("/homework")
@RequiredArgsConstructor
public class HomeworkController {

    private final IHomeworkService homeworkService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(value = "page", defaultValue = "1") Integer pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
        @RequestParam(value = "subject", required = false) String subject,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "className", required = false) String className
    ) {
        Page<TbBHomework> p = homeworkService.findPage(pageNum, pageSize, subject, type, className);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/detail/{id}")
    public R<TbBHomework> getDetail(@PathVariable String id) {
        return R.ok(homeworkService.getDetail(id));
    }

    @PostMapping("/create")
    public R<Void> create(@RequestBody TbBHomework homework) {
        homeworkService.create(homework);
        return R.ok();
    }

    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable String id, @RequestBody TbBHomework homework) {
        homework.setId(id);
        homeworkService.update(homework);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        homeworkService.deleteByIds(ids);
        return R.ok();
    }
}
