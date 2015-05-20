#!/usr/bin/env python
# -*- coding: utf-8 -*-

import log
import json
from math import floor

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

__author__ = 'Lucy Linder'


class WsController:
    """
    The controller handling the socket's incoming messages.
    """

    def __init__(self):
        """
        Create a WebSocket controller
        """
        self.client_sockets = set()
        self.room_list = []
        self.user_list = []
        self.hellos = {}

    # ----------------------------------------------------

    def register_client_socket(self, socket):
        """
        Register a new socket to the controller. Useful
        if you want to use broadcasts.
        \note: you can systematically call this function
        from the Server.ws() method of the server.
        @param socket the client socket to add
        """
        log.info(self, '有客户端注册上来了..')
        self.client_sockets.add(socket)
        self.hellos[socket] = 0
        log.info(self, '当前连接的客户端数量:' + str(len(self.client_sockets)))

    def unregister_client_socket(self, socket):
        """
        Unregister the given socket.
        \note This action could be done in the close_callback
        of the socket
        @param socket the client socket to remove
        """
        if socket in self.client_sockets:
            log.info(self, '客户端退出..')
            self.client_sockets.remove(socket)
        log.info(self, '当前连接的客户端数量:' + str(len(self.client_sockets)))

    # ----------------------------------------------------

    def broadcast(self, msg_type, msg):
        """
        Send a message to all the registered clients. 广播
        @param msg_type the message type
        @param msg the data
        """
        log.info(self, '要广播的客户端数量:' + str(len(self.client_sockets)))
        for client in self.client_sockets:
            client.send_msg(msg_type, msg)

    # ----------------------------------------------------

    def hello(self, data, socket):
        """
        respond to hello message
        @param data unused
        @param socket the client socket
        """
        nbr_of_hellos = self.hellos[socket]
        nbr_of_hellos += 1

        if nbr_of_hellos == 1:
            socket.send_msg('hello_world', 'Hey, you !')

        elif nbr_of_hellos == 2:
            socket.send_msg('hello_world', 'Hey, again !')

        else:
            socket.send_msg('hello_world',
                            'You are kind of repeating yourself... It\'s the %dth time !' % nbr_of_hellos)

        self.hellos[socket] = nbr_of_hellos

    def compute_gdc(self, data, socket):
        """
        compute the greatest common denominator
        of two numbers and send back the answer
        @param data a json-encoded array of two integers
        @param socket the client socket
        """
        nbrs = json.loads(data)

        while True:
            nbrs = sorted(nbrs)
            r = nbrs[1] - nbrs[0] * floor(nbrs[1] / nbrs[0])
            if r < 1: break
            nbrs[1] = r

        socket.send_msg('gdc', sorted(nbrs)[0])

    # ----------------------------------------------------
    def open_room(self, data, socket):

        """
        打开房间
        :param data:
        :param socket:
        :return:
        """
        nbrs = json.loads(data)
        log.info(self, '有人进入了房间' + str(nbrs['room']))

        for user in self.user_list:
            if user.token == str(nbrs['user_token']):
                socket.user = user

        self.broadcast('open_room_ok', data)  # 向所有人广播

    def send_message(self, data, socket):
        message = json.loads(data)
        self.broadcast('send_message_success', data)
