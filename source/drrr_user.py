# -*- coding: utf-8 -*-

import datetime


class User(object):
    """
    用户对象
    """

    id = 0
    name = None         # 用户名称
    token = None        # 令牌
    uip = None          # uip
    language = None     # 语言
    icon = None         # 头像
    login = None        # 登录
    user_type = None    # 用户类型
    update = None       # 最后活动时间
    state = None        # 状态
    room = None

    def __init__(self, name=None, token=None, uip=None, language=None, icon=None, login=None):
        self.name = name
        self.token = token
        self.uip = uip
        self.language = language
        self.icon = icon
        self.login = login
        self.update = self.get_now_time()
        self.user_type = 'populace'
        self.state = 'draft'  # active

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