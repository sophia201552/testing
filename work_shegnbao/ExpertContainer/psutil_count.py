__author__ = 'Administrator'

import psutil

pids = psutil.pids()
l = []
for pid in pids:
    p = psutil.Process(pid)
    if 'python' in p.name().lower():
        l.append(p.name())
print(l)