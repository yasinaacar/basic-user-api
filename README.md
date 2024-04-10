# User API Nedir?
User API Node JS öğrenme sürecinde geliştirdiğim ve geliştireceğim başka projelerde kullanmak için oluşturduğum basit bir REST API modelidir.

## Bu API Hangi İşlemleri Yapmanızı Sağlar ?
1. Bu API ile bir kullanıcının sisteme üye olması sağlanır ve üye olan kullanıcıya hesabını etkinleştirmesi için 30 dakikalık bir aktivasyon kodu mail olarak gönderilir. Kullanıcı hesabını aktif etmeden hesabına giriş yapamaz. Eğer gönderilen erişim kodunun süresi dolarsa ve kullanıcı hesabına giriş yapmaya çalışırsa hesabı silinir.
2. Kullanıcının e-posta ve şifre bilgileri sınanarak uygulamaya giriş yapması sağlanır.

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
8. #### [Nodemoon](npm i nodemon)
     ```npm i nodemon@.3.1.0 --save-dev```    

## Proje Kurulumu :
* Projeyi bilgisayarınızda çalıştırmak için klonlayın.
* Yukarıda belirtilen paketleri projeniz için kurun.
* Ana klasör dizininde ".env" adlı bir klasör açın ve içerisine
    PORT=<your_port_number>
    DB_URI=<your_db_uri>
    JWT_SECRET_KEY=<your_secret_key>
    bu bilgileri kendinize göre doldurarak yazın
* Terminalinize ```npm run dev``` yazarak uygulamanızı developer modunda çalıştırabilirsiniz.



## Hata ve Öneriler İçin:
[Bana Ulaş](mailto:yasinaacar@outlook.com)
