var redirect_uri = "http://localhost:5500/";

var client_id = ""; // Corrected variable name
var client_secret = ""; // Corrected variable name

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token"

function onPageLoad() {
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

  if( window.location.search.length > 0){
    handleRedirect()
  }
}

function handleRedirect(){
    let code = getCode()
    fetchAccessToken(code)

    window.history.pushState("", "", redirect_uri)

}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code"
    body += "&code=" + code
    body += "&redirect_uri=" + encodeURI(redirect_uri)
    body += "&client_id=" + client_id
    body += "&client_secret=" + client_secret
    callAuthorizationApi(body)
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest()
    xhr.open("POST", TOKEN, true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret))
    xhr.send(body)
    xhr.onload = handleAuthorizationResponse
}

function handleAuthorizationResponse(){
    if( this.status == 200){
        var data = JSON.parse(this.responseText)
        console.log(data)
        var data = JSON.parse(this.responseText)
        
        if(data.access_token != undefined){
            access_token = data.access_token
            localStorage.setItem("access_token", access_token)
        }
        if(data.refresh_token != undefined){
            refresh_token = data.refresh_token
            localStorage.setItem("refresh_token", refresh_token)
        }
        onPageLoad()
    }else{
        console.log(this.responseText)
        alert(this.responseText)
    }
}

function getCode(){
    let code = null;
    const queryString = window.location.search

    if(queryString.length > 0){
        const urlParams = new URLSearchParams(queryString)
        code = urlParams.get('code')
    }

    return code
}


function requestAuthorization() {
  client_id = document.getElementById("clientId").value;
  client_secret = document.getElementById("clientSecret").value;

  localStorage.setItem("client_id", client_id);
  localStorage.setItem("client_secret", client_secret);

  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri); 
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-position%20user-library-read "; 

  window.location.href = url; 
}
