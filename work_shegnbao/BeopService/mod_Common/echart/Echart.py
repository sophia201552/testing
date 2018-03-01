import sys
import os
import subprocess
import tempfile
import logging
import json


def generate_echart_to_disk(echart_option, **kwargs):
    """
    Generate Echart style chart and save to disk as an image file (.png)
    Return value: the path to the generated file
    Parameters:
        echart_option: a dictionary that represents the option for Echart
        **kwargs:
            width: integer that represents the width of the generated chart
            height: integer that represents the height of the generated chart
    """
    try:
        logging.info("Generating Echart as image to disk: echart_options = %s, kwargs = %s", echart_option, kwargs)
        current_directory = os.path.dirname(os.path.realpath(__file__))
        logging.debug(current_directory)
        echart_js_path = 'echart.js'
        phantomjs_path = kwargs.get('phantomjs_path', 'phantomjs')
        width = kwargs.get('width', 700)
        height = kwargs.get('height', 300)
        security_level, temp_file_path = tempfile.mkstemp()
        logging.debug("security_level=%s, temp_file_path=%s", security_level, temp_file_path)
        output_image_path = temp_file_path + '.png'
        cmd = [phantomjs_path, echart_js_path, output_image_path,
               json.dumps(echart_option),
               '{ "width": %s, "height": %s }' % (width, height)]
        logging.debug('Command: %s', cmd)
        result = subprocess.check_output(cmd, shell=False, stderr=subprocess.STDOUT, timeout=30, cwd=current_directory)
        logging.debug("Stdout=%s", result)
    except subprocess.CalledProcessError as e:
        err_msg = "Cannot generate echart image correctly with option: %s, kwargs: %s" % (echart_option, kwargs)
        err_msg += " Detail: cmd: %s, exit_code: %s, output: %s" % (e.cmd, e.returncode, e.output)
        logging.error(err_msg, exc_info=True, stack_info=True)
        raise Exception(err_msg).with_traceback(sys.exc_info()[2])
    except:
        err_msg = "Cannot generate echart image correctly with option: %s, kwargs: %s" % (echart_option, kwargs)
        logging.error(err_msg, exc_info=True, stack_info=True)
        raise Exception(err_msg).with_traceback(sys.exc_info()[2])

    return output_image_path

if __name__ == '__main__':
    logging.basicConfig(
        format='%(asctime)-15s %(levelname)-8s %(message)s',
        level=logging.DEBUG)
    echart_file_path = generate_echart_to_disk({
        'title': { 'text': 'Test'},
        'legend': {'data': ['AAA']},
        'xAxis': {'data': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
        'yAxis': {},
        'series': [{
            'name': 'AAA',
            'type': 'bar',
            'data': [10, 20, 30, 40, 40, 30, 20, 15, 20, 15]
        },{
            'name': 'BBB',
            'type': 'bar',
            'data': [7, 13, 14, 10, 12, 20, 12, 3, 44, 5, 0]
        }]
    }, height=600)
    logging.info("File generated at %s", echart_file_path)