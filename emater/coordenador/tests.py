from django.test import TestCase
from django.db import IntegrityError
from coordenador.models import Coordenador, Produtor, Terreno, Talhao
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import date

class CoordenadorTestCase(TestCase):
    def setUp(self):
            self.user = User.objects.create_user(username='testador', password='teste@123')
            self.coordenador = Coordenador.objects.create(
                user=self.user,
                telefone="(11) 12345-0987",
                cpf="12345678909",
                cidade='Testelândia',
                codigo='TST01'
            )
    def test_criacao_coordenador(self):
        print("\nTestando criação de Coordenador")
        self.assertEqual(self.coordenador.user.username, 'testador')
        self.assertEqual(self.coordenador.cidade, 'Testelândia')
        print("Coordenador criado com sucesso")

    def test_atualizacao_coordenador(self):
        print("\nTestando atualização de Coordenador")
        self.coordenador.cidade = "Cidade Atualizada"
        self.coordenador.save()

        self.coordenador.refresh_from_db()
        self.assertEqual(self.coordenador.cidade, "Cidade Atualizada")
        print(f"Cidade atualizada para: {self.coordenador.cidade}")

    def test_exclusao_coordenador(self):
        print("\nTestando exclusão de Coordenador")
        id_coordenador = self.coordenador.id
        self.coordenador.delete()

        self.assertFalse(Coordenador.objects.filter(id=id_coordenador).exists())
        print("Coordenador excluído com sucesso")

    def test_dupli_CPF(self):
        print('\nTestando a duplicidade do CPF')
        with self.assertRaises(IntegrityError):      
            self.user = User.objects.create_user(username='testadorRep', password='teste@123')
            self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            
            codigo='TST02'
            )
        print("\nErro com duplicação do CPF confirmado")

    def test_dupli_codigo(self):
        print('\nTestando a duplicidade de código')
        with self.assertRaises(IntegrityError):      
            self.user = User.objects.create_user(username='testadorRep', password='teste@123')
            self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            
            codigo='TST01'
            )
        print("\nErro com duplicação de código confirmado")

class ProdutorTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testador', password='teste@123')
        self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            codigo='TST01'
        )
        self.produtor = Produtor.objects.create(
            nome='ProdutorTS',
            telefone="(21) 09876-4321",
            cpf="56789012345",
            cidade="Belo Produto",
            caf='CAF123456',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
            
    def test_criacao_produtor(self):
        print("\nTestando criação de Produtor")
        self.assertEqual(self.produtor.nome, 'ProdutorTS')
        self.assertTrue(Produtor.objects.filter(nome='ProdutorTS').exists())
        print("Produtor criado com sucesso")

    def test_atualizacao_produtor(self):
        print("\nTestando atualização de Produtor")
        self.produtor.nome = "Produtor Atualizado"
        self.produtor.save()
        self.produtor.refresh_from_db()
        self.assertEqual(self.produtor.nome, "Produtor Atualizado")
        print(f"Nome atualizado para: {self.produtor.nome}")

    def test_exclusao_produtor(self):
        print("\nTestando exclusão de Produtor")
        id_produtor = self.produtor.id
        self.produtor.delete()
        self.assertFalse(Produtor.objects.filter(id=id_produtor).exists())
        print("Produtor excluído com sucesso")
        
    def test_dupli_CPF(self):
        print('\nTestando a duplicidade do CPF')
        with self.assertRaises(IntegrityError):      
            self.produtor = Produtor.objects.create(
            nome='ProdutorDupi',
            telefone="(21) 09876-4321",
            cpf="56789012345",
            cidade="Belo Produto",
            caf='CAF123476',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
        print("\nErro com duplicação do CPF confirmado")

    def test_dupli_caf(self):
        print('\nTestando a duplicidade de caf')
        with self.assertRaises(IntegrityError):      
            self.produtor = Produtor.objects.create(
            nome='ProdutorDupi',
            telefone="(21) 09876-4321",
            cpf="56789012354",
            cidade="Belo Produto",
            caf='CAF123456',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
        print("\nErro com duplicação do caf confirmado")

class TerrenoTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testador', password='teste@123')
        self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            
            codigo='TST01'
        )
        self.produtor = Produtor.objects.create(
            nome='ProdutorTS',
            telefone="(21) 09876-4321",
            cpf="56789012345",
            cidade="Belo Produto",
            caf='CAF123456',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
        self.terreno = Terreno.objects.create(
            nome = "Terreno tese",
            cidade = "Belo Terreno",
            produtor = self.produtor
        )
    
    def test_criacao_terreno(self):
        print("\nTestando criação de Terreno")
        self.assertEqual(self.terreno.nome, 'Terreno tese')
        self.assertTrue(Terreno.objects.filter(nome='Terreno tese').exists())
        print("Terreno criado com sucesso")

    def test_atualizacao_terreno(self):
        print("\nTestando atualização de Terreno")
        self.terreno.nome = "Terreno Atualizado"
        self.terreno.save()
        self.terreno.refresh_from_db()
        self.assertEqual(self.terreno.nome, "Terreno Atualizado")
        print(f"Nome atualizado para: {self.terreno.nome}")

    def test_exclusao_terreno(self):
        print("\nTestando exclusão de Terreno")
        id_terreno = self.terreno.id
        self.terreno.delete()
        self.assertFalse(Terreno.objects.filter(id=id_terreno).exists())
        print("Terreno excluído com sucesso")

class TalhaoTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testador', password='teste@123')
        self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            codigo='TST01'
        )
        self.produtor = Produtor.objects.create(
            nome='ProdutorTS',
            telefone="(21) 09876-4321",
            cpf="56789012345",
            cidade="Belo Produto",
            caf='CAF123456',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
        self.terreno = Terreno.objects.create(
            nome = "Terreno tese",
            cidade = "Belo Terreno",
            produtor = self.produtor
        )
        self.talhao = Talhao.objects.create(
            nome = "Talhão T",
            cidade = "Cidade Teste",
            data_certificacao = date(2025,7,22),
            numero_plantas = 88,
            data_plantio = date(2025,7,14),
            variedade = "Muita",
            area = 25.5,
            terreno = self.terreno,
            validade_caf = self.produtor.validade_caf 
        )

    def test_criacao_talhao(self):
        print("\nTestando criação de Talhão")
        self.assertEqual(self.talhao.nome, 'Talhão T')
        self.assertTrue(Talhao.objects.filter(nome='Talhão T').exists())
        print("Talhão criado com sucesso")

    def test_atualizacao_talhao(self):
        print("\nTestando atualização de Talhão")
        self.talhao.nome = "Talhão Atualizado"
        self.talhao.save()
        self.talhao.refresh_from_db()
        self.assertEqual(self.talhao.nome, "Talhão Atualizado")
        print(f"Nome atualizado para: {self.talhao.nome}")

    def test_exclusao_talhao(self):
        print("\nTestando exclusão de Talhão")
        id_talhao = self.talhao.id
        self.talhao.delete()
        self.assertFalse(Talhao.objects.filter(id=id_talhao).exists())
        print("Talhão excluído com sucesso")

class GeralTesteCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testador', password='teste@123')
        self.coordenador = Coordenador.objects.create(
            user=self.user,
            telefone="(11) 12345-0987",
            cpf="12345678909",
            cidade='Testelândia',
            codigo='TST01'
        )
        self.produtor = Produtor.objects.create(
            nome='ProdutorTS',
            telefone="(21) 09876-4321",
            cpf="56789012345",
            cidade="Belo Produto",
            caf='CAF123456',
            validade_caf=date(2030, 7, 22),
            coordenador=self.coordenador
        )
        self.terreno = Terreno.objects.create(
            nome = "Terreno tese",
            cidade = "Belo Terreno",
            produtor = self.produtor
        )
        self.talhao = Talhao.objects.create(
            nome = "Talhão T",
            cidade = "Cidade Teste",
            data_certificacao = date(2025,7,22),
            numero_plantas = 88,
            data_plantio = date(2025,7,14),
            variedade = "Muita",
            area = 25.5,
            terreno = self.terreno,
            validade_caf = self.produtor.validade_caf 
        )

    def test_relacionamento_completo(self):
        print("\nTestando relacionamento completo Talhão → Coordenador")
        coordenador_nome = self.talhao.terreno.produtor.coordenador.user.username
        self.assertEqual(coordenador_nome, 'testador')
        print(f"Relacionamento OK: Talhão → Terreno → Produtor → Coordenador = {coordenador_nome}")
    
    def test_fluxo_completo(self):
        # Login do coordenador
        print("\nLogando coordenador...")
        login = self.client.login(username='testador', password='teste@123')
        self.assertTrue(login)
        print("Login bem-sucedido")

        # Cadastro de produtor
        print("\nCadastrando produtor...")
        url = reverse('coordenador:adicionarProdutor')
        response = self.client.post(url, {
            'nome': 'Produtor Teste',
            'telefone': '(11) 99999-0000',
            'cpf': '98765432100',
            'cidade': 'Cidade do Produtor',
            'caf': 'CAF0001',
            'validade_caf': '2030-01-01',
            'coordenador': self.coordenador.id
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Produtor.objects.filter(cpf='98765432100').exists())
        produtor = Produtor.objects.get(cpf='98765432100')
        print("Produtor cadastrado com sucesso")

        # Cadastro de terreno
        print("\nCadastrando terreno...")
        url = reverse('coordenador:terreno_cria', args=[produtor.id]) 
        response = self.client.post(url, {
            'nome': 'Terreno Teste',
            'cidade': 'Cidade Terreno',
            'produtor': produtor.id
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Terreno.objects.filter(nome='Terreno Teste').exists())
        terreno = Terreno.objects.get(nome='Terreno Teste') 
        print("Terreno cadastrado com sucesso")

        # Cadastro de talhão
        print("\nCadastrando talhão...")
        url = reverse('coordenador:talhao_cria', args=[terreno.id]) 
        response = self.client.post(url, {
            'nome': 'Talhão Teste',
            'cidade': 'Cidade Talhão',
            'data_certificacao': '2025-07-22',
            'numero_plantas': 100,
            'data_plantio': '2025-07-01',
            'variedade': 'Catuaí',
            'area': 10.5,
            'validade_caf': '2030-01-01',
            'terreno': terreno.id
        }, follow=True)
        print("Talhão response status:", response.status_code)
        print("Talhão response content:", response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Talhao.objects.filter(nome='Talhão Teste').exists())
        print("Talhão cadastrado com sucesso")
