import os
import subprocess
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    subprocess.run([sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'])