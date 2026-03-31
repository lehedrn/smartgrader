package com.linewell.edu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.entity.TbBHomework;
import com.linewell.edu.mapper.TbBHomeworkMapper;
import com.linewell.edu.service.IHomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 作业服务实现类
 */
@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements IHomeworkService {

    private final TbBHomeworkMapper homeworkMapper;

    @Override
    public Page<TbBHomework> findPage(Integer page, Integer pageSize, String subject, String type, String className) {
        Page<TbBHomework> p = new Page<>(page, pageSize);
        LambdaQueryWrapper<TbBHomework> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(subject)) {
            wrapper.eq(TbBHomework::getSubject, subject);
        }
        if (StringUtils.hasText(type)) {
            wrapper.eq(TbBHomework::getType, type);
        }

        return homeworkMapper.selectPage(p, wrapper);
    }

    @Override
    public TbBHomework getDetail(String id) {
        return homeworkMapper.selectById(id);
    }

    @Override
    public void create(TbBHomework homework) {
        homeworkMapper.insert(homework);
    }

    @Override
    public void update(TbBHomework homework) {
        homeworkMapper.updateById(homework);
    }

    @Override
    public void deleteByIds(String ids) {
        String[] idArray = ids.split(",");
        for (String id : idArray) {
            homeworkMapper.deleteById(id.trim());
        }
    }
}
