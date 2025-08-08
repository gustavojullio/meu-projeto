from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, render
import requests
from datetime import datetime
from django.conf import settings
from django.contrib.auth.views import LoginView

def is_coordenador_or_superuser(user, produtor):
    return user.is_superuser or getattr(user, 'coordenador', None) == produtor.coordenador

def get_nested_attr(obj, attr_path):
    if not attr_path:
        return obj
    for attr in attr_path.split('.'):
        obj = getattr(obj, attr)
    return obj

def coordenador_required(model_class, produtor_attr='produtor'):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, id, *args, **kwargs):
            obj = get_object_or_404(model_class, id=id)
            produtor = get_nested_attr(obj, produtor_attr)

            if not is_coordenador_or_superuser(request.user, produtor):
                return render(request, '403.html', {
                    'message': 'Você não tem permissão para acessar essa página.',
                    'user': request.user
                }, status=403)

            return view_func(request, id, *args, **kwargs)
        return _wrapped_view
    return decorator

def importar_servicos_da_api(produtor_email=None):
    url = "http://host.docker.internal:3000/api/servicos"

    params = {"produtor": produtor_email} if produtor_email else {}
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return {"success": True, "dados": response.json()}
    except requests.RequestException as e:
        return {"success": False, "erro": str(e)}