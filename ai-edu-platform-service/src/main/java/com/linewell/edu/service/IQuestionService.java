package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.linewell.edu.entity.TbBQuestion;

/**
 * 题库服务接口
 */
public interface IQuestionService extends IService<TbBQuestion> {

    /**
     * 分页查询题库
     */
    Page<TbBQuestion> findPage(Integer page, Integer pageSize, String subject, String type, String difficulty, String knowledge);

    /**
     * 批量删除题库
     */
    void deleteByIds(String ids);
}
