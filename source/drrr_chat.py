# -*- coding: utf-8 -*-

import cherrypy
import os.path
from drrr_user import User
from drrr_room import Room
from settings import *
from mako.lookup import TemplateLookup
from utils import token_util

lookup = TemplateLookup(directories=['statics'],
                        input_encoding='utf-8',
                        output_encoding='utf-8',
                        default_filters=['decode.utf_8'])


class DrrrChat(object):
    """
        无头骑士异闻录聊天室
    """

    @cherrypy.expose()
    def index(self):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            raise cherrypy.HTTPRedirect('/lounge')
        return lookup.get_template("login.html").render(token=token_util.random_token(),
                            uip=token_util.get_uip(cherrypy.request.remote.ip))

    @cherrypy.expose()
    def login(self, name, token, uip, language, icon, login):
        user = User(name, token, uip, language, icon, login)
        cherrypy.session['user'] = user
        raise cherrypy.HTTPRedirect('/lounge')

    @cherrypy.expose()
    def lounge(self):
        if cherrypy.session.has_key('user') and cherrypy.session['user'] is not None:
            user = cherrypy.session['user']
            return lookup.get_template("lounge.html").render(user=user)
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
            room = Room(name, limit, user.icon)
            cherrypy.session['room'] = room
            raise cherrypy.HTTPRedirect('/room')
        else:
            raise cherrypy.HTTPRedirect('/')

    @cherrypy.expose()
    def room(self):
        user = cherrypy.session['user']
        room = cherrypy.session['room']
        return lookup.get_template("room.html").render(user=user, room=room)



if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
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
    cherrypy.quickstart(DrrrChat(), "/", conf)
