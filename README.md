# User API Nedir?
User API Node JS öğrenme sürecinde geliştirdiğim ve geliştireceğim başka projelerde kullanmak için oluşturduğum basit bir REST API modelidir.

## Bu API Hangi İşlemleri Yapmanızı Sağlar ?
### Kullanıcı İşlemleri
1. Bu API ile bir kullanıcının sisteme üye olması sağlanır ve üye olan kullanıcıya hesabını etkinleştirmesi için 30 dakikalık bir aktivasyon kodu mail olarak gönderilir. Kullanıcı hesabını aktif etmeden hesabına giriş yapamaz. Eğer gönderilen erişim kodunun süresi dolarsa ve kullanıcı hesabına giriş yapmaya çalışırsa hesabı silinir.
2. Kullanıcının e-posta ve şifre bilgileri sınanarak uygulamaya giriş yapması sağlanır.
3. Kullanıcın şifresini unutması durumunda kullanıcıya içerisinde şifre sıfırlama linki bulunan bir mail gönderilir ve kullanıcı bu link ile şifresini yeniler.
4. Sisteme üye olan kullanıcıya varsayılan olarak "customer" rolü atanır.
### Rol işlemleri
1. Sisteme yeni rol eklenebilir.
2. Sistemde kayıtlı olan rol güncellenebilir. ("admin" ve "customer" rolü varsayılan olarak geldiği için güncellenemez.)
3. Sisteme kayıtlı roller silinebilir. ("admin" ve "customer" rolü varsayılan olarak geldiği için silinemez.)
4. Sisteme kayıtlı roller görüntülenebilir.

## Kullanılan Paketler : 
1. #### [Bcrypt](https://www.npmjs.com/package/bcrypt)
    ```npm i bcrypt@5.1.1```
2. #### [Express](https://www.npmjs.com/package/express)
     ```npm i express@4.19.2```
3. #### [Express Async Errors](https://www.npmjs.com/package/express-async-errors)
     ```npm i express-async-errors@3.1.1```
4. #### [Dotenv](https://www.npmjs.com/package/dotenv)
     ```npm i dotenv@16.4.5```
5. #### [Joi](https://www.npmjs.com/package/joi)
     ```npm i joi@17.12.3```
6. #### [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)
     ```npm i jsonwebtoken@89.0.2```
7. #### [Mongoose](https://mongoosejs.com/docs/guide.html)
     ```npm i mongoose@8.3.1```    
8. #### [Nodemoon](https://www.npmjs.com/package/nodemon)
     ```npm i nodemon@.3.1.0 --save-dev```  
9. #### [Cors](https://www.npmjs.com/package/cors)
     ```npm i cors@2.8.5```  
10. #### [Express Mongo Sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
     ```npm i express-mongo-sanitize@2.2.0```
11. #### [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
     ```npm i express-rate-limit@7.2.0```
12. #### [Moment](https://www.npmjs.com/package/moment)
     ```npm i moment@2.30.1```
13. #### [Nodemailer](https://www.nodemailer.com/)
     ```npm i nodemailer@6.9.13```
14. #### [Slugify](https://www.npmjs.com/package/slugify)
     ```npm i slugify@1.6.6```

## Uygulamanın Kullanımı
### Üye Olmak için
```
POST <your_localhost>/api/v1/register
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- name
- surname
- surname
- email
- phone
- password
### Giriş Yapmak için
```
POST <your_localhost>/api/v1/login
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- email
- password

NOT: Bu işlem için rate limit tanımlanmıştır. Yani aynı adresten çok fazla istek gelirse belirlenen süre boyunca API'ye tekrar istek atmanız engellenir.

Rate Limit ayarlarını değiştirmek için:
/src/middlewares/rateLimit.js
```javascript
const rateLimit=require("express-rate-limit");

const limiter=rateLimit({
    windowMs: 1000*60*5, //5 dakika boyunca istek atmayı engeller
    max:(req,res)=>{
        //req.url ye yeni rotalar ekleyerek rate limiti o sayfalar için de aktif edebilirsiniz  
        if(req.url=="/auth/login" || req.url=="/auth/register"){
            return 5 //5 hak tanınır
        }else{
            return 100 //diğer sayfalar için 100 hak tanınır
        }
    },
    message:{
        success: false,
        message: "Too many request, please wait 5 minute and try again"
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports=limiter;
```
### Hesabı Aktifleştirmek için
```
PUT <your_localhost>/api/v1/activate-user/:token
```
Token bilgisi kullanıcıya gönderilen mailde otomatik olarak doldurulmuş olarak gönderilir.

Bu işlem için gönderilmesi zorunlu alanlar: 
- token
### Şifremi Unuttum işlemi için
```
PUT <your_localhost>/api/v1/forget-password
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- email
### Şifre Yenilemek için
```
POST <your_localhost>/api/v1/reset-password/:resetToken
```
resetToken bilgisi kullanıcıya gönderilen mailde link ile gönderilir. Linke tıklandığında şifre değiştirme sayfasına yönlendirilir.

Bu işlem için gönderilmesi zorunlu alanlar: 
- resetToken
- password
### Hesap Bilgilerini Görmek için
```
GET <your_localhost>/api/v1/account
```
Bu işlemi görüntüleyebilmek için uygulamada oturum açmanız gerekmektedir. Oturum açmayan kullanıcılar bu kısma erişemez. Uygulamada oturum açıp açmadığınız 
```javascript
req.header.authorization
```
özelliğiyle sınanır. Detaylı kullanım için bknz: /src/middlewares/isAccess.js>isAuth

Rol işlemlerine erişebilmek için uygulamada oturum açmanız ve "admin" rolünde olmanız gerekmektedir.

Uygulama kurulurken kendinizi "admin" olarak eklemek için /src/db/dummy-data.js
dosyasında :
```javascript
let privateUser=await User.findOne({email: "<your_email>"}).select("_id roles");
//----------Create User------------
if(!privateUser){
        const hashedPassword=await bcrypt.hash("<your_password>",10);
        privateUser=await User.create({
            name: "<your_name>",
            surname: "<your_surname>",
            email: "<your_email>",
            phone: "<your_phone_number>",
            password: hashedPassword,
            isActive: true //bu kısmı false yaparsanız hesabınıza giriş yapamazsınız
        });
        console.log("Private user added successfully");
}
```
bu kodu kendi bilgilerinize göre güncelledikten sonra app.js dosyasında
```javascript
(async ()=>{
    await require("./src/db/dbConnection")();
    await require("./src/db/dummy-data")();
})();
```
kodunu çalıştırarak uygulamaya giriş yapabilirsiniz. 
NOT: Uygulamanıza kaydolduktan sonra aşağıdaki kodu gösterildiği gibi yorum satırına almanız tavsiye edilir
```javascript
    //await require("./src/db/dummy-data")();
```

### Rol Eklemek için
```
POST <your_localhost>/api/v1/role
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- roleName

### Rol Güncellemek için
```
PUT <your_localhost>/api/v1/role/:roleId
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- roleName

### Rol Silmek için
```
DELETE <your_localhost>/api/v1/role/:roleId
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- roleId
### Rol Görüntülemek için
```
GET <your_localhost>/api/v1/role/:roleId
```
Bu işlem için gönderilmesi zorunlu alanlar: 
- roleId
### Tüm Rolleri Görüntülemek için 
```
GET <your_localhost>/api/v1/role
``` 
### Kullanıcı Bilgilerini Güncellemek için
```
PUT <your_localhost>/api/v1/user/:userId
``` 
Bu işlemi gerçekleştirebilmek için sistemde oturum açmanız ve admin rolünde olmanız gerekmektedir.
Bu işlem için gönderilmesi zorunlu alanlar: 
- userId 
## Proje Kurulumu :
* Projeyi bilgisayarınızda çalıştırmak için klonlayın.
* Yukarıda belirtilen paketleri projeniz için kurun.
* Ana klasör dizininde ".env" adlı bir klasör açın ve içerisine
    PORT=<your_port_number>
    DB_URI=<your_db_uri>
    JWT_SECRET_KEY=<your_secret_key>
    JWT_EXPIRES_IN=<your_secret_key_time> (Örneğin: "1h")
     EMAIL_HOST=<your_email_host_smtp>
     EMAIL_PORT=<your_email_port>
     EMAIL_CIPHERS=<your_email_ciphers>
     EMAIL_ADRESS=<your_email_adress>
     EMAIL_USERNAME=<your_email_username>
     EMAIL_PASSWORD=<your_email_password>
    bu bilgileri kendinize göre doldurarak yazın
* Terminalinize ```npm run dev``` yazarak uygulamanızı developer modunda çalıştırabilirsiniz.
* API'nizi başka uygulamalara açmak için /src/helpers/cors.js dosyasına giderek
```javascript
     //bu kısma "tam" erişim izni vermek istediğiniz uygulamaların adresini yazabilirsiniz 
     let whiteList=["http://127.0.0.1:5000","http://127.0.0.1:54438"];

```



## Hata ve Öneriler İçin:
[Bana Ulaş](mailto:yasinaacar@outlook.com)
