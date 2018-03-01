Running unit tests in PyCharm
=============================
1. Install pytest package
1. Create a new run configuration with below settings:
   - "Run" -> "Edit configuration" -> Create new configuration -> Python Tests -> py.tests
   - Target: Path | and choose BeopService/tests folder
   - Environment variables: FLASK_CONFIG=test
   - Working directory: choose BeopService

Running unit tests with code coverage
=====================================
1. Open a command line window
1. Enter the project root folder and run

       pip install pytest-cov==2.5.1
       set FLASK_CONFIG=development_unittest
       pytest --cov=. --cov-config .coveragerc --cov-report html:C:\cc ./tests -vvv

   Note that _C:\cc_ could be replaced with any folder you want to store the coverage report and
    _./tests_ could be replaced with specific file as filter. For example

       # Only run test cases in test_update.py and generate report at ~/codecov
       pytest --cov=. --cov-config .coveragerc --cov-report html:~/codecov ./tests/test_get_realtimedata.py