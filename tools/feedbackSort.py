#!/usr/bin/python

basedir = '/home/dolivari/Dropbox/Partages/partageLaCabine/VideoTel/feedback_sorted/'

import os
import shutil

for (dirpath, dirnames, filenames) in os.walk('/home/dolivari/Dropbox/Partages/partageLaCabine/VideoTel/feedback'):
    date = dirpath.split('/')[-1]
    for f in filenames:
        hour = f.split('-')[0]
        video = f[7:].split('.')[0]
        file =  dirpath+'/'+f
        dir = basedir+video
        if(not os.path.exists(dir)):
            os.mkdir(dir);
        shutil.copy2(file, dir+'/'+date+'-'+hour+'.png')
            
        