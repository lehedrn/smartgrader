package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbBQuestion;
import com.linewell.edu.mapper.QuestionMapper;
import com.linewell.edu.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 题库服务实现
 */
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, TbBQuestion> implements IQuestionService {

    @Override
    public Page<TbBQuestion> findPage(Integer page, Integer pageSize, String subject, String type, String difficulty, String knowledge) {
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
        if (StringUtils.hasText(knowledge)) {
            wrapper.eq(TbBQuestion::getKnowledge, knowledge);
        }

        wrapper.orderByDesc(TbBQuestion::getCjsj);
        return this.page(p, wrapper);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }
}
