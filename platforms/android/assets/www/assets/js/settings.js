$("#url").val(localStorage.getItem('url'));
$("#save-btn").click(function(){
    localStorage.setItem('url', $("#url").val());
    window.location.href = "../index.html";  
});
$("#cancel-btn").click(function(){
    window.location.href = "../index.html";  
});