import { saveOfflineService, getOfflineServices, deleteOfflineService } from "./db.js";

document.addEventListener('DOMContentLoaded', () => {
    let servicoIndex = 1;
    // --- REQUISIÇÃO À API PARA OBTER TALHÕES ---
    if (typeof produtorEmail !== 'undefined') {
    // Substitua a chamada atual por:
fetch(`/api/talhoes/${produtorEmail}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
  })
//   .then(data => {
//     if (!data.terrenos) {
//       throw new Error('Estrutura de dados inválida: falta propriedade terrenos');
//     }
    
//     const talhoes = [];
//     data.terrenos.forEach(terreno => {
//       terreno.talhoes.forEach(t => {
//         talhoes.push({ id: t.id, nome: t.nome });
//       });
//     });

//     const select = document.getElementById('talhao-0');
//     if (select) {
//       select.innerHTML = '<option value="" disabled selected>Selecione um talhão</option>';
//       talhoes.forEach(t => {
//         const option = document.createElement('option');
//         option.value = t.id;
//         option.textContent = t.nome;
//         select.appendChild(option);
//       });
      
//       // Adicione este log para debug
//       console.log('Talhões carregados:', talhoes);
//     }
//   })
    .then(data => {
        if (!data.terrenos) throw new Error('Estrutura de dados inválida');
    
        const select = document.getElementById('talhao-0');
        if (select) {
            select.innerHTML = '<option value="" disabled selected>Selecione um talhão</option>';
        
            data.terrenos.forEach(terreno => {
                terreno.talhoes.forEach(t => {
            // Aqui enviamos o nome como value também
                    const option = new Option(t.nome, t.nome); // Note que usamos t.nome como value
                    option.dataset.id = t.id; // Guardamos o ID como data-attribute se precisar
                    select.add(option);
                });
            });
        }
    })
  .catch(err => {
    console.error('Erro ao carregar talhões:', err);
    
    // Feedback visual para o usuário
    const select = document.getElementById('talhao-0');
    if (select) {
      select.innerHTML = `
        <option value="" disabled selected>
          Erro ao carregar talhões. Recarregue a página.
        </option>
      `;
    }
    
    // Opcional: exibir notificação para o usuário
    alert('Não foi possível carregar os talhões. Por favor, tente novamente.');
  });
}

    let servicoParaRemover = null; 

    const confirmModal = document.getElementById('confirm-modal');
    const btnConfirmarRemocao = document.getElementById('modal-btn-confirm');
    const btnCancelarRemocao = document.getElementById('modal-btn-cancel');

    // --- LÓGICA PRINCIPAL COM DELEGAÇÃO DE EVENTOS ---
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('#add-servico-btn')) {
            adicionarServico();
        }
        if (e.target.matches('.add-produto-btn')) {
            adicionarItemRepetivel(e.target, 'produtos-list', 'Produto');
        }
        if (e.target.matches('.add-trabalhador-btn')) {
            adicionarItemRepetivel(e.target, 'trabalhadores-list', 'Trabalhador');
        }
        if (e.target.matches('.remove-item-btn:not(.remove-servico-btn)')) {
            removerSubItem(e.target);
        }
        if (e.target.matches('.remove-servico-btn')) {
            servicoParaRemover = e.target.closest('.servico-item');
            confirmModal.classList.add('show');
        }
        if (e.target.matches('.stepper-btn')) {
            handleStepper(e.target);
        }
        if (e.target.closest('.select-box')) {
            toggleCheckboxes(e.target.closest('.select-box'));
        }
    });
    
    document.body.addEventListener('change', (e) => {
        if (e.target.matches('.checkboxes-container input[type="checkbox"]')) {
            updateSelectBoxText(e.target);
        }
    });
    
    document.body.addEventListener('keyup', (e) => {
        if (e.target.matches('.multiselect-search')) {
            filterOptions(e.target);
        }
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.multiselect-container')) {
            document.querySelectorAll('.checkboxes-container.show').forEach(container => {
                container.classList.remove('show');
            });
        }
    });

    btnConfirmarRemocao.addEventListener('click', () => {
        if (servicoParaRemover) {
            const divisorAnterior = servicoParaRemover.previousElementSibling;
            if (divisorAnterior && divisorAnterior.tagName === 'HR') {
                divisorAnterior.remove();
            }
            servicoParaRemover.remove();
            servicoParaRemover = null;
            atualizarTitulosServicos();
        }
        confirmModal.classList.remove('show');
    });

    btnCancelarRemocao.addEventListener('click', () => {
        servicoParaRemover = null;
        confirmModal.classList.remove('show');
    });

    confirmModal.addEventListener('click', (e) => {
        if(e.target === confirmModal) {
            servicoParaRemover = null;
            confirmModal.classList.remove('show');
        }
    });

    const firstDateInput = document.getElementById('data-0');
    if (firstDateInput && !firstDateInput.value) {
        firstDateInput.value = new Date().toISOString().split('T')[0];
    }

    // --- FUNÇÕES ---

    function adicionarServico() {
        const container = document.getElementById('servicos-container');
        const template = container.querySelector('.servico-item');
        const clone = template.cloneNode(true);

        clone.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
            else input.value = '';
        });
        clone.querySelectorAll('.produtos-list .repeatable-item:not(:first-child)').forEach(item => item.remove());
        clone.querySelectorAll('.trabalhadores-list .repeatable-item:not(:first-child)').forEach(item => item.remove());
        clone.querySelectorAll('.placeholder').forEach(el => {
            const containerId = el.id.replace('select-box-text', 'checkboxes-container');
            const placeholder = getPlaceholderText(containerId);
            el.textContent = placeholder;
            el.classList.add('placeholder');
        });

        updateAttributes(clone, servicoIndex);
        
        clone.querySelector('.servico-item-title').textContent = `Serviço ${servicoIndex + 1}`;

        const divider = document.createElement('hr');
        divider.className = 'form-divider';
        container.appendChild(divider);
        container.appendChild(clone);

        const newDateInput = document.getElementById(`data-${servicoIndex}`);
        if(newDateInput) newDateInput.value = new Date().toISOString().split('T')[0];

        servicoIndex++;
    }
    
    function atualizarTitulosServicos() {
        const servicos = document.querySelectorAll('.servico-item');
        servicos.forEach((servico, index) => {
            servico.querySelector('.servico-item-title').textContent = `Serviço ${index + 1}`;
        });
    }

    function adicionarItemRepetivel(button, listClass, titlePrefix) {
        const servicoItem = button.closest('.servico-item');
        const list = servicoItem.querySelector(`.${listClass}`);
        const template = list.querySelector('.repeatable-item');
        const clone = template.cloneNode(true);
        
        clone.querySelectorAll('input').forEach(input => input.value = '');
        const itemCount = list.querySelectorAll('.repeatable-item').length;
        clone.querySelector('.repeatable-item-title').textContent = `${titlePrefix} ${itemCount + 1}`;
        
        const currentServicoIndex = servicoItem.querySelector('[name*="[data]"]').name.match(/\[(\d+)\]/)[1];
        clone.querySelectorAll('input, select').forEach(input => {
            const name = input.getAttribute('name');
            if (name) {
                input.name = name.replace(`[${titlePrefix.toLowerCase()}s][0]`, `[${titlePrefix.toLowerCase()}s][${itemCount}]`);
            }
            const id = input.getAttribute('id');
            if(id) {
                const newId = id.replace('-0-0', `-${currentServicoIndex}-${itemCount}`);
                input.id = newId;
                const label = clone.querySelector(`label[for="${id}"]`);
                if(label) label.htmlFor = newId;
            }
        });

        list.appendChild(clone);
    }

    function removerSubItem(button) {
        const itemToRemove = button.closest('.repeatable-item');
        if (itemToRemove) {
            const list = itemToRemove.parentElement;
            itemToRemove.remove();
            const items = list.querySelectorAll('.repeatable-item');
            const titlePrefix = list.classList.contains('produtos-list') ? 'Produto' : 'Trabalhador';
            items.forEach((item, index) => {
                item.querySelector('.repeatable-item-title').textContent = `${titlePrefix} ${index + 1}`;
            });
        }
    }

    function updateAttributes(element, newIndex) {
        element.querySelectorAll('*[id], *[name], *[for]').forEach(el => {
            ['id', 'name', 'for'].forEach(attr => {
                const value = el.getAttribute(attr);
                if (value) {
                    el.setAttribute(attr, value.replace(/\[0\]/g, `[${newIndex}]`).replace(/-0/g, `-${newIndex}`));
                }
            });
        });
    }

    function handleStepper(button) {
        const input = button.parentElement.querySelector('.stepper-input');
        const step = parseFloat(input.step) || 1;
        let value = parseFloat(input.value) || 0;
        
        if (button.dataset.action === 'increment') {
            value += step;
        } else {
            value = Math.max(parseFloat(input.min) || 0, value - step);
        }
        
        input.value = (step < 1) ? value.toFixed(2) : value.toFixed(0);
    }

    function toggleCheckboxes(selectBox) {
        const container = selectBox.closest('.multiselect-container');
        const checkboxesContainer = container.querySelector('.checkboxes-container');
        checkboxesContainer.classList.toggle('show');
    }

    function updateSelectBoxText(checkbox) {
        const container = checkbox.closest('.checkboxes-container');
        const textElement = container.closest('.multiselect-container').querySelector('.select-box span:first-child');
        const placeholder = getPlaceholderText(container.id);
        
        const selected = Array.from(container.querySelectorAll('input:checked'))
            .map(cb => cb.parentElement.textContent.trim());
            
        if (selected.length > 0) {
            textElement.textContent = selected.join(' + ');
            textElement.classList.remove('placeholder');
        } else {
            textElement.textContent = placeholder;
            textElement.classList.add('placeholder');
        }
    }

    function filterOptions(input) {
        const filter = input.value.toLowerCase();
        const container = input.closest('.checkboxes-container');
        container.querySelectorAll('label').forEach(label => {
            const text = label.textContent.toLowerCase();
            label.style.display = text.includes(filter) ? '' : 'none';
        });
    }

    function getPlaceholderText(containerId) {
        if (containerId.includes('talhao')) return 'Selecione o(s) talhão(ões)';
        if (containerId.includes('servico')) return 'Selecione o(s) serviço(s)';
        return 'Selecione';
    }

    // --- LÓGICA DE SINCRONIZAÇÃO EM SEGUNDO PLANO (PWA) ---
    const form = document.querySelector('.add-service-form');
    const offlineMessage = document.getElementById('offline-message');
    
    // Escuta o evento de submissão do formulário
    form.addEventListener('submit', async (event) => {
        // Interrompe o envio padrão do formulário
        event.preventDefault();

        // Checagem de validade do formulário para evitar envios vazios
        if (!form.checkValidity()) {
            return;
        }

        // Verifica se a aplicação está offline
        if (!navigator.onLine) {
            // Se estiver offline, prepara os dados do formulário
            const formData = new FormData(form);
            const rawData = Object.fromEntries(formData.entries());
            const serviceData = { servicos: [] };
            
            // Lógica para estruturar os dados do formulário corretamente em um objeto
            const parsedServices = {};
            for (const [key, value] of Object.entries(rawData)) {
                const match = key.match(/^servicos\[(\d+)\]\[(\w+)(?:\[(\d+)\])?(?:\[(\w+)\])?(?:\[(\d+)\])?/);
                if (match) {
                    const [, index, field, subIndex, subField] = match;
                    if (!parsedServices[index]) parsedServices[index] = {};
                    if (subIndex !== undefined && subField !== undefined) {
                        if (!parsedServices[index][field]) parsedServices[index][field] = [];
                        if (!parsedServices[index][field][subIndex]) parsedServices[index][field][subIndex] = {};
                        parsedServices[index][field][subIndex][subField] = value;
                    } else if (subIndex !== undefined) {
                        if (!parsedServices[index][field]) parsedServices[index][field] = [];
                        parsedServices[index][field][subIndex] = value;
                    } else {
                        parsedServices[index][field] = value;
                    }
                }
            }
            serviceData.servicos = Object.values(parsedServices);

            // Salva os dados no IndexedDB
            await saveOfflineService(serviceData);
            console.log('Serviço salvo offline no IndexedDB!');
            offlineMessage.style.display = 'block';

            // Registra um evento de sincronização em segundo plano
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-new-services');
            
            // Redireciona o usuário para a lista de serviços para dar a sensação de sucesso
            window.location.href = '/servicos';
        } else {
            // Se estiver online, envia o formulário normalmente
            form.submit();
        }
    });

    // Função para tratar a sincronização quando a conexão voltar
    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data.type === 'SYNC_SUCCESS') {
        const { serviceId } = event.data;
        await deleteOfflineService(serviceId);
        console.log(`Serviço com ID ${serviceId} sincronizado e removido do IndexedDB.`);
        // Você pode mostrar uma notificação ao usuário aqui se desejar
      }
    });

});