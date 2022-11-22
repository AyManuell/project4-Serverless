import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic


const logger = createLogger('TodosAccess');
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess()



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
 
    return await todosAccess.createdTodoItem(newItem )
}