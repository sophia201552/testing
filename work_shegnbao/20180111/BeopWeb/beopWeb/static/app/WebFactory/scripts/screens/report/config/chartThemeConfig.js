// 报表中的图表样式配置
(function(exports) {
  exports.ChartThemeConfig = exports.ChartThemeConfig || {};

  // 非移动端
  +function() {
    var DEFAULT_CHART_OPTIONS = {
      title: {
        textStyle: {
          fontWeight: 'normal',
          color: '#000'
        },
        left: 'center'
      },
      toolbox: {
        showTitle: false
      },
      grid: {
        borderWidth: 0,
        left: 80,
        bottom: 40,
        right: 80,
        top: 80
      },
      series: [],
      color: [
        '#6d819c',
        '#e8b9ae',
        '#eade8c',
        '#68bbe2',
        '#ca7fed',
        '#7adcd9',
        '#e1ae5b',
        '#8489e8',
        '#ec6a91',
        '#91ca88',
        '#a57548',
        '#343434'
      ],
      animation: false
    };

    // 饼图默认图表配置
    this.PIE_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        left: 50,
        data: []
      }
    });

    // 直角系（带轴）默认图表配置
    this.AXIS_CHART_OPTIONS = $.extend(false, {}, DEFAULT_CHART_OPTIONS, {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.6)',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#aaa'
          },
          crossStyle: {
            color: '#aaa'
          },
          shadowStyle: {
            color: 'rgba(200,200,200,0.2)'
          }
        },
        textStyle: {
          color: '#ffffff'
        }
      },
      legend: {
        textStyle: {
          color: '#999999'
        },
        top: 30,
        data: []
      },
      valueAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#8c97aa'
          },
          margin: 10
        },
        splitLine: {
          lineStyle: {
            color: ['#999999'],
            type: 'solid',
            opacity: 0.4
          }
        },
        nameTextStyle: {
          color: '#000000'
        }
      },
      categoryAxis: {
        axisLine: {
          lineStyle: {
            color: '#333333',
            opacity: 0.6
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#8c97aa'
          },
          margin: 10
        },
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: '#000000'
        }
      },
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: '#333333',
              opacity: 0.6
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#8c97aa'
            },
            margin: 10
          },
          splitLine: {
            show: false
          },
          nameTextStyle: {
            color: '#000000'
          },
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#8c97aa'
            },
            margin: 10
          },
          splitLine: {
            lineStyle: {
              color: ['#999999'],
              type: 'solid',
              opacity: 0.4
            }
          },
          nameTextStyle: {
            color: '#000000'
          }
        }
      ]
    });
  }.call(exports.ChartThemeConfig);

  // 移动端
  if (window.AppConfig && window.AppConfig.isMobile) {
    +function() {
      //移动端饼图默认配置
      this.PIE_CHART_OPTIONS = $.extend(false, {}, this.PIE_CHART_OPTIONS, {
        title: {
          textStyle: {
            color: '#d8d6df'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          left: 50,
          data: []
        }
      });

      //移动端直角系（带轴）默认图表配置
      this.AXIS_CHART_OPTIONS = $.extend(false, {}, this.AXIS_CHART_OPTIONS, {
        title: {
          textStyle: {
            color: '#d8d6df'
          }
        },
        legend: {
          textStyle: {
            color: '#a2adbc'
          },
          top: 30,
          data: []
        },
        grid: {
          left: 40,
          bottom: 80,
          right: 5,
          top: 100
        },
        valueAxis: {
          axisLabel: {
            textStyle: {
              color: '#d8d6df'
            }
          },
          data: {
            textStyle: {
              color: '#d8d6df'
            }
          }
        },
        xAxis: [
          {
            axisLabel: {
              textStyle: {
                color: '#d8d6df'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#8c97aa'
              }
            },
            splitLine: {
              lineStyle: {
                color: ['#4e5d77'],
                type: 'solid',
                opacity: '0.6'
              }
            },
            nameGap: 45
            // },{splitLine:{show:false}}]
          }
        ]
      });
    }.call(exports.ChartThemeConfig);
  }
})(namespace('factory.report.config'));