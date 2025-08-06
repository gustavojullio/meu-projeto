from django.urls import path
from . import views

app_name='coordenador'

urlpatterns = [
    path('',views.index,name="index"),
    path('listaProdutor/',views.listaProd,name="Lista_Produtores"),
    path("produtor-detalhe/<int:id>",views.produtor_detalhe,name="produtor_detalhe"),
    path("adicionarProdutor/",views.criarProdutor,name="adicionarProdutor"),
    path('produtor-atualiza/<int:id>',views.produtor_atualiza,name="produtor_atualiza"),
    path('produtor-exclui/<int:id>', views.produtor_exclui, name='produtor_exclui'),
    path('terreno-cria/<int:id>', views.terreno_cria, name="terreno_cria"),
    path('terreno-detalhe/<int:id>', views.terreno_detalhe, name="terreno_detalhe"),
    path('terreno-atualiza/<int:id>', views.terreno_atualiza, name="terreno_atualiza"),
    path('terreno-exclui/<int:id>', views.terreno_exclui, name="terreno_exclui"),
    path('talhao-cria/<int:id>', views.talhao_cria, name="talhao_cria"),
    path('talhao-detalhe/<int:id>', views.talhao_detalhe, name="talhao_detalhe"),
    path('talhao-atualiza/<int:id>', views.talhao_atualiza, name="talhao_atualiza"),
    path('talhao-exclui/<int:id>', views.talhao_exclui, name="talhao_exclui"),
    path('exportar/produtores/', views.exportar_excel_coordenador, name='exportar_excel_coordenador'),

    path('api/autenticar/', views.api_autenticar_produtor, name="api_autenticar_produtor"),
    path('api/produtor/<str:email>/', views.api_enviar_produtor, name="api_enviar_produtor"),
 
    path("importar-servicos/", views.importar_servicos_view, name="importar_servicos"),

    path('servicos/', views.visualizar_servicos, name='listar-servicos'),
    path('servicos/exportar/', views.exportar_servicos_excel, name='exportar-servicos'),
    path('servicos/produtor/<str:email>/', views.servicos_por_produtor, name='servicos-produtor'),
]