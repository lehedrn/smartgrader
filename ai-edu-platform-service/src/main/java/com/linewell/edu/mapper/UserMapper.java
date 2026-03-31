package com.linewell.edu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linewell.edu.entity.TbSUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper extends BaseMapper<TbSUser> {

}
