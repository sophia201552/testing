import time
import datetime
from test_python.test_context import Test
# def a(x):
#     def wrapper():
#         print("a")
#         x()
#     return wrapper
#
# def b(func):
#     print("b")
#     def wrapper(*args,**kwargs):
#         print("定义一个装饰器")
#         func(*args,**kwargs)
#     return wrapper
#
# #
# @a
# def c():
#     print("c")
#
# c()
###############################################################################
# def decorate(func):
#     def wrapper(*args,**kwargs):
#         print("定义一个装饰器")
#         func(*args,**kwargs)
#     return wrapper
#
# # @decorate
# @b
# def text1():
#     print("text1")
#
# text1()
####################################################################

# def deco(func):
#     print("before myfunc() called.")
#     func()
#     print("  after myfunc() called.")
#     return func
#
# @deco
# def myfunc():
#     print(" myfunc() called.")
#
# myfunc()
# myfunc()
#############################################################
#计算一个函数耗时


def decorate(funciton):
    def wrapper(*args,**kargs):
        print("start")
        start=datetime.datetime.now()
        funciton()
        print("end")
        total=datetime.datetime.now()-start
        return total
    return wrapper


@Test.decorate
def time_use():
    time.sleep(5)
    print("time_use end")

print("time_use method use {0} seconds".format(time_use()))