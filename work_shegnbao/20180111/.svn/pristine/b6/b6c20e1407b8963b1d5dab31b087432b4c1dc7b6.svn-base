
import operator
from fuzzywuzzy import fuzz

class Simdistance:
    def getNeighbors(self,trainingSet, testInstance, k=0):
        distances= []
        for i in range(len(trainingSet)):
            sim = self.dist2(testInstance, trainingSet[i])
            #sim = self.dist2(testInstance, trainingSet[277])
            distances.append((trainingSet[i], sim))
        distances.sort(key=operator.itemgetter(1), reverse=True)
        neighbors = []
        if k:
            for j in range(k):
                neighbors.append(distances[j])
        else:
            for item in distances:
                if item[1] >= 0.6:
                    neighbors.append(item)
        #对neighbors，得分相同的情况下，字符较短的靠前

        return neighbors
    def getNRatio(self,trainingSet, testInstance):
        maxratio = 0
        neighbors = []
        for i in range(len(trainingSet)):
            mratio = fuzz.ratio(testInstance.lower(), trainingSet[i].lower())
            if mratio >maxratio:
                neighbors = [(trainingSet[i],mratio)]
                maxratio = mratio

        return neighbors

    def similarity(self,n0, n1,ls1,ls2,p0=0.2, p1=0.6, strength=1):

        #全匹配
        if n0 ==0 and ls1 ==ls2 :
            return 100

        #计算相似度
        r= 0
        pn1 = 1
        for loc in n1:
            pn1 *= 1 - (p1 / (loc + 1) ** strength)
        r= p0 ** n0 * (1 - pn1)


        if n0 ==0 and ls2>ls1:
            #判断是否包含且连续关系
            con = []
            for i in range(len(n1)-1):
                con.append(n1[i+1]-n1[i]);
            if sum(con) == len(n1)-1: #包含且连续
                r = 1*(ls1/ls2)*ls1**2

        return r

    def compare(self,str1='clg', str2='cooling'):
        str1 = str1.lower()
        str2 = str2.lower()
        ind = []
        loc = 0
        loss = 0
        for s in str1:
            res = str2[loc:].find(s)
            if res == -1:
                loss = 1
                break
            else:
                loc = res + loc
                ind.append(loc)
        return loss, ind

    def compare2(self,str1='vav', str2='variable air volume'):

        ls1 = len(str1)
        ls2 = len(str2)

        if ls1>ls2:
            ls1,ls2 = ls2,ls1
            str1,str2 = str2,str1

        str1 = str1.lower()
        str2 = str2.lower()

        str2 = str2.split(' ')
        ind = []
        loc = -1
        curr_loc = -1
        loss = 0
        str2_loc = 0
        str2_weight = []
        for s in str1:
            if loc==-1:
                curr_loc=0
            else:
                curr_loc = loc+1
            res = str2[str2_loc][curr_loc:].find(s)
            if s==str1[0] and str2_loc==0 and loc == -1 and res==-1:
                loss = 1
                ind = []
                break
            if res == -1:
                curr_loc = 0
                str2_loc += 1

                if str2_loc > len(str2) - 1:
                    loss = 1
                    break
                while str2[str2_loc][curr_loc:].find(s) == -1:
                    str2_loc+=1
                    loc = -1
                    if str2_loc > len(str2) -1:
                        loss=1
                        break
                if loss:
                    break
                res = str2[str2_loc][curr_loc:].find(s)
            if loc==-1:
                loc = res
            else:
                loc += res+1
            ind.append(loc)

        return loss, ind,ls1,ls2

    def dist(self,str1, str2):
        loss, ind = self.compare(str1, str2)
        return self.similarity(loss, ind)

    def dist2(self,str1, str2):
        loss, ind,ls1,ls2 = self.compare2(str1, str2)
        return self.similarity(loss, ind,ls1,ls2)

if __name__ == '__main__':

    print(1)
    # loss, ind = compare2(str1='Valve', str2='variable air volume')
    # print(loss, ind)
    #
    # print(similarity(loss, ind))
    #
    # print(dist('vav', 'variable'))
    #
    # print(dist2('hhw', 'hot water'))
