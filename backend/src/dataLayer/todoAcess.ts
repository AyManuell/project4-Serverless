import * as AWS from 'aws-sdk'
const AWSXRay = require ('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
//  import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ){}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('---Calling GetAllTodo Function-------')

        const outcome = await this.docClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = outcome.Items
        return items as TodoItem[]
    } 


    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('-----Calling CreateTodoItem Function------')

        const outcome = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        logger.info('---Created Todo Item---', outcome)

        return todoItem as TodoItem
    }


    async updateTodoItem(
        todoId: string, 
        userId: string,
        todoUpdate: TodoUpdate
        ):Promise<TodoUpdate>{
            logger.info('-------UpdateTo function called-----')

            const outcome = await this.docClient.update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name , dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ExpressionAttributeValues: {
                    ':name': todoUpdate.name,
                    ':dueDate': todoUpdate.dueDate,
                    ':done': todoUpdate.done
                },
                ReturnValues: 'ALL_NEW'
            })
            .promise()
            

            const updateTodoItem = outcome.Attributes
            logger.info('Todo Item updated', updateTodoItem)
            return updateTodoItem as TodoUpdate
           

    } 
    

    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('---Calling DeleteTodo------')

        const outcome = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info('Todo item deleted', outcome)
        return todoId as string

    }
}