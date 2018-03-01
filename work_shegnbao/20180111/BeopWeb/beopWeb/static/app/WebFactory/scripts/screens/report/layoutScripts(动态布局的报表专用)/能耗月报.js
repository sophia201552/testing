interface_data1 =  {
    'total_waste':100,
    'detail':[

        {'name':'Primary chilled water pump',
         'description': 'Additional use of primary chilled water pump',
         'waste':30,
         'waste_ratio':0.3,
         'graph':[
             {'title':'',
              'x':['chwp01', 'chwp02', 'chwp03'],
              'y':{'typical':[100, 200, 300],
                   'best practice':[100, 200, 330]
                   },
              }
         ]
         },
        {'name':'cooling water pump',
         'description': 'Additional use of primary chilled water pump',
         'waste':70,
         'waste_ratio':0.7,
         'graph':[
             {'title':'',
              'x':['cwp01', 'cwp02', 'cwp03'],
              'y':{'y1':[100, 200, 300],
                   'y2':[100, 200, 370]
                   },
              }
         ]
         }
    ]
}

    var startTime = '{outStartTime}';
    var endTime = '{outEndTime}';
    var shortMonthTime = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var lastMonthIndex = moment(startTime).subtract(1, 'month').month();
    var towMonthNum = moment(startTime).subtract(2, 'month').month();
    var lastMonth = moment(startTime).subtract(1, 'month');
    var lastYear = lastMonth.year();
    table_head={
      lastMonthHead:shortMonthTime[lastMonthIndex]+' '+moment(startTime).subtract(1, 'month').year(),
      twoMonthBefore:shortMonthTime[towMonthNum]+' '+moment(startTime).subtract(2, 'month').year(),
      lastYearMonth:shortMonthTime[lastMonthIndex]+' '+moment(startTime).subtract(1, 'year').year(),
      MonthStartTime: moment(startTime).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      lastMonthStartTime: startTime,
      lastMonthEndTime: endTime,
      beforeMonthStartTime: moment(startTime).subtract(2, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      YOYStartTime: moment(startTime).subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
      YOYEndTime:new moment(endTime).subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss')
    }

    var postdata2={
        "startTime": startTime,
        "endTime": endTime,
        "projectId": 674,
        "lang": AppConfig.language
    }
    WebAPI.post('/diagnosis_v2/getDiagnosisDetail', postdata2).done((rs)=>{
      interface_data2 = rs;
    })

interface_data3 =  {
    'total_waste':100,
    'detail':[

        {'name':'Primary chilled water pump',
         'description': 'Additional use of primary chilled water pump',
         'waste':30,
         'waste_ratio':0.3,
         'graph':[
             {'title':'',
              'x':['chwp01', 'chwp02', 'chwp03'],
              'y':{'typical':[100, 200, 300],
                   'best practice':[100, 200, 330]
                   },
              }
         ]
         },
        {'name':'cooling water pump',
         'description': 'Additional use of primary chilled water pump',
         'waste':70,
         'waste_ratio':0.7,
         'graph':[
             {'title':'',
              'x':['cwp01', 'cwp02', 'cwp03'],
              'y':{'y1':[100, 200, 300],
                   'y2':[100, 200, 370]
                   },
              }
         ]
         }
    ]
}

interface_data4 = {
    'total_points':29,
    'total_data':29*24*30,
    'recieved_data':29*24*30,
    'integrity':1,
    'detail':[
        {'meter':'Chiller01',
         'fault': 'Constant value',
         'time':'JUN 1-JUN 7',
         'durance':3
         }
    ]
}


var params = [{
  "arrDs": ["@674|Monthly_EnergyReport_EnergyDiag_Data","@674|Monthly_EnergyReport_WeatherDiag_Data","@674|Monthly_EnergyReport_MeterDiag_Data"],
  "arrMoment": [startTime],
  "format": "d1"
}];
var _findRsFromList = function (ds, rs) {
    var list = rs[0].list;
    for (var i = 0, len = list.length; i < len; i += 1) {
        if (list[i].ds === ds) {
            return list[i];
        }
    }
    return null;
}
WebAPI.post('/data/get_history/at_moment', params).done(function (rs) {
    var data;
    try {
        data = _findRsFromList("@674|Monthly_EnergyReport_EnergyDiag_Data", rs).data[0];
        interface_data1 = typeof data === 'string' ? JSON.parse(data) : data;
    } catch(e) {}
    try {
        data = _findRsFromList("@674|Monthly_EnergyReport_WeatherDiag_Data", rs).data[0];
        interface_data3 = typeof data === 'string' ? JSON.parse(data) : data;
    } catch(e) {}
    try {
        data = _findRsFromList("@674|Monthly_EnergyReport_MeterDiag_Data", rs).data[0];
        interface_data4 = typeof data === 'string' ? JSON.parse(data) : data;
    } catch(e) {}
})
  var params1 = [{
    "arrDs": ['@674|ElecUse_Peak','@674|ElecUse_Flat','@674|ElecUse_Valley'],
    "arrMoment": [startTime, new Date(new Date(startTime).setMonth(new Date(startTime).getMonth() + 1)).format("yyyy-MM-dd 00:00:00")
    ],
    "format": "d1"
  }];
  WebAPI.post('/data/get_history/at_moment', params1).done(rs => {
     var costOne=['@674|ElecUse_Peak','@674|ElecUse_Flat','@674|ElecUse_Valley'];
    var listNew=[];
    costOne.forEach(item=>{
    rs[0].list.forEach(k=>{
      if(k.ds==item){
      listNew.push(k)
      }
    })
    })
    rs[0].list=listNew
  interface_data5=rs
  })
   var params1 = [{
    "arrDs": ['@674|Cost_Peak','@674|Cost_Flat','@674|Cost_Valley'],
    "arrMoment": [startTime, new Date(new Date(startTime).setMonth(new Date(startTime).getMonth() + 1)).format("yyyy-MM-dd 00:00:00")
    ],
    "format": "d1"
  }];
  WebAPI.post('/data/get_history/at_moment', params1).done(rs => {
    var costOne=['@674|Cost_Peak','@674|Cost_Flat','@674|Cost_Valley'];
   var listNew=[];
   
    costOne.forEach(item=>{
    rs[0].list.forEach(k=>{
      k.data=k.data.map(datas=>{
        if(datas==null){
        return 0
        }else{
         return datas
        }
   
      })
      if(k.ds==item){
      listNew.push(k)
      }
    })
    })
    rs[0].list=listNew
 
  interface_data6=rs
  })
  weatherJson={
    '100':'Sunny',
    '101':'Cloudy',
    '102':'Few Clouds',
    '103':'Partly Cloudy',
    '104':'Overcast',
    '200':'Windy',
    '201':'Calm',
    '202':'Light Breeze',
    '203':'Gentle Breeze',
    '204':'Fresh Breeze',
    '205':'Strong Breeze',
    '206':'High Wind',
    '207':'Gale',
    '208':'Strong Gale',
    '209':'Storm',
    '210':'Violent Storm',
    '211':'Hurricane',
    '212':'Tornado',
    '213':'Tropical Storm',
    '300':'Shower Rain',
    '301':'Heavy Shower Rain',
    '302':'Thundershower',
    '303':'Heavy Thunderstorm',
    '304':'Hail',
    '305':'Light Rain',
    '306':'Moderate Rain',
    '307':'Heavy Rain',
    '308':'Extreme Rain',
    '309':'Drizzle Rain',
    '310':'Storm',
    '311':'Heavy Storm',
    '312':'Severe Storm',
    '313':'Freezing Rain',
    '400':'Light Snow',
    '401':'Moderate Snow',
    '402':'Heavy Snow',
    '403':'Snowstorm',
    '404':'Sleet',
    '405':'Rain And Snow',
    '406':'Shower Snow',
    '407':'Snow Flurry',
    '500':'Mist',
    '501':'Foggy',
    '502':'Haze',
    '503':'Sand',
    '504':'Dust',
    '507':'Duststorm',
    '508':'Sandstorm',
    '900':'Hot',
    '901':'Cold',
    '999':'Unknown',
}
