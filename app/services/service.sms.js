const Nexmo = require('nexmo');
const config = require('../config/settings');

const nexmo = new Nexmo({
  apiKey: config.nexmoKey,
  apiSecret: config.nexmoSecret
});


class SMS {
    constructor(logger){
        this.logger = logger
    }
    
/**
* @param phoneNumber check if the number is valid to be sent SMS
*/
    isValid(phoneNumber){
        let number = phoneNumber.toString().trim();
        if(number.length === 11 ||
        number.length === 13){
            return true;
        }
        if(number.includes("+") && number.length === 14){
            return true;
        }
        return false;
    }

    /**
    * @param phoneNumber sanitize number
    */
    sanitizedNumber(phoneNumber){
        if(phoneNumber.length > 1 && typeof(phoneNumber)  === Array){
            let sanitizedPhoneNumber = [];
            phoneNumber.forEach(async element => {
                if(element.startsWith("+")){
                   await sanitizedPhoneNumber.push(element.replace("+", ""));
                    return sanitizedPhoneNumber;
                }
                else{
                    return phoneNumber;
                }
            });
        }
        let number = phoneNumber.toString().trim();
        if(number.startsWith("+")){
            return number.replace("+", "");
        }
        else{
            return number;
        }
    }

 /**
 * @param senderName : string => name to message sender that would appear on a receiver's phone
 * @param message : string => message to be sent to the numbers
 * @param phoneNumbers: an array of numbers to receive the message
 */
    sendSingleSMS(senderName, message, phoneNumber){
        return new Promise( (resolve, reject)=>{
            let number = phoneNumber.startsWith('0') ? phoneNumber.replace('0', '234') : phoneNumber;
            nexmo.message.sendSms(senderName, number, message, (err, result) => {
                if(!err){
                    if(result){
                        resolve(result);
                    }
                }
                else{
                    this.logger.info(err);
                    reject(err);
                }
                });
                
        });

    }

    /**
 * @param senderName : string => name to message sender that would appear on a receiver's phone
 * @param message : string => message to be sent to the numbers
 * @param phoneNumbers: an array of numbers to receive the message
 */
   sendBulkSMS (senderName, message, phoneNumbers){
       return new Promise( (resolve, reject)=>{
           //Loop through each number and send sms message to
            for (let i = 0; i < phoneNumbers.length; i++) {
                let number = phoneNumbers[i];

                // ensure number starts with country code (in this case, Nigeria (234))
                number = number.startsWith('0') ? number.replace('0', '234') : number;
                
                nexmo.message.sendSms(senderName, number, message, (err, result) => {
                    if (err){
                        this.logger.info(err);
                        reject(err);
                    }
                    //resolve(result);
                    //after the message has been successfully sent to the last number, send a server response
                    if(i === phoneNumbers.length - 1){
                        resolve(result);
                        this.logger.info(result);
                    }
                    else{
                        this.logger.info("something wierld happened");
                    }
                });
            }
        });
    }
}

module.exports = SMS;