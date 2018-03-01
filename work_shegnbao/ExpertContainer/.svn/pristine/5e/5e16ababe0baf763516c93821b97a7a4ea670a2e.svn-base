__author__ = 'Administrator'

from ExpertContainer import app


class FaultNotice:
    def __init__(self, problem, analysis='', affect='', suggestion='', risk=0, riskType=0,  energy=0, grade=1, bindPoints=[]):
        self.problem = problem
        self.analysis = analysis
        self.affect = affect
        self.suggestion = suggestion
        self.energy  = energy
        self.grade = grade
        self.bindPoints = bindPoints
        self.risk = risk
        self.riskType = riskType

    def toDict(self):
        return dict(problem=self.problem, analysis = self.analysis,
                    affect = self.affect,
                    suggestion = self.suggestion,
                    energy = self.energy,
                    grade = self.grade,
                    bindPoints = self.bindPoints,
                    risk = self.risk,
                    riskType = self.riskType)
    def str(self, lang='zh'):
        if lang =='zh':
            strProblem = '<p><b>问题描述</b>：' + self.problem +'</p>'
            strAnalysis = '<p><b>原因分析</b>：' + self.analysis +'</p>'
            strAffect = '<p><b>后果</b>：' + self.affect +'</p>'
            strSuggestion = '<p><b>建议措施</b>：' + self.suggestion +'</p>'
        elif lang=='en':
            strProblem = '<p><b>Description</b>：' + self.problem +'</p>'
            strAnalysis = '<p><b>Analysis</b>：' + self.analysis +'</p>'
            strAffect = '<p><b>Affect</b>：' + self.affect +'</p>'
            strSuggestion = '<p><b>Suggestion</b>：' + self.suggestion +'</p>'
        return strProblem+strAnalysis+strAffect+strSuggestion

    def genEmailContent(self, userId,  lang='zh'):
        strAddress = 'http://%s/fault/viewMyFault/%s'%(app.config['BEOPWEB_ADDR'], str(userId))
        if lang =='zh':
            strProblem = '<p><b>问题描述</b>：' + self.problem +'</p>'
            strAnalysis = '<p><b>原因分析</b>：' + self.analysis +'</p>'
            strAffect = '<p><b>后果</b>：' + self.affect +'</p>'
            strSuggestion = '<p><b>建议措施</b>：' + self.suggestion +'</p>'
            strViewMore = '<a href='+ strAddress+' class="decoration-none" \
             style="color: #529541;font-size: larger;text-decoration: none;" target="_blank">点击查看更多运营缺陷</a> '
        elif lang=='en':
            strProblem = '<p><b>Description</b>：' + self.problem +'</p>'
            strAnalysis = '<p><b>Analysis</b>：' + self.analysis +'</p>'
            strAffect = '<p><b>Affect</b>：' + self.affect +'</p>'
            strSuggestion = '<p><b>Suggestion</b>：' + self.suggestion +'</p>'
            strViewMore = '<a href='+ strAddress+' class="decoration-none" \
             style="color: #529541;font-size: larger;text-decoration: none;" target="_blank">Click to view more faults</a> '
        return strProblem+strAnalysis+strAffect+strSuggestion  #TODO + strViewMore

    def getGrade(self):
        return self.grade

    def getEnergy(self):
        return self.energy

    def getBindPoints(self):
        return self.bindPoints