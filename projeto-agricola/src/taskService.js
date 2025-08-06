// src/taskService.js

class TaskService {
  constructor() {
    this.tasks = [];
  }

  /**
   * Adiciona uma nova tarefa à lista.
   * @param {string} description - Descrição da tarefa.
   * @returns {object} - Objeto da tarefa adicionada.
   */
  addTask(description) {
    if (!description || typeof description !== 'string' || !description.trim()) {
      throw new Error('Descrição inválida');
    }

    const task = {
      id: Date.now().toString(), // id simples baseado em timestamp
      description: description.trim(),
      completed: false
    };

    this.tasks.push(task);
    return task;
  }

  /**
   * Retorna todas as tarefas registradas.
   * @returns {Array} - Lista de tarefas.
   */
  listTasks() {
    return [...this.tasks]; // cópia para evitar mutações externas
  }
}

module.exports = TaskService;