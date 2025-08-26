const app = Vue.createApp({
    data() {
        return {
           userDetails: [],
           name:'',
           surname:'',
           displayButtons: true,
           displayUserIcon: false,
           displayUserOptions: false,
           displayWelcome: true,
           enableDisable_2Factor: '',
           displayUserSettings: false,
           dispalyTwoFactorWindow: false,
           qrcode:''
        }
    },

    mounted(){


        axios.get('http://localhost:3000/user/details', {
                   withCredentials: true
        }).then(userDetails => {
           this.userDetails = [userDetails.data];
           this.name = this.userDetails[0].name.charAt(0).toUpperCase() +  this.userDetails[0].name.slice(1);
           this.surname = this.userDetails[0].surname.charAt(0).toUpperCase() +  this.userDetails[0].surname.slice(1);
           this.displayButtons = false;
           this.displayUserIcon = true;
           if(!this.userDetails[0].two_factor_authentication){
             this.enableDisable_2Factor = 'Enable two fator authentication';
           }else{
            this.enableDisable_2Factor = 'Disable two fator authentication';
           }
          
           
       
        }).catch(error =>{
            this.displayButtons = true;
            this.displayUserIcon = false;
            this.userDetails = [];
            this.name = '';
            this.surname = '';
            console.log(error);
        })
       

    },

    methods: {
        displayLoginForm(){
            window.location.href='../login/login.html';
        },

        displayRegisterForm(){
             window.location.href='../register/register.html';
        },

        toggleUserOtionsDisplay(){
            this.displayUserOptions = !this.displayUserOptions;
        },

        async signOut(){

            try{

            
            await axios.post('http://localhost:3000/user/signout', null,{withCredentials: true});
            this.displayButtons = true;
            this.displayUserIcon = false;
            this.displayUserOptions = false;
            this.userDetails = [];
            this.name = '';
            this.surname = '';
            window.location.reload();
            }catch (err) {
                console.error('Sign out failed:', err);
            }
        },

        homePage(){
            this.displayWelcome = true;
            window.location.reload();
        },

        twoFactorAuthentication(){
            axios.get('http://localhost:3000/two-factor-authentication/enable/disable', {
                params: {
                    two_factor_authentication: this.userDetails[0].two_factor_authentication,
                    email: this.userDetails[0].email,
                    name: this.userDetails[0].name
                }
            }).then(code => {
                this.qrcode = code.data;
            })

            if(!this.userDetails[0].two_factor_authentication){
                this.dispalyTwoFactorWindow = true;
                this.displayUserSettings = false;
            }else{
                window.location.reload();
            }

        },

        reloadPage(){
            this.qrcode = '';
            window.location.reload();
        },
        

        test(){
            console.log(typeof(this.userDetails[0].two_factor_authentication));
        }
    }
});

app.mount('#mainPage');