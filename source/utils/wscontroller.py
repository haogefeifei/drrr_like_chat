#!/usr/bin/env python
# -*- coding: utf-8 -*-

import log
import json
from math import floor

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
        log.info(self, 'client registered')
        self.client_sockets.add(socket)
        self.hellos[socket] = 0

    def unregister_client_socket(self, socket):
        """
        Unregister the given socket.
        \note This action could be done in the close_callback
        of the socket
        @param socket the client socket to remove
        """
        if socket in self.client_sockets:
            log.info(self, 'client unregistered')
            self.client_sockets.remove(socket)

    # ----------------------------------------------------

    def broadcast(self, msg_type, msg):
        """
        Send a message to all the registered clients.
        @param msg_type the message type
        @param msg the data
        """
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
