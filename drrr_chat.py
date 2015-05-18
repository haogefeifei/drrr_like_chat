# -*- coding: utf-8 -*-

import cherrypy
import os, os.path


class DrrrChat(object):

    """
        无头骑士异闻录聊天室
    """

    @cherrypy.expose()
    def index(self):
        return file('statics/index.html')


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
                            'server.socket_port': 8080,
                            })
    cherrypy.quickstart(DrrrChat(), "/", conf)
