from bson import ObjectId


tagGlobalDictionary_Ch = {'id':ObjectId().__str__(),
                          'icon':'XXX.png',
                          'name':['chiller'],   ##修饰符的名称 如ahu,即tag字典中的名称
	                      'attrP':{
                              {'name':'ECWT', 'description':'enter condensor temperature', 'unit':''},
	                          {'name':'LCWT', 'description':'leave condensor temperature', 'unit':''},
	                          {'name':'ChAMPS'}
                          },   ##modifier的属性,如ahu应该有哪些属性
	                      'type':int   #0:属性类型,1:设备类型.如果是属性类型只表明这是一个属性的修饰符, 如温度就是个属性类型;如果是设备类型说明这是一个设备,需要将当前的group转为对应的设备thing, 如ahu就是个设备类型
 }

groupThing = {'_id':ObjectId(), 'name':'根目录01', 'tagId':ObjectId(), 'arrPrt':[], 'path':'/'}
