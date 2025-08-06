import requests
from datetime import datetime
from django.conf import settings

def is_coordenador_or_superuser(user, produtor):
    return user.is_superuser or getattr(user, 'coordenador', None) == produtor.coordenador

def importar_servicos_da_api(produtor_email=None):
    url = "http://host.docker.internal:3000/api/servicos"

    params = {"produtor": produtor_email} if produtor_email else {}
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return {"success": True, "dados": response.json()}
    except requests.RequestException as e:
        return {"success": False, "erro": str(e)}
