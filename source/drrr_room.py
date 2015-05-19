# -*- coding: utf-8 -*-


class Room(object):
    """
    房间对象
    """

    id = None              # id
    name = None            # 房间名称
    limit = None           # 人数上限
    room_type = None       # 房间类型
    now_num = 0         # 当前房间里的人数
    now_list = None        # 当前房间里的人
    icon = None            # 图标
    update = None          # 更新时间
    host_id = None         # 房主id

    def __init__(self, name=None, limit=None, icon=None):
        self.name = name
        self.limit = limit
        self.icon = icon