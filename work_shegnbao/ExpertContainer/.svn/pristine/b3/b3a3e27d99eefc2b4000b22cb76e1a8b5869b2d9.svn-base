__author__ = 'Administrator'

import math

class Air:
    #************************************************************************
    #根据温度计算饱和湿空气的水蒸气分压力 (Pa)
    #参数t: 温度，摄氏度。
    #************************************************************************/
    @classmethod
    def CalSaturatedP(cls, t):
        c8 = -5800.2206
        c9 = 1.3914993
        c10 = -0.04860239
        c11 = 0.000041764768
        c12 = -0.000000014452093
        c13 = 6.5459673
        Pqb = math.exp(c8/(273+t)+
            c9+c10*(273+t)+
            c11*(273+t)*(273+t)+
            c12*(273+t)*(273+t)*(273+t)+
            c13*math.log(273+t))
        return Pqb


    #计算指定温度水的表面饱和湿空气的绝对含湿量 kg/kg
    #参数t: 温度，摄氏度。
    @classmethod
    def CalSaturatedX(cls, t):
        Pqb = cls.CalSaturatedP(t)
        d = 0.622*Pqb/(101325-Pqb)
        return d


    #根据温度t和绝对含湿量x计算焓值H
    @classmethod
    def CalH(cls,  t,  x):
        return 1.005*t+(2500+1.842*t)*x/1000.0


    #/************************************************************************
    #根据温度t和相对湿度fai计算绝对含湿量: g/kg
    #/************************************************************************/
    @classmethod
    def CalXByTFai(cls, t,  fai):
        Pqb = cls.CalSaturatedP(t)
        Pq = fai*Pqb
        x = 622*Pq/(101325-Pqb)
        return x

    #/************************************************************************
    #根据焓值H和绝对含湿量x计算干球温度T
    #/************************************************************************/
    @classmethod
    def CalTByHX(cls, h,  x):
        t = (h-2500*x)/(1.005+1.842*x)
        return t

    #/************************************************************************
    #根据温度t和绝对含湿量x计算空气湿球温度Ts
    #/************************************************************************/
    @classmethod
    def CalTsByTX(cls, t,  x):
        Pq = x*101325/(622+x)
        Tabs=t+273.15
        fTL = cls.CalTLByPq(Pq) - 273.15
        fErr = 1e20
        fBestTs = 0
        fTsAssume =  fTL
        while fTsAssume<=t:
            pqb= cls.CalSaturatedP(fTsAssume)
            TsCalResult = t - (pqb-Pq)/0.000667/101325
            fErrTemp = abs(TsCalResult - fTsAssume)
            if fErrTemp<fErr:
                fErr  = fErrTemp
                fBestTs = fTsAssume
                if fErr<1e-3:
                    break;
            fTsAssume+=0.01

        return fBestTs


    #/************************************************************************
    #根据温度t和湿球温度ts计算绝对含湿量X
    #/************************************************************************/
    @classmethod
    def CalXByTTs(cls, t, ts):
        Pqb = cls.CalSaturatedP(t)
        Pq = Pqb - 0.000667*(t-ts)*101325
        x = 0.622*Pq/(101325-Pqb)
        return x

    #/************************************************************************
    #根据温度t计算焓值H
    #
    #/************************************************************************/
    @classmethod
    def CalSaturatedH(cls, t):
       #计算指定温度水的表面饱和湿空气的比焓 Cal
        Pqb = cls.CalSaturatedP(t)
        ipp = 1.005*t +(2500+1.842*t)*0.662*Pqb/(101325-Pqb)
        return ipp


    #根据蒸气压Pq计算露点温度TL
    @classmethod
    def CalTLByPq(cls, pq):
        TL=-35.957-1.8726*(math.log(pq))+1.1689*(math.log(pq))*(math.log(pq))+273.15
        return TL

    #文博贡献
    @classmethod
    def CalTsByTRH(cls, t, rh):
        dbTD = t
        dbRH = rh*100.0
        if dbRH>100 or dbRH<0:
            return 0
        else:
            return ( -5.250 + 0.6901 * dbTD + 0.05159 * dbRH + 0.003432 * dbTD * dbRH - 1.898 * dbTD / dbRH )