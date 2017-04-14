/**
 * Created by sergey on 02.03.2017.
 */
exports.ParamsError =  function (details) {
    this.error = {
        params:details.map((item) => { return {name:item.path, message: item.message, code: item.type }  }),
        type:"invalid_param_error",
        message:"Invalid data parameters"

    }
}

exports.PageNotFoundError = function (url) {
    this.error = {
        type:"invalid_request_error",
        message:`Unable to resolve the request ${url}.`
    }
};