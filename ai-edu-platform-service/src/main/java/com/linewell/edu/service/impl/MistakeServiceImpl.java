package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.linewell.edu.entity.TbBMistake;
import com.linewell.edu.entity.TbBQuestion;
import com.linewell.edu.mapper.MistakeMapper;
import com.linewell.edu.service.IMistakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * 错题服务实现
 */
@Service
@RequiredArgsConstructor
public class MistakeServiceImpl extends ServiceImpl<MistakeMapper, TbBMistake> implements IMistakeService {

    @Override
    public Page<TbBMistake> findPage(Integer page, Integer pageSize, String studentId, String subject, Integer mastered) {
        Page<TbBMistake> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbBMistake> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(studentId)) {
            wrapper.eq(TbBMistake::getStudentId, studentId);
        }
        if (mastered != null) {
            wrapper.eq(TbBMistake::getMastered, mastered);
        }

        wrapper.orderByDesc(TbBMistake::getLastErrorTime);
        return this.page(p, wrapper);
    }

    @Override
    public void deleteByIds(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        this.removeByIds(idList);
    }

    @Override
    public void markMastered(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        for (String id : idList) {
            TbBMistake mistake = this.getById(id);
            if (mistake != null) {
                mistake.setMastered(1);
                this.updateById(mistake);
            }
        }
    }
}
