package com.linewell.edu.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.common.R;
import com.linewell.edu.entity.TbBQuestion;
import com.linewell.edu.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 题库控制器
 */
@RestController
@RequestMapping("/resource/question")
@RequiredArgsConstructor
public class QuestionController {

    private final IQuestionService questionService;

    @GetMapping("/list")
    public R<Map<String, Object>> getList(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false) String knowledge
    ) {
        Page<TbBQuestion> p = questionService.findPage(page, pageSize, subject, type, difficulty, knowledge);
        Map<String, Object> result = new HashMap<>();
        result.put("list", p.getRecords());
        result.put("total", p.getTotal());
        return R.ok(result);
    }

    @GetMapping("/queryById")
    public R<TbBQuestion> queryById(@RequestParam String id) {
        return R.ok(questionService.getById(id));
    }

    @PostMapping("/save")
    public R<Void> save(@RequestBody TbBQuestion question) {
        questionService.save(question);
        return R.ok();
    }

    @PutMapping("/update")
    public R<Void> update(@RequestBody TbBQuestion question) {
        questionService.updateById(question);
        return R.ok();
    }

    @DeleteMapping("/delete")
    public R<Void> delete(@RequestParam String ids) {
        questionService.deleteByIds(ids);
        return R.ok();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String type
    ) {
        byte[] excelData = questionService.exportToExcel(subject, type);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment",
            URLEncoder.encode("题库导出.xlsx", StandardCharsets.UTF_8.name()).replace("+", "%20"));

        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }
}
