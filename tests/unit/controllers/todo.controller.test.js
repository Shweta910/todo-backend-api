const {
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  restoreTodo,
  getTodoStats,
  toggleFavorite,
  getOverdueTodos,
  getDashboard,
} = require('../../../src/controllers/todo.controller');

const {
  createTodoService,
  getTodoByIdService,
  updateTodoService,
  deleteTodoService,
  restoreTodoService,
  getTodoStatsService,
  toggleFavoriteService,
  getOverdueTodosService,
  getDashboardService,
} = require('../../../src/services/todo.service');

jest.mock('../../../src/services/todo.service');

describe('Todo Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: {
        _id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should create todo successfully', async () => {
    req.body = {
      title: 'Learn Jest',
      description: 'Testing controllers',
    };

    const todo = {
      _id: 'todo123',
      ...req.body,
    };

    createTodoService.mockResolvedValue(todo);

    await createTodo(req, res, next);

    expect(createTodoService).toHaveBeenCalledWith(req.body, req.user._id);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should fetch todo by id', async () => {
    req.params.id = 'todo123';

    const todo = {
      _id: 'todo123',
      title: 'Learn Jest',
    };

    getTodoByIdService.mockResolvedValue(todo);

    await getTodoById(req, res, next);

    expect(getTodoByIdService).toHaveBeenCalledWith('todo123', req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();
  });

  it('should update todo successfully', async () => {
    req.params.id = 'todo123';

    req.body = {
      title: 'Updated Todo',
    };

    const updatedTodo = {
      _id: 'todo123',
      title: 'Updated Todo',
    };

    updateTodoService.mockResolvedValue(updatedTodo);

    await updateTodo(req, res, next);

    expect(updateTodoService).toHaveBeenCalledWith(
      'todo123',
      req.user._id,
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should delete todo successfully', async () => {
    req.params.id = 'todo123';

    deleteTodoService.mockResolvedValue();

    await deleteTodo(req, res, next);

    expect(deleteTodoService).toHaveBeenCalledWith('todo123', req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should restore todo successfully', async () => {
    req.params.id = 'todo123';

    const restoredTodo = {
      _id: 'todo123',
      isDeleted: false,
    };

    restoreTodoService.mockResolvedValue(restoredTodo);

    await restoreTodo(req, res, next);

    expect(restoreTodoService).toHaveBeenCalledWith('todo123', req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should return todo statistics', async () => {
    const stats = {
      total: 10,
      completed: 6,
      pending: 4,
    };

    getTodoStatsService.mockResolvedValue(stats);

    await getTodoStats(req, res, next);

    expect(getTodoStatsService).toHaveBeenCalledWith(req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should toggle favorite successfully', async () => {
    req.params.id = 'todo123';

    const todo = {
      _id: 'todo123',
      title: 'Learn Jest',
      isFavorite: true,
    };

    toggleFavoriteService.mockResolvedValue(todo);

    await toggleFavorite(req, res, next);

    expect(toggleFavoriteService).toHaveBeenCalledWith('todo123', req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should return overdue todos', async () => {
    const overdueTodos = [
      {
        _id: '1',
        title: 'Todo 1',
      },
      {
        _id: '2',
        title: 'Todo 2',
      },
    ];

    getOverdueTodosService.mockResolvedValue(overdueTodos);

    await getOverdueTodos(req, res, next);

    expect(getOverdueTodosService).toHaveBeenCalledWith(req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it('should return dashboard data', async () => {
    const dashboard = {
      totalTodos: 20,
      completedTodos: 15,
      pendingTodos: 5,
      favoriteTodos: 3,
    };

    getDashboardService.mockResolvedValue(dashboard);

    await getDashboard(req, res, next);

    expect(getDashboardService).toHaveBeenCalledWith(req.user._id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });
});
