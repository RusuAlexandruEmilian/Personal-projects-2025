const app = Vue.createApp({
    data() {
        return {
            message: 'Message from vue',
            emailWarning: false,
            passwordWarning: false,
            passwordVisible: false,
            wrongCredentialsWarning: false,
            warningMessage: ''
        }
    },

    methods: {
        formSubmit(){
            if(email.value === '' && password.value === ''){
               this.emailWarning = true;
               this.passwordWarning = true;
            }else if(email.value === '' && password.value != ''){
                this.emailWarning = true;
                this.passwordWarning = false;
            }else if(email.value != '' && password.value === ''){
                this.emailWarning = false;
                this.passwordWarning = true;
            }else{
                this.emailWarning = false;
                this.passwordWarning = false;
                axios.post('http://localhost:3000/user/login', {
                    email: email.value,
                    password: password.value
                    }, {
                        withCredentials: true
                    }).then(status => {
                        if(status.data.two_factor_authentication){
                            sessionStorage.setItem('email', email.value);
                            window.location.href = '../2factorAuth/2factor.html';
                        }else{
                          this.wrongCredentialsWarning = false;
                          window.location.href = '../home/home.html';
                        }
                    }).catch(error =>{
                        if(error.response && error.response.status === 429){
                            console.log("TOO MANY LOGIN ATEMPTS!");
                            this.warningMessage = "! Too many login attempts\nTry again in 10 seconds"
                        }else{
                            console.log(error);
                            this.wrongCredentialsWarning = true;
                            this.warningMessage = "! Wrong email or password";
                        }
                })

               
            }
        }
    }
});

app.mount('#login');