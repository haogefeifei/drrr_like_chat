# -*- coding: utf-8 -*-

import string, random
import hashlib


def random_token():
    """
    随机生成一个令牌
    """

    look_set = string.ascii_letters + string.digits
    md5_len = 32
    tmp_md5_ls = ""
    for i in range(md5_len):
            tmp_md5_ls = tmp_md5_ls + random.choice(look_set)
    return tmp_md5_ls


def get_uip(clien_ip):
    """
    将ip转成MD5
    :param clien_ip: 客户端ip
    :return: MD5
    """
    uip = hashlib.md5()
    uip.update(clien_ip)
    return uip.hexdigest()