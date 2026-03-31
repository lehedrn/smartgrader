package com.linewell.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linewell.edu.entity.TbBKnowledge;
import org.apache.ibatis.annotations.Mapper;

/**
 * 知识点 Mapper 接口
 */
@Mapper
public interface KnowledgeMapper extends BaseMapper<TbBKnowledge> {

}
