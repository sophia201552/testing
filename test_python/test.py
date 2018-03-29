class Test1:
    __a__=None
    b=""
    def test(self):
        print("ss")

class Test2:
    @staticmethod
    def test():
        t=Test1.__a__
        tt=Test1.b
        print(t)

Test2.test()