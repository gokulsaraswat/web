var firebaseConfig = {
	apiKey: "AIzaSyCMywtU09-EbDCbXoZPzpfuSiloafMEreg",
	authDomain: "login-222221.firebaseapp.com",
	projectId: "login-222221",
	storageBucket: "login-222221.appspot.com",
	messagingSenderId: "255427681660",
	appId: "1:255427681660:web:1d712c606f4087163158f9",
	measurementId: "G-K7W35SN288"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
const auth = firebase.auth();
	
	
function signUp(){
  
  const emailup = document.getElementById("emailsignup");
  const passwordup = document.getElementById("passwordsignup");
  
  const promise = auth.createUserWithEmailAndPassword(emailup.value, passwordup.value);
  promise.catch(e => alert(e.message));
  
  alert("Signed Up");
}



function signIn(){
  
  const emailin = document.getElementById("emailsignin");
  const passwordin = document.getElementById("passwordsignin");
  
  const promise = auth.signInWithEmailAndPassword(emailin.value, passwordin.value);
  promise.catch(e => alert(e.message));
  
}


// function signOut(){
  
//   auth.signOut();
//   alert("Signed Out");
  
// }



auth.onAuthStateChanged(function(user){
  
  if(user){
    
    var email = user.email;
    alert("Write Now "+ email+ "is a Active User " );
    
    //Take user to a different or home page

    //is signed in
    
  }else{
    
    alert("No Active User Do it again");
    //no user is signed in
  }
  
  
  
});
