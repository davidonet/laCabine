#!/bin/sh

cd /home/dolivari/Dropbox/Partages/partageLaCabine/mainum
for f in *.mov; do
if [ ! -f  `basename $f .mov`.jpg ]; then
	ffmpeg -y -itsoffset -30  -i $f -vcodec mjpeg -vframes 1 -an -f rawvideo temp.jpg;
	convert temp.jpg `basename $f .mov`.jpg
fi
done
rm -f temp.jpg

