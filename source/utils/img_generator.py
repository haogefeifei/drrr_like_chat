# -*- coding: utf-8 -*-

"""
图像生成
"""

from random import sample


def random_head_img():
    """
    随机头像顺序
    :return:
    """
    # 头像图片集合
    head_img_list = ['setton', 'zaika', 'bakyura-2x', 'kakka', 'setton-2x', 'tanaka', 'bakyura', 'zawa', 'gg', 'san-2x',
                     'kanra-2x', 'kanra', 'kyo-2x', 'zaika-2x', 'tanaka-2x']

    return sample(head_img_list, len(head_img_list))
