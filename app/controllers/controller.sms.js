const httpStatus = require('../constant/httpStatus');
const Response = require('../constant/response');
const utils = require('../lib/utils');

class SMS {

    /**
     * 
     * @param {*} logger 
     * @param {*} service 
     */
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
                    message: "SMS could not be sent",
                }, httpStatus.BadRequest);
                
            });
        }
    }


    sendBulkSMS(req, res){
        const {senderName, message, numbers} = req.body;

        console.log('numbers', numbers);

        if(!senderName || !message || !numbers){
            return Response.failure(res, {
				error: true,
				message: "senderName, message, and numbers must be passed!",
			}, httpStatus.BadRequest);
        }

        // if(typeof(numbers) !== Array || typeof(numbers) !== Object){
        //     return Response.failure(res, {
		// 		error: true,
		// 		message: "numbers must be of type Array for bulk SMS",
		// 	}, httpStatus.BadRequest);
        // }

        if(senderName.toString().trim() == "" || 
        message.toString().trim() == "" || numbers.length<1){
            return Response.failure(res, {
				error: true,
				message: "senderName, message, and numbers must not be empty!",
			}, httpStatus.BadRequest);
        }
        if(this.service.isValid(numbers[0])){
            this.logger.log("sanitized", this.service.sanitizedNumber(numbers[0]));
            this.service.sendBulkSMS(senderName, message, numbers)
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
                    message: "SMS could not be sent",
                }, httpStatus.BadRequest);
                
            });
        }
    }
}
module.exports = SMS;
