# -*- coding: utf-8 -*-

import cherrypy
import os.path
from drrr_user import User
from drrr_room import Room
from settings import *
from mako.lookup import TemplateLookup
from utils import token_util
from utils import img_generator
from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from utils.sock import GenericWebSocket
from utils.wscontroller import WsController


lookup = TemplateLookup(directories=['statics'],
                        input_encoding='utf-8',
                        output_encoding='utf-8',
                        default_filters=['decode.utf_8'])


class DrrrChat(object):
    """
        无头骑士异闻录聊天室
    """

    controller = WsController()

    @cherrypy.expose()
    def index(self):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            raise cherrypy.HTTPRedirect('/lounge')
        return lookup.get_template("login.html").render(token=token_util.random_token(),
                                                        uip=token_util.get_uip(cherrypy.request.remote.ip),
                                                        head_imgs=img_generator.random_head_img())

    @cherrypy.expose()
    def login(self, name, token, uip, language, icon, login):
        user = User(name, token, uip, language, icon, login)
        self.controller.user_list.append(user)
        cherrypy.session['user'] = user
        raise cherrypy.HTTPRedirect('/lounge')

    @cherrypy.expose()
    def lounge(self):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            user = cherrypy.session['user']

            for room in self.controller.room_list:
                cherrypy.log("房间: %s, %s" % (room.name, room.id))

            return lookup.get_template("lounge.html")\
                .render(user=user, room_list=self.controller.room_list,
                        user_len=len(self.controller.user_list))
        else:
            raise cherrypy.HTTPRedirect('/')

    @cherrypy.expose()
    def logout(self):
        cherrypy.session.pop('user', None)
        raise cherrypy.HTTPRedirect('/')

    @cherrypy.expose()
    def create_room(self):
        return lookup.get_template("create_room.html").render(room_limit=ROOM_LIMIT)

    @cherrypy.expose()
    def create_room_ok(self, name, limit):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            user = cherrypy.session['user']
            new_room = Room(name, limit, user)
            new_room.id = user.token
            new_room.now_num += 1
            new_room.now_list.append(user)
            cherrypy.session['room'] = new_room
            self.controller.room_list.append(new_room)
            raise cherrypy.HTTPRedirect('/room')
        else:
            raise cherrypy.HTTPRedirect('/')

    @cherrypy.expose()
    def in_room(self, rid):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            user = cherrypy.session['user']
            for room in self.controller.room_list:
                if room.id == rid:
                    if user not in room.now_list:
                        room.now_num += 1
                        room.now_list.append(user)
                    cherrypy.session['room'] = room

            raise cherrypy.HTTPRedirect('/room')
        else:
            raise cherrypy.HTTPRedirect('/')

    @cherrypy.expose()
    def room(self):
        user = cherrypy.session['user']
        user.in_room_num += 1
        cherrypy.session['user'] = user
        room = cherrypy.session['room']
        return lookup.get_template("room.html").render(user=user, room=room)

    @cherrypy.expose
    def ws(self):
        # you can access the class instance through the following:
        handler = cherrypy.request.ws_handler
        handler.set_controller(self.controller)
        handler.set_close_callback(lambda: self.controller.unregister_client_socket(handler))


if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/ws': {
            'tools.websocket.on': True,
            'tools.websocket.handler_cls': GenericWebSocket
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './statics'
        },
        '/css': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './statics/css'
        },
        '/js': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './statics/js'
        },
        '/img': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './statics/img'
        }
    }
    cherrypy.config.update({'server.socket_host': '0.0.0.0',
                            'server.socket_port': 10033,
                            })

    WebSocketPlugin(cherrypy.engine).subscribe()
    cherrypy.tools.websocket = WebSocketTool()

    cherrypy.quickstart(DrrrChat(), "/", conf)
