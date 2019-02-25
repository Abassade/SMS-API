const httpStatus = require('../constant/httpStatus');
const Response = require('../constant/response');
const utils = require('../lib/utils');

class SMS {
    constructor(logger, service){
        this.logger = logger
        this.service = service
    }

    sendSingleSMS(req, res){
        const {senderName, message, number} = req.body;

        if(!senderName || !message || !number){
            return Response.failure(res, {
				error: true,
				message: "senderName, message, and phoneNumber must be passed!",
			}, httpStatus.BadRequest);
        }

        if(senderName.toString().trim() == "" || 
        message.toString().trim() == "" || number.toString().trim() == ""){
            return Response.failure(res, {
				error: true,
				message: "senderName, message, and phoneNumber must not be empty!",
			}, httpStatus.BadRequest);
        }
        if(this.service.isValid(number)){
            this.logger.info("sanitized", this.service.sanitizedNumber(number));
            this.service.sendSingleSMS(senderName, message, this.service.sanitizedNumber(number))
            .then( message=>{
                this.logger.info(message);
                return Response.success(res, {
                    error: false,
                    message: message,
                    
                }, httpStatus.OK);
            })
            .catch( err=>{
                this.logger.info("error ===>", err);
                return Response.failure(res, {
                    error: true,
                    message: "SMS could not send",
                }, httpStatus.BadRequest);
                
            });
        }
    }
}
module.exports = SMS;
