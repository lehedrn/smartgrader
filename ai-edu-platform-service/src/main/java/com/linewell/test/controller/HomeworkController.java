package com.linewell.test.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.core.domain.R;
import com.linewell.test.entity.TbBHomework;
import com.linewell.test.service.IHomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/homework")
@RequiredArgsConstructor
public class HomeworkController {

    private final IHomeworkService homeworkService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String className
    ) {
        Page<TbBHomework> p = homeworkService.findPage(page, pageSize, subject, type, className);
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
