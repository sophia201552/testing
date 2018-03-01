# -*- coding:utf-8 -*-
__author__ = 'Eric'
import logging,sys,time
import os,os.path
import datetime

#默认路径,按天分割文件夹，每个文件夹下会按小时建立日志文件
_filefmt=os.path.join(sys.path[0]+"/logs","%Y-%m-%d","%H.log")
class MyLoggerHandler(logging.Handler):
    def __init__(self,filefmt=None):
        self.filefmt=filefmt
        if filefmt is None:
            self.filefmt=_filefmt
        logging.Handler.__init__(self)
    def emit(self,record):
        msg=self.format(record)
        _filePath=datetime.datetime.now().strftime(self.filefmt)
        _dir=os.path.dirname(_filePath)
        try:
            if os.path.exists(_dir) is False:
                os.makedirs(_dir)
        except Exception:
            print("can not make dirs")
            print("filepath is "+_filePath)
            pass
        try:
            _fobj=open(_filePath,'a') 
            _fobj.write(msg)
            _fobj.write("\n")
            _fobj.flush()
            _fobj.close()
        except Exception:
            print("can not write to file")
            print("filepath is "+_filePath)
            pass

class LevelFilter(logging.Filter):   
    def __init__(self, level, *args, **kwargs):  
        # super(LevelFilter, self).__init__(*args, **kwargs)  
        self.level = level  
  
    def filter(self, record):  
        return record.levelno == self.level    
    
class InitMyLogger(): 
    #参数name即使文件前缀，又是任务名称，logging_dir为设置路径，不填的话会使用默认路径
    #level是int类型，对应各个级别，INFO,ERROR,DEBUG
    def init_logger(self,logging_dir,level,name="Process"): 
        #根据级别定义文件名
        lastname = ".log";
        if level == logging.INFO:
            lastname = "_Info.log"
        elif level == logging.ERROR:
            lastname = "_Errors.log"
        elif level == logging.DEBUG:
            lastname = "_Debug.log"
            
        logging_file=os.path.join(logging_dir,"%Y-%m-%d",name+lastname)
        handler = MyLoggerHandler(logging_file)  
        
        if level == logging.INFO:
            handler.setFormatter(logging.Formatter(
                "%(asctime)s[%(filename)s]%(levelname)-5s %(name)-10s %(message)s",  # 设置日志格式，固定宽度便于解析  
                datefmt="%Y-%m-%d %H:%M:%S"  # 设置asctime时间格式  
            ))
        else: #ERROR级别格式
            handler.setFormatter(logging.Formatter(
                "%(asctime)s[%(process)d][%(filename)s:%(lineno)d] %(levelname)-5s %(name)-10s %(message)s",  # 设置日志格式，固定宽度便于解析  
                datefmt="%Y-%m-%d %H:%M:%S"  # 设置asctime时间格式  
            )) 
        handler.suffix = "%Y%m%d"
        # 只记录INFO级别信息，抛弃上面的WARNING、ERROR、CRITICAL几个级别  
        handler.addFilter(LevelFilter(level))
        #初始化时，getLogger中字符串不可与其他初始化logger相同
        logger = logging.getLogger(name+str(level))  
        logger.setLevel(level) 
        logger.addHandler(handler)
        return logger
    
#     def init_error_logger(self,name, logging_dir): 
#         logging_file=os.path.join(logging_dir,"%Y-%m-%d",name+"_Errors.log")
#         handler = MyLoggerHandler(logging_file)   
#         handler.setFormatter(logging.Formatter(
#             "%(asctime)s[%(process)d][%(filename)s] %(levelname)-5s %(name)-10s %(message)s",  # 设置日志格式，固定宽度便于解析  
#             datefmt="%Y-%m-%d %H:%M:%S"  # 设置asctime时间格式  
#         )) 
#         handler.suffix = "%Y%m%d"
#         #ERROR级别  
#         handler.addFilter(LevelFilter(logging.ERROR))
#         logger = logging.getLogger(name)  
#         logger.setLevel(logging.ERROR) 
#         logger.addHandler(handler)
#         return logger
#     
#     def init_debug_logger(self,name, logging_dir): 
#         logging_file=os.path.join(logging_dir,"%Y-%m-%d",name+"_Debug.log")
#         handler = MyLoggerHandler(logging_file)   
#         handler.setFormatter(logging.Formatter(
#             "%(asctime)s[%(process)d][%(filename)s] %(levelname)-5s %(name)-10s %(message)s",  # 设置日志格式，固定宽度便于解析  
#             datefmt="%Y-%m-%d %H:%M:%S"  # 设置asctime时间格式  
#         )) 
#         handler.suffix = "%Y%m%d"
#         #DEBUG级别  
#         handler.addFilter(LevelFilter(logging.DEBUG))
#         logger = logging.getLogger(name)  
#         logger.setLevel(logging.DEBUG) 
#         logger.addHandler(handler)
#         return logger
    
    