from django import forms
from .models import Produtor, Terreno, Talhao, User
from django.forms import DateInput

class UserForm(forms.ModelForm):
    confirmar_senha = forms.CharField(
            required=False,
            widget=forms.PasswordInput(),
            label="Confirmar senha"
        )

    password = forms.CharField(
            required=False,
            widget=forms.PasswordInput(),
            label="Senha"
        )
    
    username = forms.CharField(
        label="Identificador"
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'password', 'confirmar_senha', 'email']

    def clean(self):
            cleaned_data = super().clean()
            senha = cleaned_data.get("password")
            confirmar = cleaned_data.get("confirmar_senha")

            if senha and confirmar and senha != confirmar:
                self.add_error('confirmar_senha', "As senhas não coincidem.")

            return cleaned_data
    
class ProdutorForm(forms.ModelForm):
    validade_caf = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
        input_formats=['%Y-%m-%d']
    )
    class Meta:
        model = Produtor
        exclude = ['coordenador', 'cidade', 'user']
        widgets = {
            'validade_caf': DateInput(attrs={'type': 'date'})
        }
        labels = {
            'validade_caf': 'Validade do CAF',
        }

class TerrenoForm(forms.ModelForm):
    class Meta:
        model = Terreno
        exclude = ['produtor', 'cidade']

class TalhaoForm(forms.ModelForm):
    validade_caf = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
        input_formats=['%Y-%m-%d']
    )
    data_certificacao = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
        input_formats=['%Y-%m-%d']
    )
    data_plantio = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}, format='%Y-%m-%d'),
        input_formats=['%Y-%m-%d']
    )
    class Meta:
        model = Talhao
        exclude = ['terreno', 'cidade']
        widgets = {
            'validade_caf': DateInput(attrs={'type': 'date'}),
            'data_plantio': DateInput(attrs={'type': 'date'}),
            'data_certificacao': DateInput(attrs={'type': 'date'})
        }
        labels = {
            'validade_caf': 'Validade do CAF',
            'data_plantio': 'Data de Plantio',
            'data_certificacao': 'Data da Certificação'
        }