from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView

# Create your views here.
def welcome(request):
    return render(request, 'sistema/welcome.html')

class CustomLoginView(LoginView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('coordenador:Lista_Produtores')
        return super().dispatch(request, *args, **kwargs)