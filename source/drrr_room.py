# -*- coding: utf-8 -*-

from settings import *

class Room(object):
    """
    房间对象
    """

    def __init__(self, name=None, limit_num=None, host_user=None):
        self.id = None               # id
        self.name = name             # 房间名称
        self.limit_num = limit_num   # 人数上限
        self.room_type = None        # 房间类型
        self.now_num = 0             # 当前房间里的人数
        self.host_user = host_user   # 房主
        self.now_list = []           # 当前房间里的人
        self.message_list = []       # 消息列表

    def add_message_notes(self, message):
        """
        添加消息缓存
        :param message:
        :return:
        """
        if len(self.message_list) > MESSAGE_LIMIT:
            del self.message_list[0]
        print self.message_list
        self.message_list.append(message)

