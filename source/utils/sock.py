#!/usr/bin/env python
# -*- coding: utf-8 -*-
__author__ = 'Lucy Linder'

import json
import log

from ws4py.websocket import WebSocket


class GenericWebSocket(WebSocket):
    """
    A WebSocket with a controller. To use it, call #set_controller after the
    socket creation to associate a controller objet. An incoming message should
    have the form:
        {type : <msg_type>, data: <whatever> }
    To ease the process, simply call send_msg(msg_type, data)

    Upon reception, the socket will call the <msg_type> method of the controller
    (if defined), passing it the following arguments:
        self, data, socket

    You can register a callback for the closed event using the set_close_callback
    method, passing it a function or lambda:
        socket.set_close_callback(lambda: print('closed') )
    """

    controller = None
    user = None

    def __init__(self, *args, **kw):
        """
        Constructor. This will be called automatically
        by the server upon connection
        """
        WebSocket.__init__(self, *args, **kw)
        self.close_callback = None

    # ----------------------------------------------------

    def opened(self):
        """
        Called after the handshake, if successful.
        """
        log.info(self, 'socket连接打开')


    def closed(self, code, reason=None):
        """
        Called after the socket closed.
        This will execute the close_callback, if one was registered.
        """
        log.info(self, 'socket连接关闭')
        if self.close_callback is not None:
            self.close_callback()

    # ----------------------------------------------------

    def send_msg(self, message_type, message=""):
        """
        Send a message to the client. Format : a dictionary with 'type' and 'data' keys.
        The dictionary will be converted to json for the transport.
        """
        self.send(json.dumps({'type': message_type, 'data': message}))
        log.info(self, "发送 %s: %s" % (message_type, message ))


    def received_message(self, payload):
        """
        Dispatcher : call the controller function matching on the 'type'
        field of the incoming message, if any.
        The arguments of the controller's function should match:
        \code
        def a_method(self, data, socket):
        \endcode

        \note the data are passed as they are received, it is up to you to
        determine if it is json-encoded or if it needs a special treatment.

        \note the controller will get a reference to this socket object in
        case it needs to send back an answer to the client.
        """
        payload = json.loads(str(payload))
        log.info(self, "收到: %s" % payload)

        # do nothing if no controller was set
        if self.controller is None: return

        # determine which controller's function to call
        try:
            callback = getattr(self.controller, payload.get("type"))
            if callback is not None and hasattr(callback, '__call__'):
                callback(payload.get('data'), self)

        except AttributeError:
            log.error(self, 'callback undefined')

    # ----------------------------------------------------

    def set_close_callback(self, fun):
        """
        Register a close handler.
        """
        self.close_callback = fun

    def set_controller(self, controller):
        """
        Set the controller used by this socket.
        """
        self.controller = controller
        self.controller.register_client_socket(self)
        log.info(self, 'client socket registered')