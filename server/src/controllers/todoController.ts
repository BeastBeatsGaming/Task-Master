import { Response, NextFunction } from "express";
import Todo, { ITodo, TODO_STATUS } from "../models/Todo"; // Import TODO_STATUS
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // Import AuthenticatedRequest

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private
export const getTodos = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("User not authenticated"); // Should be caught by protect middleware
    const todos = await Todo.find({ user: req.user._id }).sort({
      targetDate: 1,
      createdAt: -1,
    });
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a todo for the logged-in user
// @route   POST /api/todos
// @access  Private
export const createTodo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { text, description, targetDate } = req.body;
  if (!req.user) return next(new Error("User not authenticated"));

  if (!text) {
    res.status(400);
    return next(new Error("Text is required for a todo"));
  }

  // Validate targetDate - cannot be in the past (only day, not time)
  if (targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day
    const inputTargetDate = new Date(targetDate);
    inputTargetDate.setHours(0, 0, 0, 0); // Normalize input targetDate
    if (inputTargetDate < today) {
      res.status(400);
      return next(new Error("Target date cannot be in the past."));
    }
  }

  try {
    const newTodoData: Partial<ITodo> = {
      user: req.user._id,
      text,
      description: description || undefined, // Only set if provided
      targetDate: targetDate ? new Date(targetDate) : null,
      status: TODO_STATUS.IN_PROGRESS, // Default status
      completedDate: null,
    };
    const todo = await Todo.create(newTodoData);
    res.status(201).json(todo);
  } catch (err: any) {
    // Catch Mongoose validation errors
    if (err.name === "ValidationError") {
      res.status(400);
    }
    next(err);
  }
};

// @desc    Get single todo (ensure it belongs to the user)
// @route   GET /api/todos/:id
// @access  Private
export const getTodoById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("User not authenticated");
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }
    // Check if the todo belongs to the logged-in user
    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error("Not authorized to access this todo");
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a todo (ensure it belongs to the user)
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { text, description, targetDate, status } = req.body;
  if (!req.user) return next(new Error("User not authenticated"));

  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }
    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this todo");
    }

    if (text !== undefined) todo.text = text;
    if (description !== undefined) todo.description = description;

    if (targetDate !== undefined) {
      if (targetDate === null) {
        todo.targetDate = null;
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputTargetDate = new Date(targetDate);
        inputTargetDate.setHours(0, 0, 0, 0);
        if (
          inputTargetDate < today &&
          status !== TODO_STATUS.COMPLETED &&
          status !== TODO_STATUS.CANCELLED
        ) {
          // Allow past target for completed/cancelled
          res.status(400);
          return next(
            new Error(
              "Target date cannot be set to the past for an active task."
            )
          );
        }
        todo.targetDate = inputTargetDate;
      }
    }

    if (status !== undefined) {
      if (!Object.values(TODO_STATUS).includes(status as TodoStatusType)) {
        res.status(400);
        throw new Error("Invalid status value.");
      }
      todo.status = status as TodoStatusType;
      if (status === TODO_STATUS.COMPLETED && !todo.completedDate) {
        todo.completedDate = new Date();
      } else if (status !== TODO_STATUS.COMPLETED) {
        todo.completedDate = null; // Clear completedDate if not completed
      }
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      res.status(400);
    }
    next(err);
  }
};

// @desc    Delete a todo (ensure it belongs to the user)
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("User not authenticated");
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }
    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this todo");
    }
    await todo.deleteOne();
    res.json({ success: true, message: "Todo removed" });
  } catch (err) {
    next(err);
  }
};
