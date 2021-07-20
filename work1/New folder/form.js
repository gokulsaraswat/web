  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  firebase.analytics();



// const auth = firebase.auth();
// // Your web app's Firebase configuration
//   var firebaseConfig = {
// //firebase config stuff
//   };
  
	const auth = firebase.auth();
	
	
	function signUp(){
		
		var email = document.getElementById("email");
		var password = document.getElementById("password");
		
		const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
		promise.catch(e => alert(e.message));
		
		alert("Signed Up");
	}
	
	
	
	function signIn(){
		
		var email = document.getElementById("email");
		var password = document.getElementById("password");
		
		const promise = auth.signInWithEmailAndPassword(email.value, password.value);
		promise.catch(e => alert(e.message));
		
		
		
		
	}
	
	
	function signOut(){
		
		auth.signOut();
		alert("Signed Out");
		
	}
	
	
	
	auth.onAuthStateChanged(function(user){
		
		if(user){
			
			var email = user.email;
			alert("Active User " + email);
			
			//Take user to a different or home page

			//is signed in
			
		}else{
			
			alert("No Active User");
			//no user is signed in
		}
		
		
		
	});
	

