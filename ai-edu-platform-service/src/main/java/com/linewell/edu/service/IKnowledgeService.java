package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.linewell.edu.entity.TbBKnowledge;

/**
 * 知识点服务接口
 */
public interface IKnowledgeService extends IService<TbBKnowledge> {

    /**
     * 分页查询知识点
     */
    Page<TbBKnowledge> findPage(Integer page, Integer pageSize, String subject, String grade);

    /**
     * 批量删除知识点
     */
    void deleteByIds(String ids);
}
