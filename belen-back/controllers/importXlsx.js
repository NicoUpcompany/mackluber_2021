require('dotenv').config();
var XLSX = require('xlsx');
var path = require('path');
const nodemailer = require("nodemailer");

function xlsxToJson(req, res) {
    var upEmail = process.env.EMAIL;
    var upPassword = process.env.PASSWORD_EMAIL;

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: upEmail,
            pass: upPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var pathXLSX = path.resolve(__dirname, '../uploads/sponsors.xlsx');
    var workbook = XLSX.readFile(pathXLSX);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(async function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        data.shift();
        data.shift();
        
        for (let i = 0; i < data.length; i++) {

            var mailOptions = {
                from: `Happy Talk UKM <${upEmail}>`,
                to: data[i].Email,
                subject: 'Te invitamos a participar en Happy Talk UKM',
                text: 'Te invitamos a participar en Happy Talk UKM',
                html: `
                <html>
    <head>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
    <title>UKM</title>
    </head>
    <body style="background:#f6f6f6;">
		<div style="background:#202020;color:#fff; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">
        
            <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0;">
				<tr>
					<th align="center" width="100%" style="color:#2d2d2d;"> 
						<img src="https://upwebinar.cl/mailing/ukm/img1.jpg" width="100%"/>
                    </th>
                </tr>
            </table>

            <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0;">
            	<tr>
            		<td width="100%" align="center">
            			<p style="color: #fff;font-size: 18px;margin-top: 40px;margin-bottom: 0px;">Último Kilómetro te invita al encuentro virtual</p>
						<p style="color: #fff;font-size: 30px;text-transform: uppercase;margin-top: 0px;"><strong>happy talk ukm</strong></p>
            		</td>
            	</tr>
            </table>
            

            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:0;margin-bottom:0;">
				<tr>
					<td width="30%">&nbsp;</td>
					<td align="center" width="40%" style="padding: 50px 00px;text-align: center;"> 
						
						<a href="https://ukmtalk.cl/" style="background: #d32126;color: #fff;padding: 20px 50px;text-decoration: none;text-transform: uppercase;display: inline-block;margin: 0 auto;font-size: 14px;">inscribete aquí</a>
						
                    </td>
                    <td width="30%">&nbsp;</td>
				</tr>
            </table>

            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#252525;margin-top:0;margin-bottom:0;padding: 30px 50px;">
				<tr style="padding: 0 0 50px;">
					<td align="right" valign="center" width="33%" style="color:#2d2d2d;"> 
						<a href="https://www.instagram.com/ultimokmchile/">
							<img src="https://upwebinar.cl/mailing/ukm/instagram.png" width="20" style="margin-bottom: -7px;"/>
						</a>
						<span style="color: #fff;font-size: 14px;"></span>
                    </td>
                    <td align="center" width="30%" style="color:#2d2d2d;"> 
                    	<a href="https://www.facebook.com/ultimokmchile">
							<img src="https://upwebinar.cl/mailing/ukm/facebook.png" width="20" style="margin-bottom: -7px;"/>
						</a>
						<span style="color: #fff;font-size: 14px;"></span>
                    </td>
                    <td align="left" width="33%" style="color:#2d2d2d;"> 
                    	<a href="https://www.youtube.com/channel/UCdyg_sCcKwmr6fdBMI57hjg?view_as=subscriber">
							<img src="https://upwebinar.cl/mailing/ukm/youtube.png" width="20" style="margin-bottom: -7px;"/>
						</a>
						<span style="color: #fff;font-size: 14px;"></span>
                    </td>
				</tr>
            </table>
        </div>
    </body>
</html>

                `
            };
            let info = await transporter.sendMail(mailOptions);
            console.log(info)
        }
        res.status(200).send({message: `Mailing exitoso`});
        
    });
}

module.exports = {
    xlsxToJson
}; 