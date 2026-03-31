package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbBKnowledge;
import com.linewell.edu.mapper.KnowledgeMapper;
import com.linewell.edu.service.IKnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 知识点服务实现
 */
@Service
@RequiredArgsConstructor
public class KnowledgeServiceImpl extends ServiceImpl<KnowledgeMapper, TbBKnowledge> implements IKnowledgeService {

    @Override
    public Page<TbBKnowledge> findPage(Integer page, Integer pageSize, String subject, String grade) {
        Page<TbBKnowledge> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbBKnowledge> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(subject)) {
            wrapper.eq(TbBKnowledge::getSubject, subject);
        }
        if (StringUtils.hasText(grade)) {
            wrapper.eq(TbBKnowledge::getGrade, grade);
        }

        wrapper.orderByDesc(TbBKnowledge::getCjsj);
        return this.page(p, wrapper);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }
}
