package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.edu.entity.TbBHomework;

/**
 * 作业服务接口
 */
public interface IHomeworkService {

    Page<TbBHomework> findPage(Integer page, Integer pageSize, String subject, String type, String className);

    TbBHomework getDetail(String id);

    void create(TbBHomework homework);

    void update(TbBHomework homework);

    void deleteByIds(String ids);
}
