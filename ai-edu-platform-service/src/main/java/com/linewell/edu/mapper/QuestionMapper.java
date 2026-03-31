package com.linewell.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linewell.edu.entity.TbBQuestion;
import org.apache.ibatis.annotations.Mapper;

/**
 * 题库 Mapper 接口
 */
@Mapper
public interface QuestionMapper extends BaseMapper<TbBQuestion> {

}
