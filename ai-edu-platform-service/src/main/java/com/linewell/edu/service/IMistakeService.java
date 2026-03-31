package com.linewell.edu.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.linewell.edu.entity.TbBMistake;

/**
 * 错题服务接口
 */
public interface IMistakeService extends IService<TbBMistake> {

    /**
     * 分页查询错题
     */
    Page<TbBMistake> findPage(Integer page, Integer pageSize, String studentId, String subject, Integer mastered);

    /**
     * 批量删除错题
     */
    void deleteByIds(String ids);

    /**
     * 标记已掌握
     */
    void markMastered(String ids);
}
