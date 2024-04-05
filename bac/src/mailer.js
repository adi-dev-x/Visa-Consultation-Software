const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

//const { EMAIL, PASSWORD } = require('../env.js')
const EMAIL=''
const PASSWORD=''
class mailer{
    async getbill  (req, res) {

        const { userEmail } = req.body;
        const date=req.body.date;
        const amount=req.body.amount;
        const name=req.body.name;
        console.log("this is the details",date,amount,name)
    
        let config = {
            service : 'gmail',
            auth : {
                user: EMAIL,
                pass: PASSWORD
            }
        }
    
        let transporter = nodemailer.createTransport(config);
    
        let MailGenerator = new Mailgen({
            theme: "default",
            product : {
                name: "Integrateu",
                link : 'https://playful-pie-1d2361.netlify.app/index.html'
            }
        })
       
        let response = {
            
            body: {
                name : " "+name+", This is your mail For your Payment",
                intro: "Your bill has arrived!",
                table : {
                    data : [
                        {
                            item : "Payment regarding Application",
                            description: "Your documents have been approved and payment quote is given below,Pay the amount before "+date+" Please complete it as soon as possible",
                            price : "Rs"+amount+"",
                        }
                    ]
                },
                outro: "Looking forward to do more business"
            }
        }
    
        let mail = MailGenerator.generate(response)
    
        let message = {
            from : EMAIL,
            to : userEmail,
            subject: "Payment",
            html: mail
        }
    
        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email"
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
    
        // res.status(201).json("getBill Successfully...!");
    }
    async getAppdetails  (req, res) {
       console.log("thissssss",req);
        const { userEmail } = req.body;
       
        const password=req.body.password;
        const username=req.body.username;
        const name=req.body.name;
        console.log("this is the details",name)
    
        let config = {
            service : 'gmail',
            auth : {
                user: EMAIL,
                pass: PASSWORD
            }
        }
    
        let transporter = nodemailer.createTransport(config);
    
        let MailGenerator = new Mailgen({
            theme: "default",
            product : {
                name: "Please click here to login",
                link : 'https://playful-pie-1d2361.netlify.app/index.html'
            }
        })
       
        let response = {
            
            body: {
                name : " "+name+", This is your mail is to inform you that your application is selected here is your login credendial",
                intro: "Application approved",
                table : {
                    data : [
                        {
                            item : "Username",
                           
                            Username : ""+username+"",
                        },
                        {
                            item : "Password",
                           
                            Password : ""+password+"",
                        }
                    ]
                },
                outro: "Looking forward to do more business"
            }
        }
    
        let mail = MailGenerator.generate(response)
    
        let message = {
            from : EMAIL,
            to : userEmail,
            subject: "Application",
            html: mail
        }
    
        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email"
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
    
        // res.status(201).json("getBill Successfully...!");
    }
   

   async  sendEmailWithAttachment(pdfBuffer,email,project) {
	console.log("reached in sendEmailWithAttachment")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'adithyanunni258@gmail.com',
                pass: 'jgkxtnpzazdhwlvk'
            }
        });
    
        const mailOptions = {
            from: 'adithyanunni258@gmail.com',
            to: email,
            subject: 'Merged PDF File',
            text: 'Please find the merged PDF file attached.',
            attachments: [
                {
                    filename: ''+project+'.pdf',
                    content: pdfBuffer
                }
            ]
        };
    
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }



}
module.exports = {
   mailer
};
