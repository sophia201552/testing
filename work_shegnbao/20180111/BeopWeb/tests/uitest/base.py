#edcoding=utf-8

class BaseCase:
    def __init__(self, name, project_id, tlc, driver):
        self.name = name
        self.project_id = project_id
        self.tlc = tlc
        self.driver = driver
