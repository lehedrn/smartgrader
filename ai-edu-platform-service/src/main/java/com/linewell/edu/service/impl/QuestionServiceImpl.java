package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbBQuestion;
import com.linewell.edu.mapper.QuestionMapper;
import com.linewell.edu.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;

/**
 * 题库服务实现
 */
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, TbBQuestion> implements IQuestionService {

    @Override
    public Page<TbBQuestion> findPage(Integer page, Integer pageSize, String subject, String type, String difficulty, String knowledgeIds) {
        Page<TbBQuestion> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbBQuestion> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(subject)) {
            wrapper.eq(TbBQuestion::getSubject, subject);
        }
        if (StringUtils.hasText(type)) {
            wrapper.eq(TbBQuestion::getType, type);
        }
        if (StringUtils.hasText(difficulty)) {
            wrapper.eq(TbBQuestion::getDifficulty, difficulty);
        }
        if (StringUtils.hasText(knowledgeIds)) {
            wrapper.like(TbBQuestion::getKnowledgeIds, knowledgeIds);
        }

        wrapper.orderByDesc(TbBQuestion::getCjsj);
        return this.page(p, wrapper);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }

    @Override
    public byte[] exportToExcel(String subject, String type) {
        // 构建查询条件
        LambdaQueryWrapper<TbBQuestion> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(subject)) {
            wrapper.eq(TbBQuestion::getSubject, subject);
        }
        if (StringUtils.hasText(type)) {
            wrapper.eq(TbBQuestion::getType, type);
        }
        wrapper.orderByDesc(TbBQuestion::getCjsj);

        // 查询数据
        List<TbBQuestion> questionList = this.list(wrapper);

        // 创建 Excel 工作簿
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("题库");

            // 创建标题行样式
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // 创建普通单元格样式
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            cellStyle.setWrapText(true);

            // 创建标题行
            String[] headers = {"ID", "题目", "科目", "类型", "难度", "知识点", "内容", "选项", "答案", "解析", "分数", "年级", "来源"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // 填充数据
            int rowNum = 1;
            for (TbBQuestion question : questionList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(question.getId());
                row.createCell(1).setCellValue(question.getTitle() != null ? question.getTitle() : "");
                row.createCell(2).setCellValue(question.getSubject() != null ? question.getSubject() : "");
                row.createCell(3).setCellValue(question.getType() != null ? question.getType() : "");
                row.createCell(4).setCellValue(question.getDifficulty() != null ? question.getDifficulty() : "");
                row.createCell(5).setCellValue(question.getKnowledgeIds() != null ? question.getKnowledgeIds() : "");
                row.createCell(6).setCellValue(question.getContent() != null ? question.getContent() : "");
                row.createCell(7).setCellValue(question.getOptions() != null ? question.getOptions() : "");
                row.createCell(8).setCellValue(question.getAnswer() != null ? question.getAnswer() : "");
                row.createCell(9).setCellValue(question.getAnalysis() != null ? question.getAnalysis() : "");
                row.createCell(10).setCellValue(question.getScore() != null ? question.getScore().doubleValue() : 0);
                row.createCell(11).setCellValue(question.getGrade() != null ? question.getGrade() : "");
                row.createCell(12).setCellValue(question.getSource() != null ? question.getSource() : "");
            }

            // 设置列宽
            sheet.setColumnWidth(0, 4000);
            sheet.setColumnWidth(1, 6000);
            sheet.setColumnWidth(2, 3000);
            sheet.setColumnWidth(3, 2000);
            sheet.setColumnWidth(4, 2000);
            sheet.setColumnWidth(5, 3000);
            sheet.setColumnWidth(6, 8000);
            sheet.setColumnWidth(7, 8000);
            sheet.setColumnWidth(8, 6000);
            sheet.setColumnWidth(9, 8000);
            sheet.setColumnWidth(10, 1500);
            sheet.setColumnWidth(11, 2000);
            sheet.setColumnWidth(12, 3000);

            // 合并标题行
            if (headers.length > 1) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));
            }

            // 应用单元格样式
            for (int i = 1; i < rowNum; i++) {
                Row row = sheet.getRow(i);
                for (int j = 0; j < row.getPhysicalNumberOfCells(); j++) {
                    row.getCell(j).setCellStyle(cellStyle);
                }
            }

            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("导出 Excel 失败：" + e.getMessage(), e);
        }
    }
}
