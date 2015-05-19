#!/usr/bin/env python
# -*- coding: utf-8 -*-
__author__ = 'lucy'


def error(obj, msg):
    print('[%s][error] %s' % (obj.__class__.__name__, msg))

def info(obj, msg):
    print('[%s][info] %s' % (obj.__class__.__name__, msg))

def warn(obj, msg):
    print('[%s][warn] %s' % (obj.__class__.__name__, msg))