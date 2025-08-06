from rest_framework import serializers
from .models import Produtor, User, Terreno, Talhao

class TalhaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Talhao
        fields = '__all__'

class TerrenoSerializer(serializers.ModelSerializer):
    talhoes = TalhaoSerializer(many=True, read_only=True)

    class Meta:
        model = Terreno
        fields = ['id', 'nome', 'talhoes']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

class ProdutorSerializer(serializers.ModelSerializer):
    terrenos = TerrenoSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Produtor
        fields = ['id', 'user', 'telefone', 'cpf', 'cidade', 'caf', 'validade_caf', 'coordenador', 'terrenos']