import { TodosAccess } from '../dataLayer/todoAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';

//import * as createError from 'http-errors'

// TODO: Implement businessLogic


const logger = createLogger('TodosAccess');
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess()

//GetTodos Func

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('----Calling Get to do function for you----')
    return todosAccess.getAllTodos(userId)

}

// CreateTodo Func
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem>
{
    logger.info('-----Calling CreateTodo Function---------')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = attachmentUtils.getUrlAttachment(todoId) //s3 attachment URL
    const newItem = {
        userId,
        todoId,
        createdAt,
        attachmentUrl: attachmentUrl, 
        done: false,
        ...newTodo
    }
 
    return await todosAccess.createTodoItem(newItem)
}


//Update todo func

export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
    logger.info('---Calling UpdateTodo--------')
    return  todosAccess.updateTodoItem(todoId,userId,todoUpdate)
}


//Delete Todo func

export async function deleteTodo(userId: string, todoId: string): Promise<string> {
    logger.info('----Calling DeleteTodo--------')
    return todosAccess.deleteTodoItem(todoId, userId)
    
}

 

//Create Attrachment Presigned URL func

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('----Calling Create Attachment Function------', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}