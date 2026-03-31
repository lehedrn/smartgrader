package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbBKnowledge;
import com.linewell.edu.service.IKnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 知识点控制器
 */
@RestController
@RequestMapping("/resource/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final IKnowledgeService knowledgeService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String grade
    ) {
        Page<TbBKnowledge> p = knowledgeService.findPage(page, pageSize, subject, grade);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/queryById")
    public R<TbBKnowledge> queryById(@RequestParam String id) {
        return R.ok(knowledgeService.getById(id));
    }

    @GetMapping("/listAll")
    public R<List<TbBKnowledge>> listAll() {
        return R.ok(knowledgeService.list());
    }

    @PostMapping("/save")
    public R<Void> save(@RequestBody TbBKnowledge knowledge) {
        knowledgeService.save(knowledge);
        return R.ok();
    }

    @PutMapping("/update")
    public R<Void> update(@RequestBody TbBKnowledge knowledge) {
        knowledgeService.updateById(knowledge);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        knowledgeService.deleteByIds(ids);
        return R.ok();
    }
}
