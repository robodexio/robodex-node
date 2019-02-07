// Specification: https://www.jsonrpc.org/specification

const errors = {
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603
}

module.exports = async (ws, msg, methods) => {
    function send(msg) {
        ws.send(JSON.stringify(msg))
    }

    function success(id, result) {
        send({
            jsonrpc: '2.0',
            result,
            id
        })
    }

    function error(id, error) {
        send({
            jsonrpc: '2.0',
            error,
            id
        })
    }

    try {
        msg = JSON.parse(msg)
    } catch (err) {
        console.error(err)
        return error(null, {
            code: errors.PARSE_ERROR,
            message: 'Parse error'
        })
    }

    if (!(msg.jsonrpc && msg.jsonrpc === '2.0')) {
        return error(null, {
            code: errors.INVALID_REQUEST,
            message: 'Invalid Request'
        })
    }

    if (!(typeof msg.method === 'string')) {
        return error(null, {
            code: errors.INVALID_REQUEST,
            message: 'Invalid Request'
        })
    }

    if (msg.params && typeof msg.params !== 'object') {
        return error(null, {
            code: errors.INVALID_REQUEST,
            message: 'Invalid Request'
        })
    }

    const method = methods[msg.method]
    if (!msg.id) {
        if (method) {
            try {
                await method(msg.params)
            } catch (err) {
                console.error(err)
            }
        }
        return
    }

    if (!method) {
        return error(msg.id, {
            code: errors.METHOD_NOT_FOUND,
            message: 'Method not found'
        })
    }

    try {
        const result = await method(msg.params)
        return success(msg.id, result)
    } catch (err) {
        console.error(err)
        return error(msg.id, {
            code: err.code,
            message: err.message,
            data: err.data
        })
    }
}
