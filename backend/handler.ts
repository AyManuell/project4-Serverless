"use strict";

module.exports.hello= async(event) => {
    return {
        statusCode: 200,
        body:JSON.stringify(
            {
                message: "Go Serverless 3. Successful",
                input: event,
            },
            null,
            2
        )
    };
};