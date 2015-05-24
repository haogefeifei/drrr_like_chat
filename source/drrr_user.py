# -*- coding: utf-8 -*-

import datetime


class User(object):
    """
    用户对象
    """

    def __init__(self, name=None, token=None, uip=None, language=None, icon=None, login=None):
        self.id = 0
        self.name = name                        # 用户名称
        self.token = token                      # 令牌
        self.uip = uip                          # uip
        self.language = language                # 语言
        self.icon = icon                        # 头像
        self.login = login                      # 登录
        self.update = self.get_now_time()       # 最后活动时间
        self.user_type = 'populace'             # 用户类型
        self.state = 'draft'  # active          # 状态
        self.room = None
        self.in_room_num = 0

    @staticmethod
    def get_now_time():
        """获取当前时间"""
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    def online(self):
        """
        上线
        :return:
        """
        pass