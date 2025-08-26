const app = Vue.createApp({
    data() {
        return {
            Name:'',
            Surname:'',
            email:'',
            password:'',
            confirmPassword:'',
            nameWarning: false,
            surnameWarning: false,
            emailWarning: false,
            passwordWarning: false,
            confirmPasswordWarning: false,
            wrongCredentialsWarning: false,
            passwordsNoMatchWarning: false
        }
    },

    methods: {
        formSubmit(){
            let isValid = true;
            this.nameWarning = false;
            this.surnameWarning = false;
            this.emailWarning = false;
            this.passwordWarning = false;
            this.confirmPasswordWarning = false;
            this.passwordsNoMatchWarning = false;
            this.wrongCredentialsWarning = false;

            if(this.Name === ''){
                this.nameWarning = true;
                isValid = false;
            }

            if(this.Surname === ''){
                this.surnameWarning = true;
                isValid = false;
            }

            if(this.email === ''){
                this.emailWarning = true;
                isValid = false;
            }

            if(this.password === ''){
                this.passwordWarning = true;
                isValid = false;
            }

            if(this.confirmPassword === ''){
                this.confirmPasswordWarning = true;
                isValid = false;
            }

            if(this.password != this.confirmPassword){
                this.passwordsNoMatchWarning = true;
                isValid = false;
            }

            if(isValid){
                let nameFirstLetterUppercase = this.Name.charAt(0).toUpperCase() +  this.Name.slice(1);
                let surnameFirstLetterUppercase = this.Surname.charAt(0).toUpperCase() +  this.Surname.slice(1);
                axios.post('http://localhost:3000/user/register', {
                    name: nameFirstLetterUppercase,
                    surname: surnameFirstLetterUppercase,
                    email: this.email,
                    password: this.password
                }).then(() => {

                    axios.post('http://localhost:3000/user/login', {
                        email: this.email,
                        password: this.password
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
                         console.log(error);
                    });


                    this.Name ='';
                    this.Surname ='';
                    this.email ='';
                    this.password ='';
                    this.confirmPassword ='';

                }).catch(err => {
                    this.wrongCredentialsWarning = true;
                })
            }

            
        }
    }
});

app.mount('#register');