const app = Vue.createApp({
    data() {
        return {
           noCodeWarning: false,
           wrongCredentialsWarning: false
        }
    },

    methods: {
        formSubmit(){
           if(securityCode.value === ''){
             this.noCodeWarning = true;
           }else{
              this.noCodeWarning = false;
              const email = sessionStorage.getItem('email');
              axios.post('http://localhost:3000/two-factor-authentication/login', {
                email: email, 
                token: securityCode.value
              }, { withCredentials: true }).then(() =>{
                this.wrongCredentialsWarning = false;
                sessionStorage.removeItem('email');
                window.location.href = '../home/home.html';
              }).catch(err =>{
                this.wrongCredentialsWarning = true;
                console.log(err);
              })
           }
        }
    }
});

app.mount('#two-factor');

