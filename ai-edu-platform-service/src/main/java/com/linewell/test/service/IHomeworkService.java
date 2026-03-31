package com.linewell.test.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.linewell.test.entity.TbBHomework;

public interface IHomeworkService {

    Page<TbBHomework> findPage(Integer page, Integer pageSize, String subject, String type, String className);

    TbBHomework getDetail(String id);

    void create(TbBHomework homework);

    void update(TbBHomework homework);

    void deleteByIds(String ids);
}
