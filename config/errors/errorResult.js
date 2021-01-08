const success = {
    code: 200,
    message: "Successful"
}

const badRequest = {
    code: 400,
    message: "Bad Request"
}

const notFound = {
    code: 404,
    message: "Not Found"
}

const serverError = {
    code: 500,
    message: "Server Error"
}

const forbidden = {
    code: 403,
    message: "Not Permission"
}

const badGateway = {
    code: 502,
    message: "Bad Gateway"
}

const unauthorized = {
    code: 401,
    message: "Unauthorized"
}

module.exports = {
    success,
    badRequest,
    notFound,
    serverError,
    forbidden,
    badGateway,
    unauthorized
}