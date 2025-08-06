from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from validate_docbr import CPF

def cpf_valido(cpf):
    return CPF().validate(cpf)

telefone_validator = RegexValidator(
    regex=r'^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$',
    message="Telefone inválido. Use o formato (XX) XXXXX-XXXX."
)

class Coordenador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telefone = models.CharField(max_length=20, validators=[telefone_validator])
    cpf = models.CharField(unique=True, max_length=20, validators=[cpf_valido])
    cidade = models.CharField(max_length=100)
    codigo = models.CharField(max_length=200, unique=True)

    class Meta: 
        db_table = 'coordenadores'
        ordering = ['user__first_name', 'user__last_name']
        verbose_name = "Coordenador"
        verbose_name_plural = "Coordenadores"

    def __str__(self):
        return f"{self.user.username} - {self.codigo}"
    
class Produtor(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    telefone = models.CharField(max_length=20, validators=[telefone_validator])
    cpf = models.CharField(unique=True, max_length=20, validators=[cpf_valido])
    cidade = models.CharField(max_length=100)
    caf = models.CharField(unique=True,max_length=100)
    validade_caf = models.DateField()
    coordenador = models.ForeignKey(Coordenador, on_delete=models.CASCADE)

    class Meta: 
        db_table = 'produtores'
        ordering = ['caf']
        verbose_name = "Produtor"
        verbose_name_plural = "Produtores"

    def __str__(self):
        return f"{self.user.first_name} - {self.cpf} - {self.caf}"
    
class Terreno(models.Model):
    nome = models.CharField(max_length=30)
    cidade = models.CharField(max_length=30)
    produtor = models.ForeignKey(Produtor, on_delete=models.CASCADE, related_name='terrenos')

    class Meta:
        db_table = 'terrenos'
        ordering = ['nome']
        verbose_name = 'Terreno'
        verbose_name_plural = 'Terrenos'

    def _str_(self):
        return f"{self.nome} - {self.cidade}"
    
class Talhao(models.Model):
    terreno = models.ForeignKey(Terreno, on_delete=models.CASCADE, related_name='talhoes')
    nome = models.CharField(max_length=100)
    cidade = models.CharField(max_length=30)
    data_certificacao = models.DateField()
    numero_plantas = models.IntegerField()
    data_plantio = models.DateField()
    variedade = models.CharField(max_length=100)
    area = models.IntegerField()
    validade_caf = models.DateField()
    
    class Meta:
        db_table = 'talhoes'
        ordering = ['nome']
        verbose_name = 'Talhão'
        verbose_name_plural = 'Talhões'

    def _str_(self):
        return f"{self.nome} - {self.cidade}"
