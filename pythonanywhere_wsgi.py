import sys
import os

# Caminho para o diretório do projeto
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

# Importa o app Flask do server.py
from server import app as application

# Se necessário, configure variáveis de ambiente aqui
# os.environ['VAR_NAME'] = 'value'
