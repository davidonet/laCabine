#!/bin/sh

cd /home/dolivari/Dropbox/Partages/partageLaCabine/VideoTel/
for f in *.mov; do
if [ ! -f  `basename $f .mov`.jpg ]; then
	ffmpeg -y -itsoffset -30  -i $f -vcodec mjpeg -vframes 1 -an -f rawvideo -s 1208x680 temp.jpg;
	convert temp.jpg -crop 680x680+264 `basename $f .mov`.jpg
fi
done
rm -f temp.jpg

